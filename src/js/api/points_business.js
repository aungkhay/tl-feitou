import API from "../http";
import moment from "moment";

const prefix = '/api/ht';

/**
 * 获取加减彩记录
 * @param {string} group_nickname 操作台(群昵称)
 * @param {string} optioner 经手人员
 * @param {string} option_type 操作类型（加彩 | 减彩） 
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {number} currentPage 当前页码
 * @param {number} pageSize 每页条数
 * @returns 
 */
export const GET_POINTS_RECORD = async (group_nickname, optioner, option_type, startTime, endTime, currentPage, pageSize) => {
    return await API.post(`${prefix}/points_business/get_points_record`, {
        group_nickname: group_nickname,
        optioner: optioner,
        option_type: option_type,
        startTime: startTime ? moment(startTime).format('YYYY-MM-DD') : '',
        endTime: endTime ? moment(endTime).format('YYYY-MM-DD') : '',
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 新增加减彩
 * @param {string} group_nickname 操作台(群昵称)
 * @param {string} option_type 操作类型
 * @param {number} amount 金额
 * @param {string} memo 备注
 * @returns 
 */
export const ADD_POINTS = async (group_nickname, option_type, amount, memo) => {
    return await API.post(`${prefix}/points_business/add_modifi_points`, {
        group_nickname: group_nickname,
        option_type: option_type,
        amount: amount,
        memo: memo
    });
}

/**
 * 修改加减彩 
 * @param {number} id ID
 * @param {string} group_nickname 操作台(群昵称)
 * @param {string} option_type 操作类型
 * @param {number} amount 金额
 * @param {string} memo 备注
 * @returns 
 */
export const EDIT_POINTS = async (id, group_nickname, option_type, amount, memo) => {
    return await API.post(`${prefix}/points_business/edit_modifi_points`, {
        id: id,
        group_nickname: group_nickname,
        option_type: option_type,
        amount: amount,
        memo: memo
    });
}

/**
 * 删除加减彩
 * @param {number} id ID
 * @returns 
 */
export const DELETE_POINTS = async (id) => {
    return await API.post(`${prefix}/points_business/delete_modifi_points`, {
        id: id
    });
}