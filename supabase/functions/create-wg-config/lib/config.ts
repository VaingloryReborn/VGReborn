interface ConfigParams {
  address: string;
  privateKey: string;
  serverPublicKey: string;
  endpoint: string;
  allowedIps: string;
}

export function generateClientConfig({
  address,
  privateKey,
  serverPublicKey,
  endpoint,
  allowedIps
}: ConfigParams): string {
  return [
    "[Interface]",
    `Address = ${address}`,
    `PrivateKey = ${privateKey}`,
    "MTU = 1280",
    "",
    "[Peer]",
    `PublicKey = ${serverPublicKey}`,
    `Endpoint = ${endpoint}`,
    `AllowedIPs = ${allowedIps}`,
    "PersistentKeepalive = 25",
    "",
  ].join("\n");
}
