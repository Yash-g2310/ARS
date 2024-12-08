import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true
});

const getCsrfToken = async () => {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
}

const ensureCsrfToken = async () => {
    let csrfToken = getCsrfToken();
    if (!csrfToken) {
        csrfToken = await axiosInstance.get('/csrf/');
    }
    return csrfToken;
}

axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            if (config.method !== 'get') {
                const csrfToken = await ensureCsrfToken();

                if (csrfToken) {
                    config.headers['X-CSRFToken'] = csrfToken;
                }
            }
            return config;
        } catch (error) {
            return Promise.reject(error);
        }
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        try{
            if (error.response?.status === 401 &&
                !error.config.url.includes('/login/')) {
                const isSession = await axiosInstance.get('/session/')
                if (!isSession.data.session) {
                    import('../app/store').then(({store})=>{
                        store.dispatch(logout());
                    })
                }
            }
    
            if (error.response?.status === 403) {
                import('../app/store').then(({store})=>{
                    store.dispatch(setAuthError('You do not have permission for this action.'));
                })
            }
            return Promise.reject(error)
        } catch (error) {
            return Promise.reject(error);
        }
    }
)

export default axiosInstance;