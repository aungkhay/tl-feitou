import API from "../http";
import md5 from "md5";
import { useUserStore } from "../../stores/user";
const prefix = '/api';

/**
 * 
 * @param {string} username 账号
 * @param {string} password 密码
 * @returns 
 */
export const REGISTER = async (username, password) => {
    const res = await API.post(`${prefix}/user/regist`, {
        username: username,
        password: md5(password)
    })
    return res;
}

/**
 * 
 * @param {string} name 选手名称(可选）
 * @param {integer} is_virtual 是否虚拟（可选 0 不是 1 是）
 * @param {integer} is_hide 是否隐藏（可选 0 不是 1 是）
 * @param {integer} page 页码（可选，默认1）
 * @param {integer} perPage 每页数量（可选，默认10）
 * @returns 
 */
export const GET_USER_LIST = async (name, is_virtual, is_hide, page, perPage) => {
    const res = await API.post(`${prefix}/player/get_player`, {
        name: name,
        is_virtual: is_virtual,
        is_hide: is_hide,
        currentPage: page,
        pageSize: perPage
    })
    return res;
}

/**
 * 增加权限
 * @param {string} permission_name 权限名称
 * @param {string} description 对权限的描述
 * @returns 
 */
export const ADD_PERMISSIONS = async (permission_name, description) => {
    const res = await API.post(`${prefix}/user/add_permissions`, {
        permission_name: permission_name,
        description: description
    })
    return res;
}

/**
 * 获取权限
 * @returns 
 */
export const GET_PERMISSIONS = async () => {
    const res = await API.get(`${prefix}/user/get_permissions`)
    return res;
}
 /**
  * 
  * @param {integer} id 
  * @param {string} permission_name 权限名称
  * @param {string} description 对权限的描述
  * @returns 
  */
export const EDIT_PERMISSIONS = async (id, permission_name, description) => {
    const res = await API.post(`${prefix}/user/edit_permissions`, {
        id: id,
        permission_name: permission_name,
        description: description
    })
    return res;
}

/**
 * 设定用户权限
 * @param {string} username 用户名
 * @param {integer} permissions_id array of permission id
 * @returns 
 */
export const SET_USER_PERMISSIONS = async (username, permissions_id) => {
    const res = await API.post(`${prefix}/user/set_user_permissions`, {
        username: username,
        permissions_id: permissions_id
    })
    return res;
}