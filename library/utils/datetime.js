/* eslint-disable no-nested-ternary */

export const formatTimestamp = timestamp => {
  const dt = new Date(timestamp);

  return dt instanceof Date && !isNaN(dt)
    ? Intl.DateTimeFormat('default', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }).format(dt)
    : '';
};

export const timeStringFromTimeRange = timeRange =>
  timeRange.duration
    ? `SINCE ${Date.now() - timeRange.duration}`
    : `SINCE ${timeRange.begin_time} UNTIL ${timeRange.end_time}`;

const relativeTime = timestamp => {
  const s = (Date.now() - new Date(timestamp).getTime()) / 1e3;
  const m = s / 60;
  const h = m / 60;
  const d = h / 24;
  const y = d / 365.242199;
  let tmp;

  return (tmp = Math.round(s)) === 1
    ? 'just now'
    : m < 1.01
    ? `${tmp} seconds ago`
    : (tmp = Math.round(m)) === 1
    ? 'a minute ago'
    : h < 1.01
    ? `${tmp} minutes ago`
    : (tmp = Math.round(h)) === 1
    ? 'an hour ago'
    : d < 1.01
    ? `${tmp} hours ago`
    : (tmp = Math.round(d)) === 1
    ? 'yesterday'
    : y < 1.01
    ? `${tmp} days ago`
    : (tmp = Math.round(y)) === 1
    ? 'a year ago'
    : `${tmp} years ago`;
};

export const subtitleFromQueryTime = queryTime => {
  if (!queryTime) return '';

  const timestamps = queryTime.match(/(\d+)/g).map(ts => parseInt(ts));
  if (!timestamps || !timestamps.length) return '';

  return timestamps.length === 1
    ? `Since ${relativeTime(timestamps[0])}`
    : `${formatTimestamp(timestamps[0])} - ${formatTimestamp(timestamps[1])}`;
};
