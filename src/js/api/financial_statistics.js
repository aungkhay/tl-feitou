import API from "../http";
import moment from "moment";

const prefix = '/api/ht';

/**
 * 财务总账-按天查询汇总
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {string} group_nickname 操作台(群昵称)
 * @param {number} currentPage 当前页
 * @param {number} pageSize 每页条数
 * @returns 
 */
export const GET_DAILY_QUERY_SUMMARY = async (startTime, endTime, group_nickname, currentPage, pageSize) => {
    return await API.post(`${prefix}/financial_statistics/daily_query_summary`, {
        startTime: startTime,
        endTime: endTime,
        group_nickname: group_nickname,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 三宝统计
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {string} group_nickname 操作台(群昵称)
 * @param {number} currentPage 当前页
 * @param {number} pageSize 每页条数
 * @returns 
 */
export const GET_SB_STATISTICS = async (startTime, endTime, group_nickname, currentPage, pageSize) => {
    return await API.post(`${prefix}/financial_statistics/sb_statistics`, {
        startTime: startTime,
        endTime: endTime,
        group_nickname: group_nickname,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 个人占成统计
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {string} group_nickname 操作台(群昵称)
 * @param {number} currentPage 当前页
 * @param {number} pageSize 每页条数
 * @returns 
 */
export const GET_PERSONAL_PROPORTION_STATISTICS = async (startTime, endTime, group_nickname, currentPage, pageSize) => {
    return await API.post(`${prefix}/financial_statistics/personal_proportion_statistics`, {
        startTime: startTime,
        endTime: endTime,
        group_nickname: group_nickname,
        currentPage: currentPage,
        pageSize: pageSize
    });
}