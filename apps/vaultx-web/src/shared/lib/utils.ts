import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Add timeAgo function
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return `${Math.floor(interval)} year${
      Math.floor(interval) === 1 ? '' : 's'
    } ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} month${
      Math.floor(interval) === 1 ? '' : 's'
    } ago`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} day${
      Math.floor(interval) === 1 ? '' : 's'
    } ago`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hour${
      Math.floor(interval) === 1 ? '' : 's'
    } ago`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minute${
      Math.floor(interval) === 1 ? '' : 's'
    } ago`;
  }
  return `${Math.floor(seconds)} second${
    Math.floor(seconds) === 1 ? '' : 's'
  } ago`;
}
