export function isSafeInternalPath(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\\')
  );
}

export function getSafeRedirect(value: unknown, fallback = '/home') {
  return isSafeInternalPath(value) ? value : fallback;
}
