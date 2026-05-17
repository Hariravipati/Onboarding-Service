export function maskPan(pan: string): string {
  if (!pan || pan.length < 4) return '****';
  return `****${pan.slice(-4)}`;
}

export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar || aadhaar.length < 4) return '****';
  return `XXXX-XXXX-${aadhaar.slice(-4)}`;
}

export function maskAccount(account: string): string {
  if (!account || account.length < 4) return '****';
  return `****${account.slice(-4)}`;
}
