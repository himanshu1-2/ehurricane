const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export { BACKEND_URL };
export const PRODUCTS_URL = `${BACKEND_URL}/api/products`;
export const USERS_URL = `${BACKEND_URL}/api/users`;
export const ORDERS_URL = `${BACKEND_URL}/api/orders`;
export const COUPONS_URL = `${BACKEND_URL}/api/coupons`;
export const VENDORS_URL = `${BACKEND_URL}/api/vendors`;
export const UPLOAD_URL = `${BACKEND_URL}/api/upload`;

export const resolveImage = (uri) => {
  if (!uri) return null;
  if (uri.startsWith('http://') || uri.startsWith('https://')) return uri;
  if (!BACKEND_URL) return uri;
  return `${BACKEND_URL}${uri.startsWith('/') ? '' : '/'}${uri}`;
};
