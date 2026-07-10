import axios from "axios";
import { useUserStore } from "../stores/user";
import router from "../router";

const isElectron = import.meta.env.VITE_IS_ELECTRON === 'true';
const isProd = import.meta.env.VITE_IS_PROD === 'true';

let BASEURL = '/';
if (isProd && isElectron) {
    BASEURL = import.meta.env.VITE_PROD_BASE_URL;
} else if (isElectron) {
    BASEURL = import.meta.env.VITE_BASE_URL;
}
let API = axios.create({
    baseURL: BASEURL,
    timeout: 20000,
    headers: {
        Accept: 'application/json',
    }
});

const logout = () => {
    const userStore = useUserStore();
    // Unauthorized
    localStorage.removeItem('_token_');
    userStore.setIsLoggedIn(false);
    userStore.setToken('');
    router.push({ name: 'login' });
}

API.interceptors.response.use(
    response => {
        var res = response.data;

        if(res.status == 403) {
            logout();
        }

        return Promise.resolve(res);
    },
    error => {
        if (error.response?.data?.status == 403) {
            logout();
        }
        return Promise.resolve(error.response?.data || { code: 500, message: '网络异常，请稍后再试' });
    }
);

API.defaults.params = {};
API.interceptors.request.use((config) => {
    const userStore = useUserStore();
    if (userStore.isLoggedIn) {
        config.headers.token = userStore.token;
    }
    if (isElectron) {
        config.url = config.url?.replace('/api', '');
    }
    return config;
}, (error) => {
    return Promise.resolve(error.response);
});

export default API