export const formatTimestamp = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.round((now - date) / 1000);
  const diffInDays = Math.floor(diffInSeconds / 86400);

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  // Return just the time if date is today
  if (diffInDays === 0) {
    return timeFormatter.format(date);
  }

  const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

  if (diffInDays === 1) {
    return `Yesterday at ${timeFormatter.format(date)}`;
  }

  if (diffInDays > 1 && diffInDays < 7) {
    return `${rtf.format(-diffInDays, 'day')} at ${timeFormatter.format(date)}`;
  }

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return `${dateFormatter.format(date)} at ${timeFormatter.format(date)}`;
};