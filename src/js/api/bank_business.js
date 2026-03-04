import API from "../http";

const prefix = '/api/ht';

/**
 * 
 * @param {string} card_type 卡类型
 * @param {string} card_status 卡状态（1正常 2冻结 3隐藏）
 * @param {string} optioner 操作员
 * @param {string} card_name 卡姓名
 * @param {string} sort_name 排序字段
 * @param {integer} currentPage 当前页
 * @param {integer} pageSize 每页总条数
 * @returns 
 */
export const GET_BANK_CARD = async (card_type, card_status, optioner, card_name, sort_name, currentPage, pageSize) => {
    return await API.post(`${prefix}/bank_business/get_bank_card`, {
        card_type: card_type,
        card_status: card_status,
        optioner: optioner,
        card_name: card_name,
        sort_name: sort_name,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 
 * @param {string} card_type 卡类型
 * @param {string} card_name 姓名
 * @param {string} card_code 卡号
 * @param {integer} Initial_amount 初始金额
 * @param {integer} card_status 卡状态（1正常 2冻结 3隐藏）
 * @returns 
 */
export const ADD_BANK_CARD = async (card_type, card_name, card_code, Initial_amount, card_status) => {
    return await API.post(`${prefix}/bank_business/add_bank_card`, {
        card_type: card_type,
        card_name: card_name,
        card_code: card_code,
        Initial_amount: Initial_amount,
        card_status: card_status
    });
}