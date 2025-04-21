/**
 * Format date string to localized format
 * @param dateString ISO date string to format
 * @param locale Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(dateString: string, locale = 'en-US') {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format date with time
 * @param dateString ISO date string to format
 * @param locale Locale for formatting (default: 'en-US')
 * @returns Formatted date string with time
 */
export function formatDateTime(dateString: string, locale = 'en-US') {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format relative time (e.g. "2 days ago")
 * @param dateString ISO date string to format
 * @param locale Locale for formatting (default: 'en-US')
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string, locale = 'en-US') {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  
  // Convert milliseconds to appropriate units
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Approximate
  const years = Math.floor(days / 365); // Approximate
  
  // Use Intl.RelativeTimeFormat if available
  if (typeof Intl.RelativeTimeFormat !== 'undefined') {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    if (years < 0) return rtf.format(years, 'year');
    if (months < 0) return rtf.format(months, 'month');
    if (days < 0) return rtf.format(days, 'day');
    if (hours < 0) return rtf.format(hours, 'hour');
    if (minutes < 0) return rtf.format(minutes, 'minute');
    return rtf.format(seconds, 'second');
  }
  
  // Fallback for browsers without RelativeTimeFormat
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
} 