
export function ipToNum(ip: string): number {
  const parts = ip.split('/')[0].split('.').map(Number);
  return (parts[0] * 16777216) + (parts[1] * 65536) + (parts[2] * 256) + parts[3];
}

export function numToIp(num: number): string {
  const part1 = Math.floor(num / 16777216) % 256;
  const part2 = Math.floor(num / 65536) % 256;
  const part3 = Math.floor(num / 256) % 256;
  const part4 = num % 256;
  return `${part1}.${part2}.${part3}.${part4}/32`;
}
