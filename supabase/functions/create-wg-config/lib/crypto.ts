import { x25519 } from "https://esm.sh/@noble/curves@1.4.0/ed25519"

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function generateWireGuardKeyPair() {
  const priv = x25519.utils.randomPrivateKey()
  const pub = x25519.getPublicKey(priv)
  return {
    privateKey: bytesToBase64(priv),
    publicKey: bytesToBase64(pub),
  }
}
