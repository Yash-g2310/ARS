import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

let csrfToken = null;

const fetchCsrfToken = async () => {
    try {
        const response = await axiosInstance.get('/csrf/');
        if (response.data.csrfToken) {
            csrfToken = response.data.csrfToken;
        }
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};

axiosInstance.interceptors.request.use(async function (config) {
    if (!csrfToken && config.method !== 'get') {
        await fetchCsrfToken();
    }
    if (csrfToken && config.method !== 'get') {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

fetchCsrfToken();

export default axiosInstance;