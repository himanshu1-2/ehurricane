// export const BASE_URL =
//   process.env.NODE_ENV === 'develeopment' ? 'http://localhost:5000' : '';
export const BASE_URL = ''; // If using proxy
export const PRODUCTS_URL = `${process.env.REACT_APP_BACKEND_URL}/api/products`;
export const USERS_URL = `${process.env.REACT_APP_BACKEND_URL}/api/users`;
export const ORDERS_URL = `${process.env.REACT_APP_BACKEND_URL}/api/orders`;
export const PAYPAL_URL = `${process.env.REACT_APP_BACKEND_URL}/api/config/paypal`;
