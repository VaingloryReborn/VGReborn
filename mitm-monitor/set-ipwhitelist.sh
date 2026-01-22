#!/bin/bash
# WireGuard Whitelist Script
# Restricts wg0 clients to specific destination IPs

set -e

# Define Allowed IPs
ALLOWED_IPS=(
    "34.160.58.175"  # preauth.superevil.net
    "34.160.208.252" # platformUrl, rpc.kindred-live.net
    "34.146.101.181" # Ping Server
    "35.233.231.76"  # notifyUrl, Lobby/Push Service
    "35.221.124.59"  # Game Server
    "104.19.223.79"  # mitm.it
    "185.199.108.153" # whatismyipaddress.com
    "8.8.8.8"        # Google DNS (Required per client conf)
    "10.8.0.1"       # VPN Gateway
)

echo "Setting up WireGuard Whitelist..."

# 1. Create custom chain in Mangle table
iptables -t mangle -N WG_WHITELIST 2>/dev/null || iptables -t mangle -F WG_WHITELIST

# 2. Add Allowed IPs to the chain
for ip in "${ALLOWED_IPS[@]}"; do
    echo "Allowing: $ip"
    iptables -t mangle -A WG_WHITELIST -d "$ip" -j RETURN
done

# 3. Drop everything else
echo "Dropping all other traffic..."
iptables -t mangle -A WG_WHITELIST -j DROP

# 4. Apply rule to PREROUTING (Incoming from wg0)
# Use -I to insert at the top to ensure it runs before other rules
if ! iptables -t mangle -C PREROUTING -i wg0 -j WG_WHITELIST 2>/dev/null; then
    iptables -t mangle -I PREROUTING -i wg0 -j WG_WHITELIST
fi

echo "Whitelist applied successfully."
netfilter-persistent save