#!/bin/bash

# ==========================================
# WireGuard + Mitmproxy One-Click Install Script
# Supported OS: Ubuntu 20.04+, Debian 10+
# ==========================================

set -e

# Color Definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run this script with sudo${NC}"
  exit 1
fi

echo -e "${GREEN}Initializing installation...${NC}"
ORIGINAL_PWD=$(pwd)

# 1. Get Public IP
PUBLIC_IP=$(curl -s http://ip-api.com/json | grep -o '"query":"[^"]*' | cut -d'"' -f4)
if [ -z "$PUBLIC_IP" ]; then
    PUBLIC_IP=$(curl -s ifconfig.me)
fi
echo -e "Detected Server IP: ${YELLOW}$PUBLIC_IP${NC}"

# 2. Install dependencies
apt-get update
apt-get install -y wireguard curl wget python3 python3-pip iptables

# 3. Enable IP Forwarding
echo "net.ipv4.ip_forward=1" > /etc/sysctl.d/99-wireguard.conf
sysctl -p /etc/sysctl.d/99-wireguard.conf

WG_PORT=443
echo -e "${GREEN}Configuring WireGuard...${NC}"
mkdir -p /etc/wireguard
cd /etc/wireguard
umask 077

# Detect real outbound network interface (for NAT masquerading)
OUT_IF=$(ip route get 8.8.8.8 2>/dev/null | awk '/dev/ {for(i=1;i<=NF;i++){if($i=="dev"){print $(i+1);break}}}')
if [ -z "$OUT_IF" ]; then
  # Fallback: try to get from default route
  OUT_IF=$(ip route | awk '/default/ {print $5; exit}')
fi
echo -e "Detected Outbound Interface: ${YELLOW}${OUT_IF:-unknown}${NC}"

# Generate keys
if [ ! -f privatekey ]; then
    wg genkey | tee privatekey | wg pubkey > publickey
    wg genkey | tee client_privatekey | wg pubkey > client_publickey
fi

SERVER_PRIV_KEY=$(cat privatekey)
CLIENT_PUB_KEY=$(cat client_publickey)
CLIENT_PRIV_KEY=$(cat client_privatekey)
SERVER_PUB_KEY=$(cat publickey)

WG_ALLOWED_IPS=""
for domain in preauth.superevil.net rpc.kindred-live.net; do
    ips=$(getent hosts "$domain" | awk '{print $1}')
    for ip in $ips; do
        entry="$ip/32"
        case ",$WG_ALLOWED_IPS," in
            *",$entry,"*) ;;
            *)
                if [ -z "$WG_ALLOWED_IPS" ]; then
                    WG_ALLOWED_IPS="$entry"
                else
                    WG_ALLOWED_IPS="$WG_ALLOWED_IPS,$entry"
                fi
                ;;
        esac
    done
done
for ip in 34.146.101.181; do
    entry="$ip/32"
    case ",$WG_ALLOWED_IPS," in
        *",$entry,"*) ;;
        *)
            if [ -z "$WG_ALLOWED_IPS" ]; then
                WG_ALLOWED_IPS="$entry"
            else
                WG_ALLOWED_IPS="$WG_ALLOWED_IPS,$entry"
            fi
            ;;
    esac
done
if [ -z "$WG_ALLOWED_IPS" ]; then
    WG_ALLOWED_IPS="0.0.0.0/0"
fi

# Generate Server Config
cat > /etc/wireguard/wg0.conf <<EOF
[Interface]
Address = 10.8.0.1/24
ListenPort = $WG_PORT
MTU = 1280
PrivateKey = $SERVER_PRIV_KEY
PostUp = iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o ${OUT_IF} -j MASQUERADE; iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t mangle -A FORWARD -i wg0 -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu; iptables -t mangle -A FORWARD -o wg0 -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu
PostDown = iptables -t nat -D POSTROUTING -s 10.8.0.0/24 -o ${OUT_IF} -j MASQUERADE; iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t mangle -D FORWARD -i wg0 -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu; iptables -t mangle -D FORWARD -o wg0 -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu

[Peer]
PublicKey = $CLIENT_PUB_KEY
AllowedIPs = 10.8.0.2/32
EOF

# Generate Client Config
cat > /etc/wireguard/client.conf <<EOF
[Interface]
Address = 10.8.0.2/32
PrivateKey = $CLIENT_PRIV_KEY
DNS = 8.8.8.8
MTU = 1280

