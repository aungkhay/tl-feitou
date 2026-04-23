import API from "../http";
import moment from "moment";

const prefix = '/api/ht';

/**
 * 
 * @param {string} player_name 选手名称
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {string} bet_type 下注类型(庄:z)
 * @param {string} group_nickname 操作台(群昵称)
 * @param {number} currentPage 当前页码
 * @param {number} pageSize 每页条数
 * @returns 
 */
export const GET_PLAYER_BETTING_DETAILS = async (player_name, startTime, endTime, bet_type, group_nickname, currentPage, pageSize) => {
    return await API.post(`${prefix}/financial_inquiries/player_betting_details`, {
        player_name: player_name,
        startTime: startTime ? moment(startTime).format('YYYY-MM-DD') : '',
        endTime: endTime ? moment(endTime).format('YYYY-MM-DD') : '',
        bet_type: bet_type,
        group_nickname: group_nickname,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 
 * @param {string} shoe 靴数
 * @param {string} date 查询时间
 * @param {integer} is_virtual 是否包含虚拟
 * @param {string} group_nickname 操作台(群昵称)
 * @param {integer} currentPage 当前页
 * @param {integer} pageSize 每页总条数
 * @returns 
 */
export const GET_ROUND_DETAILS = async (shoe, date, is_virtual, group_nickname, currentPage, pageSize) => {
    return await API.post(`${prefix}/financial_inquiries/round_details`, {
        shoe: shoe,
        date: date ? moment(date).format('YYYY-MM-DD') : '',
        is_virtual: is_virtual ? 1 : 0,
        group_nickname: group_nickname,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 选手洗码盈亏-查询选手明细
 * @param {string} name 名称(可选）
 * @param {integer} shoe 靴（可选）
 * @param {integer} round 局（可选）
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {integer} is_contains_virtual 是否包含虚拟 （0. 不包含 1. 包含）
 * @param {string} group_nickname 
 * @param {integer} currentPage 当前页
 * @param {integer} pageSize 每页总条数
 * @returns 
 */
export const GET_PLAYER_DETAILS_QUERY = async (name, shoe, round, startTime, endTime, is_contains_virtual, group_nickname, currentPage, pageSize) => {
    return await API.post(`${prefix}/financial_inquiries/ht_player_details_query`, {
        name: name,
        shoe: shoe,
        round: round,
        startTime: startTime ? moment(startTime).format('YYYY-MM-DD') : '',
        endTime: endTime ? moment(endTime).format('YYYY-MM-DD') : '',
        is_contains_virtual: is_contains_virtual ? 1 : 0,
        group_nickname: group_nickname,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 三宝盈亏明细查询
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {string} group_nickname 操作台(群昵称)
    * @param {number} currentPage 当前页
    * @param {number} pageSize 每页条数
 * @returns 
 */
export const GET_SANBAO_DETAILS_QUERY = async (startTime, endTime, group_nickname, currentPage, pageSize) => {
    return await API.post(`${prefix}/financial_inquiries/ht_sb_details_query`, {
        startTime: startTime ? moment(startTime).format('YYYY-MM-DD') : '',
        endTime: endTime ? moment(endTime).format('YYYY-MM-DD') : '',
        group_nickname: group_nickname,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 对冲、零钱明细查询
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {string} group_nickname 操作台(群昵称)
 * @param {number} currentPage 当前页
 * @param {number} pageSize 每页条数
 * @returns 
 */
export const GET_CASH_DETAILS_INQUIRY = async (startTime, endTime, group_nickname, currentPage, pageSize) => {
    return await API.post(`${prefix}/financial_inquiries/cash_details_inquiry`, {
        startTime: startTime ? moment(startTime).format('YYYY-MM-DD') : '',
        endTime: endTime ? moment(endTime).format('YYYY-MM-DD') : '',
        group_nickname: group_nickname,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 个人占成明细查询
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {string} group_nickname 操作台(群昵称)
 * @param {string} player_name 玩家名称
 * @param {number} currentPage 当前页
 * @param {number} pageSize 每页条数
 * @returns 
 */
export const GET_ZC_DETAILS_INQUIRY = async (startTime, endTime, group_nickname, player_name, currentPage, pageSize) => {
    return await API.post(`${prefix}/financial_inquiries/zc_details_inquiry`, {
        startTime: startTime ? moment(startTime).format('YYYY-MM-DD') : '',
        endTime: endTime ? moment(endTime).format('YYYY-MM-DD') : '',
        group_nickname: group_nickname,
        player_name: player_name,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 现金充值明细查询
 * @param {string} startTime 开始时间 
 * @param {string} endTime 结束时间
 * @param {string} group_nickname 操作台(群昵称)
 * @param {string} option_type 操作类型
 * @param {number} currentPage 当前页
 * @param {number} pageSize 每页条数
 * @returns 
 */
export const GET_RECHARGE_DETAILS_INQUIRY = async (startTime, endTime, group_nickname, option_type, currentPage, pageSize) => {
    return await API.post(`${prefix}/financial_inquiries/recharge_details_inquiry`, {
        startTime: startTime ? moment(startTime).format('YYYY-MM-DD') : '',
        endTime: endTime ? moment(endTime).format('YYYY-MM-DD') : '',
        group_nickname: group_nickname,
        option_type: option_type,
        currentPage: currentPage,
        pageSize: pageSize
    });
}