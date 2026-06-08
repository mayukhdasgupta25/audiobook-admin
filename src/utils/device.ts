import type { DeviceInfo } from '../types/auth';

const DEVICE_ID_KEY = 'browserDeviceId';

function getOrCreateDeviceId(): string {
   const existingId = localStorage.getItem(DEVICE_ID_KEY);
   if (existingId) {
      return existingId;
   }

   const deviceId = crypto.randomUUID();
   localStorage.setItem(DEVICE_ID_KEY, deviceId);
   return deviceId;
}

/**
 * Returns stable browser device metadata for auth requests.
 */
export function getBrowserDeviceInfo(): DeviceInfo {
   return {
      deviceId: getOrCreateDeviceId(),
      platform: 'web',
      userAgent: navigator.userAgent,
   };
}
