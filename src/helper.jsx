// Format timestamp (Discord style)
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

  if (diffInDays === 1) {
    return `Yesterday at ${timeFormatter.format(date)}`;
  }

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
};