[Peer]
PublicKey = $SERVER_PUB_KEY
Endpoint = $PUBLIC_IP:$WG_PORT
AllowedIPs = $WG_ALLOWED_IPS
PersistentKeepalive = 25
EOF

# Start WireGuard
systemctl enable wg-quick@wg0
systemctl restart wg-quick@wg0

# 5. Install Mitmproxy
echo -e "${GREEN}Installing Mitmproxy...${NC}"
# Try to download binary to avoid Python environment issues (using v10.0.0)
if ! command -v mitmdump &> /dev/null; then
    cd /tmp
    wget https://downloads.mitmproxy.org/10.0.0/mitmproxy-10.0.0-linux.tar.gz
    tar -zxvf mitmproxy-10.0.0-linux.tar.gz -C /usr/bin/
    rm mitmproxy-10.0.0-linux.tar.gz
fi

# 6. Configure Mitmproxy script
mkdir -p /opt
cat > /opt/mitm_print.py <<EOF
from mitmproxy import http
import json
import datetime

def response(flow: http.HTTPFlow):
    try:
        req = flow.request
        resp = flow.response
        
        # Log only JSON or Text
        content_type = resp.headers.get("Content-Type", "")
        
        client_addr = getattr(flow, "client_conn", None)
        client_ip = None
        client_port = None
        if client_addr and client_addr.address:
            client_ip, client_port = client_addr.address
        
        log_entry = {
            "time": datetime.datetime.now().isoformat(),
            "client_ip": client_ip,
            "method": req.method,
            "url": req.pretty_url,
            "status": resp.status_code,
            "res_body": ""
        }

        # Simple filter for static resources
        if any(x in content_type for x in ["image", "video", "audio", "stream"]):
             log_entry["res_body"] = "[Media Content]"
        else:
            if resp.content:
                try:
                    body_str = resp.content.decode('utf-8')
                    try:
                        log_entry["res_body"] = json.loads(body_str)
                    except:
                        log_entry["res_body"] = body_str[:1000]
                except:
                    log_entry["res_body"] = "[Binary Data]"

        print(json.dumps(log_entry, ensure_ascii=False))
        print("-" * 40)
        
    except Exception as e:
        print(f"Log Error: {e}")
EOF

# 7. Configure Systemd Service
# Regular Proxy Service (3128)
cat > /etc/systemd/system/mitm-proxy.service <<EOF
[Unit]
Description=Mitmproxy Regular Mode
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/mitmdump --set block_global=false --ssl-insecure -p 3128 -s /opt/mitm_print.py
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable mitm-proxy
systemctl restart mitm-proxy

# 8. Setup Transparent Proxy Forwarding Rules (Optional, enabled by default)
# Redirect wg0 HTTPS traffic to mitmproxy
# Note: This intercepts HTTPS, client needs to trust the certificate
iptables -t nat -A PREROUTING -i wg0 -p tcp --dport 443 -j REDIRECT --to-ports 3128
iptables -t nat -A PREROUTING -i ${OUT_IF} -p udp --dport 50000:65499 -j REDIRECT --to-ports $WG_PORT

# Save iptables rules
DEBIAN_FRONTEND=noninteractive apt-get install -y iptables-persistent
netfilter-persistent save

echo -e "${GREEN}================ Installation Completed ================${NC}"

# Copy config files to execution directory
cp /etc/wireguard/client.conf "$ORIGINAL_PWD/"
if [ -f /root/.mitmproxy/mitmproxy-ca-cert.pem ]; then
    cp /root/.mitmproxy/mitmproxy-ca-cert.pem "$ORIGINAL_PWD/"
fi

# Change ownership (if running with sudo)
if [ ! -z "$SUDO_USER" ]; then
    chown $SUDO_USER:$SUDO_USER "$ORIGINAL_PWD/client.conf"
    chown $SUDO_USER:$SUDO_USER "$ORIGINAL_PWD/mitmproxy-ca-cert.pem"
fi

echo -e "1. Client Config File:"
echo -e "   - Saved to: ${GREEN}$ORIGINAL_PWD/client.conf${NC}"
echo -e "   - Content:"
echo -e "${YELLOW}"
cat /etc/wireguard/client.conf
echo -e "${NC}"

echo -e "2. CA Certificate Path:"
echo -e "   - Copied to: ${GREEN}$ORIGINAL_PWD/mitmproxy-ca-cert.pem${NC}"
echo -e "   (Please download and install it to Trusted Root Certification Authorities on your phone/computer)"
echo -e "3. View logs in real-time: journalctl -u mitm-proxy -f"
