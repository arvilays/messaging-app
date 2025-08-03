export const formatTimestamp = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();

  const isSameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const isYesterday = (a, b) => {
    const yesterday = new Date(b);
    yesterday.setDate(b.getDate() - 1);
    return isSameDay(a, yesterday);
  };

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isSameDay(date, now)) {
    return time;
  } else if (isYesterday(date, now)) {
    return `Yesterday at ${time}`;
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year} at ${time}`;
  }
};
