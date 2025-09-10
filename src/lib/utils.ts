import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAddress } from "viem";
import { intervalToDuration, formatDuration } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenAddress = (address: string, length: number) => {
  if (!isAddress(address)) return "";

  return address.slice(0, length + 2) + "..." + address.slice(-length);
};

// Utility functions
export const formatTimeRemaining = (seconds: number) => {
  if (seconds <= 0) return "Unlocked";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const getTimeRemaining = (seconds: number): string => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  
  return formatDuration(duration, { 
    format: ['days', 'hours', 'minutes'],
    delimiter: ' '
  }) || '0 minutes';
};



export const calculateProgress = (duration: bigint, durationLeft: bigint): number => {
  if (duration === 0n) return 100;
  
  const elapsed = duration - durationLeft;
  return Number((elapsed * 100n) / duration);
};
