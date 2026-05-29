import API from "../http";
const prefix = '/api';


export const GET_AGENT = async (agent_name) => {
    return await API.post(`${prefix}/ht/agent_business/get_agent`, {
        agent_name: agent_name
    });
}

export const ADD_AGENT = async (player_name) => {
    return await API.post(`${prefix}/ht/agent_business/add_agent`, {
        player_name: player_name
    });
}

/**
 * 
 * @param {*} agent_name 
 * @param {*} currentPage 
 * @param {*} pageSize 
 * @returns 
 */
export const GET_MEMBER = async (agent_name, currentPage, pageSize) => {
    return await API.post(`${prefix}/ht/agent_business/get_member`, {
        agent_name: agent_name,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

export const ADD_MEMBER = async (agent_name, player_name) => {
    return await API.post(`${prefix}/ht/agent_business/add_member`, {
        player_name: player_name,
        agent_name: agent_name
    });
}