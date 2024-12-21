import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true
});

const getCsrfToken = () => {
    const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
    // console.log(csrfToken)
    return csrfToken;
}

const fetchCsrfToken = async () =>{
    try{
        const response = await axiosInstance.get('/csrf/')
        const csrfToken = response.data.csrfToken;
        document.cookie = `csrftoken=${csrfToken}; path=/; SameSite=Lax`;
        return csrfToken;
    } catch (error) {
        console.error('Failed to fetch CSRF token', error);
        throw error;
    }
};

const ensureCsrfToken = async () => {
    let csrfToken = getCsrfToken();
    // console.log('do i have csrf token before?', csrfToken)
    if (!csrfToken) {
        // console.log('fetching csrf token')
        csrfToken = await fetchCsrfToken();
    }
    // console.log('do i have csrf token after?', csrfToken)
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

// axiosInstance.interceptors.response.use(
//     response => response,
//     async (error) => {
//         try{
//             if (error.response?.status === 401 &&
//                 !error.config.url.includes('/login/')) {
//                     console.log('Session expired. Logging out...')
//                 const isSession = await axiosInstance.get('/session/')
//                 console.log(isSession)
//                 if (!isSession.data.session) {
//                     import('../app/store').then(({store})=>{
//                         store.dispatch(logout());
//                     })
//                     console.log('Logged out')
//                 }
//             }
    
//             if (error.response?.status === 403) {
//                 import('../app/store').then(({store})=>{
//                     store.dispatch(setAuthError('You do not have permission for this action.'));
//                 })
//             }
//             return Promise.reject(error)
//         } catch (error) {
//             return Promise.reject(error);
//         }
//     }
// )

export default axiosInstance;