// Device ID management
// Generates and stores a unique device ID in cookies

const DEVICE_ID_KEY = 'bruin_pong_device_id';
const COOKIE_EXPIRY_DAYS = 365; // Cookie expires in 1 year

// Gets a cookie value by name
function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Sets a cookie with the given name, value, and expiration
function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

/* Gets or creates a unique device ID
 Stores it in cookies so it persists across sessions */
export function getDeviceId(): string {
  let deviceId = getCookie(DEVICE_ID_KEY);
  
  if (!deviceId) {
    // Generate a new device ID using crypto API if available, otherwise use a simple UUID
    deviceId = generateDeviceId();
    setCookie(DEVICE_ID_KEY, deviceId, COOKIE_EXPIRY_DAYS);
  }
  
  return deviceId;
}

// Generates a unique device ID
function generateDeviceId(): string {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback: generate a simple UUID v4-like string
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

