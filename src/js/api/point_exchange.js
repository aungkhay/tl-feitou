import API from "../http";
import moment from "moment";

const prefix = '/api/ht';

/**
 * 获取兑换记录
 * @param {string} group_nickname 操作台(群昵称) 
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {string} player_name 玩家名称
 * @param {string} option_type 操作类型 (兑换/清零)
 * @param {number} is_virtual 是否虚拟
 * @param {number} currentPage 当前页
 * @param {number} pageSize 每页数量
 * @returns 
 */
export const GET_POINTS_EXCHANGE_INFO = async (group_nickname, startTime, endTime, player_name, option_type, is_virtual, currentPage, pageSize) => {
    return await API.post(`${prefix}/points_exchange/get_exchange_info`, {
        group_nickname: group_nickname,
        startTime: startTime ? moment(startTime).format('YYYY-MM-DD') : '',
        endTime: endTime ? moment(endTime).format('YYYY-MM-DD') : '',
        player_name: player_name,
        option_type: option_type,
        is_virtual: is_virtual,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 单个玩家兑换(所有群)
 * @param {string} player_name 玩家名称
 * @returns 
 */
export const SINGLE_PLAYER_ALL_GROUP_EXCHANGE = async (player_name) => {
    return await API.post(`${prefix}/points_exchange/single_player_all_group_exchange`, {
        player_name: player_name
    });
}

/**
 * 一键兑换(一个群玩家）
 * @param {string} group_nickname 群昵称
 * @returns 
 */
export const SINGLE_GROUP_EXCHANGE = async (group_nickname) => {
    return await API.post(`${prefix}/points_exchange/single_group_exchange`, {
        group_nickname: group_nickname
    });
}

/**
 * 一键兑换(所有群玩家)
 * @returns 
 */
export const ALL_GROUP_EXCHANGE = async () => {
    return await API.post(`${prefix}/points_exchange/all_group_exchange`);
}

/**
 * 撤销兑换
 * @returns 
 */
export const CANCEL_EXCHANGE = async () => {
    return await API.post(`${prefix}/points_exchange/cancel_exchange`);
}

/**
 * 清零
 * @param {string} group_nickname 群昵称
 * @param {string} player_name 玩家名称
 * @returns 
 */
export const POINTS_CLEAR = async (group_nickname, player_name) => {
    return await API.post(`${prefix}/points_exchange/points_clear`, {
        group_nickname: group_nickname,
        player_name: player_name
    });
}

/**
 * 虚拟选手整台清零
 * @param {string} group_nickname 群昵称
 * @returns 
 */
export const VIRTUAL_PLAYER_POINTS_CLEAR = async (group_nickname) => {
    return await API.post(`${prefix}/points_exchange/virtual_player_points_clear`, {
        group_nickname: group_nickname
    });
}