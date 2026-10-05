export function isSafeInternalPath(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\');
}
export function getSafeRedirect(value, fallback = '/home') {
  return isSafeInternalPath(value) ? value : fallback;
}
