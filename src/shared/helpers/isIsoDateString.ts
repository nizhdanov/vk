export function isIsoDateString(str: unknown): boolean {
  if (!str) return false;

  if (typeof str !== 'string') return false;

  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;

  if (!isoRegex.test(str)) return false;

  const date = new Date(str);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, -5) === str.slice(0, -1);
}
