// Helper to get mobile-accessible network origin
export function getAccessibleUrl(pathWithQuery: string = ''): string {
  const currentOrigin = window.location.origin;
  // If running on local computer 'localhost', use the local network IP so phone scan works
  let base = currentOrigin;
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    base = `http://192.168.100.7:${window.location.port || '5173'}`;
  }
  return `${base}${pathWithQuery}`;
}
