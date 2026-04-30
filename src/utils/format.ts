export function toNumber(value: number | string | undefined | null, fallback = 0): number {
  if (value === undefined || value === null || value === '') return fallback;
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return Number.isFinite(n) ? n : fallback;
}

export function formatPrice(price: number | string, decimals?: number): string {
  const num = toNumber(price);
  if (decimals !== undefined) {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  if (num >= 1000) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (num >= 1) return num.toFixed(4);
  if (num >= 0.01) return num.toFixed(5);
  return num.toFixed(8);
}

export function formatSize(size: number | string, decimals = 4): string {
  const num = toNumber(size);
  return num.toFixed(decimals);
}

export function formatUsd(value: number | string, decimals = 2): string {
  const num = toNumber(value);
  const prefix = num < 0 ? '-$' : '$';
  return `${prefix}${Math.abs(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatCompact(value: number | string): string {
  const num = toNumber(value);
  const abs = Math.abs(num);
  if (abs >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

export function formatPctChange(change: number | string): string {
  const num = toNumber(change);
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

export function formatAddress(addr: string, prefix = 6, suffix = 4): string {
  if (!addr) return '';
  if (addr.length <= prefix + suffix) return addr;
  return `${addr.slice(0, prefix)}...${addr.slice(-suffix)}`;
}

export function formatFundingRate(rate: number | string): string {
  const num = toNumber(rate) * 100;
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(4)}%`;
}

export function formatTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatDate(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}
