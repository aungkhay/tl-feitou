import API from "../http";
const prefix = '/api/ht';
    
/**
 * 修改密码
 * @param {string} account 用户名
 * @param {string} old_password 旧密码
 * @param {string} new_password 新密码
 * @param {string} new_password2 确认新密码
 * @param {string} group_nickname 群昵称 (台号)
 * @returns {Promise<import("axios").AxiosResponse<any>>}
 */
export const EDIT_PASSWORD = async (account, old_password, new_password, new_password2, group_nickname) => {
    return await API.post(`${prefix}/system_setup/edit_pw`, {
        account: account,
        old_password: old_password,
        new_password: new_password,
        new_password2: new_password2,
        group_nickname: group_nickname
    });
}

/**
 * 设置飞机token
 * @param {string} telegram_token 飞机token
 * @param {string} group_nickname 群昵称 (台号)
 * @returns {Promise<import("axios").AxiosResponse<any>>}
 */
export const TELEGRAM_TOKEN_SETUP = async (telegram_token, group_nickname) => {
    return await API.post(`${prefix}/system_setup/telegram_token_setup`, {
        telegram_token: telegram_token,
        group_nickname: group_nickname
    });
}