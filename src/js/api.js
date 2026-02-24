import API from "./http";
import md5 from "md5";
import { useUserStore } from "../stores/user";
const prefix = '/api';

export const LOGIN = async (username, password) => {
    const res = await API.post(`${prefix}/user/login`, {
        username: username,
        password: md5(password)
    })
    if (res.code === 200) {
        const userStore = useUserStore();
        userStore.setToken(res.data.token);
        userStore.setIsLoggedIn(true);
    }

    return res;
}