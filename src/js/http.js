import axios from "axios";
import { useUserStore } from "../stores/user";
import router from "../router";

const isEelectron = false;

let BASEURL = isEelectron ? import.meta.env.VITE_BASE_URL : '/';
let API = axios.create({
    baseURL: BASEURL,
    timeout: 20000,
    headers: {
        Accept: 'application/json',
    }
});

API.interceptors.response.use(
    response => {
        var res = response.data;

        if(res.status == 403) {
            const userStore = useUserStore();
            // Unauthorized
            localStorage.removeItem('_token_');
            userStore.setIsLoggedIn(false);
            userStore.setToken('');
            router.push({ name: 'login' });
        }

        return Promise.resolve(res);
    },
    error => {
        console.log(error);
        return Promise.resolve(error.response);
    }
);

API.defaults.params = {};
API.interceptors.request.use((config) => {
    const userStore = useUserStore();
    if (userStore.isLoggedIn) {
        config.headers.token = userStore.token;
    }
    if (isEelectron) {
        config.url = config.url?.replace('/api', '');
    }
    return config;
}, (error) => {
    return Promise.resolve(error.response);
});

export default API