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
        startTime: startTime ? moment(startTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: endTime ? moment(endTime).format('YYYY-MM-DD HH:mm:ss') : '',
        bet_type: bet_type,
        group_nickname: group_nickname,
        currentPage: currentPage,
        pageSize: pageSize
    });
}