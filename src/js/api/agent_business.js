import API from "../http";
const prefix = '/api';

/**
 * 
 * @param {string} agent_name 代理名称
 * @returns 
 */
export const GET_AGENT = async (agent_name) => {
    return await API.post(`${prefix}/ht/agent_business/get_agent`, {
        agent_name: agent_name
    });
}

/**
 * 
 * @param {string} player_name 玩家名称
 * @returns 
 */
export const ADD_AGENT = async (player_name) => {
    return await API.post(`${prefix}/ht/agent_business/add_agent`, {
        player_name: player_name
    });
}

/**
 * 
 * @param {string} agent_name 代理名称
 * @param {number} currentPage 当前页码
 * @param {number} pageSize 每页条数
 * @returns 
 */
export const GET_MEMBER = async (agent_name, currentPage, pageSize) => {
    return await API.post(`${prefix}/ht/agent_business/get_member`, {
        agent_name: agent_name,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 
 * @param {string} agent_name 代理名称
 * @param {string} player_name 玩家名称
 * @returns 
 */
export const ADD_MEMBER = async (agent_name, player_name) => {
    return await API.post(`${prefix}/ht/agent_business/add_member`, {
        player_name: player_name,
        agent_name: agent_name
    });
}

/**
 * 查询代理下的会员明细
 * @param {string} agent_name 代理名称
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间
 * @param {number} currentPage 当前页码
 * @param {number} pageSize 每页条数
 * @returns 
 */
export const GET_MEMBER_DETAILS = async (agent_name, startTime, endTime, currentPage, pageSize) => {
    return await API.post(`${prefix}/ht/agent_business/get_member_details`, {
        agent_name: agent_name,
        startTime: startTime,
        endTime: endTime,
        currentPage: currentPage,
        pageSize: pageSize
    });
}