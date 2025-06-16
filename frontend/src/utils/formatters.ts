// Format a hash to show only first and last few characters
export const formatHash = (hash: string, startChars = 6, endChars = 4): string => {
  if (!hash || hash.length < startChars + endChars) return hash;
  return `${hash.substring(0, startChars)}...${hash.substring(hash.length - endChars)}`;
};
// Format a timestamp to human readable format
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};
// Format a time difference to "x time ago" format
export const formatTimeAgo = (timestamp: number): string => {
  const now = new Date().getTime();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
};
// Format a number with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * NEW: Formats a WEI value (as a hex string) to a readable MON value.
 * @param weiHex The value in WEI, represented as a hexadecimal string (e.g., "0x12a05f200")
 */
export const formatValue = (weiHex: string | number): string => {
  if (!weiHex || weiHex === '0x0') return '0.0000';

  const weiBigInt = BigInt(weiHex);
  const ether = weiBigInt / BigInt(1e14); // Use 1e14 to keep 4 decimal places of precision
  
  return (Number(ether) / 10000).toFixed(4);
};