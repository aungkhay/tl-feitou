import API from "../http";
import md5 from "md5";
import { useUserStore } from "../../stores/user";
const prefix = '/api';

/**
 * 登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise<{ userId: integer, token: string, account: string, enable: integer }>} 登录成功返回
 */
export const LOGIN = async (username, password) => {
    const res = await API.post(`${prefix}/user/login`, {
        username: username,
        password: md5(password)
    })
    if (res.code === 200) {
        const userStore = useUserStore();
        userStore.setToken(res.data.token);
        userStore.setIsLoggedIn(true);
        userStore.setProfile({
            userId: res.data.userId,
            account: res.data.account,
            enable: res.data.enable
        });
    }

    return res;
}