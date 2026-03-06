import API from "../http";
import moment from "moment";

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
 * @param {integer} initial_amount 初始金额
 * @param {integer} card_status 卡状态（1正常 2冻结 3隐藏）
 * @returns 
 */
export const ADD_BANK_CARD = async (card_type, card_name, card_code, initial_amount, card_status) => {
    return await API.post(`${prefix}/bank_business/add_bank_card`, {
        card_type: card_type,
        card_name: card_name,
        card_code: card_code,
        initial_amount: initial_amount,
        card_status: card_status
    });
}
 
/**
 * 
 * @param {integer} id 
 * @param {string} card_type 卡类型
 * @param {string} card_name 姓名
 * @param {string} card_code 卡号
 * @param {string} initial_amount 初始金额
 * @param {string } card_status 正常 | 冻结 | 隐藏
 * @returns 
 */
export const EDIT_BANK_CARD = async (id, card_type, card_name, card_code, initial_amount, card_status) => {
    return await API.post(`${prefix}/bank_business/edit_bank_card`, {
        id: id,
        card_type: card_type,
        card_name: card_name,
        card_code: card_code,
        initial_amount: initial_amount,
        card_status: card_status
    });
}

/**
 * 获取银行卡间转账记录 
 * @param {string} card_type 卡类型
 * @param {string} optioner 操作员
 * @param {string} card_name 卡姓名
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {integer} currentPage 当前页
 * @param {integer} pageSize 每页总条数
 * @returns 
 */
export const GET_INTERBANK_TRANSFER = async (card_type, optioner, card_name, startTime, endTime, currentPage, pageSize) => {
    return await API.post(`${prefix}/bank_business/get_interbank_transfer`, {
        card_type: card_type,
        optioner: optioner,
        card_name: card_name,
        startTime: startTime,
        endTime: endTime,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 新增银行卡之间转账
 * @param {string} transfer_out_card_name 转出卡姓名
 * @param {string} transfer_in_card_name 转入卡姓名
 * @param {integer} amount 金额
 * @param {string} working_day 工作日
 * @returns 
 */
export const INTER_BANK_TRANSFER = async (transfer_out_card_name, transfer_in_card_name, amount, working_day) => {
    return await API.post(`${prefix}/bank_business/inter_bank_transfer`, {
        transfer_out_card_name: transfer_out_card_name,
        transfer_in_card_name: transfer_in_card_name,
        amount: Number(amount),
        working_day: moment(working_day).format('YYYY-MM-DD')
    });
}

/**
 * 修改银行卡之间转账 
 * @param {integer} id 记录id
 * @param {string} transfer_out_card_name 转出卡姓名
 * @param {string} transfer_in_card_name 转入卡姓名
 * @param {integer} amount 金额
 * @param {string} working_day 工作日
 * @returns 
 */
export const EDIT_INTER_BANK_TRANSFER = async (id, transfer_out_card_name, transfer_in_card_name, amount, working_day) => {
    return await API.post(`${prefix}/bank_business/edit_inter_bank_transfer`, {
        id: id,
        transfer_out_card_name: transfer_out_card_name,
        transfer_in_card_name: transfer_in_card_name,
        amount: Number(amount),
        working_day: moment(working_day).format('YYYY-MM-DD')
    });
}

/**
 * 删除某条银行卡转账记录
 * @param {integer} id 记录id
 * @returns 
 */
export const DELETE_INTER_BANK_TRANSFER = async (id) => {
    return await API.post(`${prefix}/bank_business/delete_inter_bank_transfer`, {
        id: id
    });
}