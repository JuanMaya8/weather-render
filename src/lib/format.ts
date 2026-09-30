export function formatTime(date: Date): string {
  return date.toLocaleString('en-GB', {
    timeZone: 'America/Bogota',
    dateStyle: 'medium',
    timeStyle: 'medium',
  });
}
