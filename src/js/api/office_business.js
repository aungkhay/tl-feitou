import API from "../http";

const prefix = '/api/ht';

/**
 * 获取办公费用
 * @param {string} project_name 项目名称
 * @param {string} card_name 收付卡名称
 * @param {string} optioner 经手人
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {integer} pageSize 每页条数
 * @param {integer} currentPage 当前页
 * @returns 
 */
export const GET_OFFICE_EXPENSES = async (project_name, card_name, optioner, startTime, endTime, pageSize, currentPage) => {
    return await API.post(`${prefix}/office_business/get_office_expenses`, {
        project_name: project_name,
        card_name: card_name,
        optioner: optioner,
        startTime: startTime,
        endTime: endTime,
        pageSize: pageSize,
        currentPage: currentPage
    });
}

/**
 * 新增办公费用
 * @param {string} project_name 项目名称
 * @param {string} card_name 收付卡名称
 * @param {string} amount 金额
 * @param {integer} is_initial_card 是否初始化银行卡
 * @param {string} optioner 经手人
 * @param {string} remark 备注
 * @returns 
 */
export const ADD_OFFICE_EXPENSE = async (project_name, card_name, amount, is_initial_card, optioner, remark) => {
    return await API.post(`${prefix}/office_business/add_office_expenses`, {
        project_name: project_name,
        card_name: card_name,
        amount: amount,
        is_initial_card: is_initial_card ? 1 : 0,
        optioner: optioner,
        remark: remark
    });
}

/**
 * 修改办公费用
 * @param {string} id 
 * @param {string} project_name 项目名称
 * @param {string} card_name 收付卡名称
 * @param {string} amount 金额
 * @param {string} optioner 经手人
 * @param {string} remark 备注
 * @returns 
 */
export const EDIT_OFFICE_EXPENSE = async (id, project_name, card_name, amount, optioner, remark) => {
    return await API.post(`${prefix}/office_business/edit_office_expenses`, {
        id: id,
        project_name: project_name,
        card_name: card_name,
        amount: amount,
        optioner: optioner,
        remark: remark
    });
}

/**
 * 删除办公费用
 * @param {string} id 
 * @returns 
 */
export const DELETE_OFFICE_EXPENSE = async (id) => {
    return await API.post(`${prefix}/office_business/delete_office_expenses`, {
        id: id
    });
}