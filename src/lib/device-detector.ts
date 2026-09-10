/**
 * Parses user agent string to detect OS and device type for Smart Redirects & Analytics
 */
export function detectDeviceOS(userAgent: string = '') {
  const ua = userAgent.toLowerCase();

  let os = 'Unknown OS';
  let device: 'Mobile' | 'Desktop' | 'Tablet' = 'Desktop';
  let browser = 'Unknown Browser';

  // OS Detection
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    os = 'iOS';
    device = ua.includes('ipad') ? 'Tablet' : 'Mobile';
  } else if (ua.includes('android')) {
    os = 'Android';
    device = ua.includes('mobile') ? 'Mobile' : 'Tablet';
  } else if (ua.includes('macintosh') || ua.includes('mac os x')) {
    os = 'macOS';
    device = 'Desktop';
  } else if (ua.includes('windows')) {
    os = 'Windows';
    device = 'Desktop';
  } else if (ua.includes('linux')) {
    os = 'Linux';
    device = 'Desktop';
  }

  // Browser Detection
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome')) browser = device === 'Mobile' ? 'Chrome Mobile' : 'Chrome';
  else if (ua.includes('safari')) browser = device === 'Mobile' ? 'Mobile Safari' : 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';

  return { os, device, browser };
}

/**
 * Resolves Smart Redirect destination link based on User Agent
 */
export function getSmartAppDestination(iosUrl: string, androidUrl: string, fallbackUrl: string, userAgent: string = '') {
  const { os } = detectDeviceOS(userAgent);
  if (os === 'iOS' && iosUrl) return iosUrl;
  if (os === 'Android' && androidUrl) return androidUrl;
  return fallbackUrl || iosUrl || androidUrl;
}
