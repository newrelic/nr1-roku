export const formatTimestamp = timestamp => Intl.DateTimeFormat('default', {
  month: 'short', day: 'numeric',
  hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(new Date(timestamp));
