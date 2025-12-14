const isProd = import.meta.env.MODE === 'production';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const IS_PROD = isProd;
export const IS_DEV = !isProd;

export default {
    API_BASE_URL,
    IS_PROD,
    IS_DEV
};
