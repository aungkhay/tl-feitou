import API from "../http";
import { useUserStore } from "../../stores/user";
import moment from "moment";

const prefix = '/api/ht';

export const GET_GROUP_NICKNAME = async () => {
    const res = await API.post(`${prefix}/player_option/get_group_nickname`);
    if (res.code == 200) {
        const userStore = useUserStore();
        userStore.setGroups(res.data);
    }
    return res;
}

/**
 * 
 * @param {string} group_nickname 台号(群昵称）
 * @returns 
 */
export const GET_GROUP_PLAYERS = async (group_nickname) => {
    const res = await API.post(`${prefix}/player_option/get_group_players`, {
        group_nickname: group_nickname
    });
    return res; 
}

/**
 * 获取上下分操作类型列表 
 * @param {string} group_nickname 台号(群昵称）
 * @returns
 */
export const GET_SCORE_OPTION_TYPE = async (group_nickname) => {
    const res = await API.post(`${prefix}/player_option/get_score_option_type`, {
        group_nickname: group_nickname
    });

    if (res.code == 200) {
        const userStore = useUserStore();
        userStore.setOperationType(res.data);
    }
    return res;
}

/**
 * 上分
 * @param {string} group_nickname 台号(群昵称）
 * @param {string} player_name 玩家昵称
 * @param {integer} option_score 操作分数
 * @param {string} option_type 操作类型
 * @param {string} bank_card 银行卡(可选）
 */
export const ADD_SCORE = async (group_nickname, player_name, option_score, option_type, bank_card) => {
    return await API.post(`${prefix}/player_option/add_score`, {
        group_nickname: group_nickname,
        player_name: player_name,
        option_score: option_score,
        option_type: option_type,
        bank_card: bank_card
    });
}

/**
 * 下分
 * @param {string} group_nickname 台号(群昵称）
 * @param {string} player_name 玩家昵称
 * @param {integer} option_score 操作分数
 * @param {string} option_type 操作类型
 * @param {string} bank_card 银行卡(可选）
 */
export const SUBSTRACT_SCORE = async (group_nickname, player_name, option_score, option_type, bank_card) => {
    return await API.post(`${prefix}/player_option/subtract_score`, {
        group_nickname: group_nickname,
        player_name: player_name,
        option_score: option_score,
        option_type: option_type,
        bank_card: bank_card
    });
}

/**
 * 获取选手详情
 * @param {string} group_nickname 台号(群昵称）
 * @returns
 */
export const GET_PLAYER_DETAIL = async (group_nickname) => {
    const res = await API.post(`${prefix}/player_option/get_player_detail`, {
        group_nickname: group_nickname
    });
    if (res.code == 200) {
        const userStore = useUserStore();
        userStore.setPlayerDetail(res.data);
    }
    return res;
}

/**
 * 获取分数操作记录
 * @param {string} group_nickname 群昵称(台号)
 * @param {string} option_type 操作类型
 * @param {string} optioner 操作人
 * @param {string} start_time 开始时间(默认当天)
 * @param {string} end_time 结束时间(默认当天)
 * @param {string} player_name 选手昵称
 * @param {integer} is_virtual 是否包括虚拟( 1 包括 0 不包括) 可选 ,默认0
 * @param {integer} currentPage 当前页
 * @param {integer} pageSize 每页条数
 * @returns 
 */
export const GET_SCORE_OPTION_RECORD = async (group_nickname, option_type, optioner, start_time, end_time, player_name, is_virtual, currentPage, pageSize) => {
    return await API.post(`${prefix}/player_option/get_score_option_record`, {
        group_nickname: group_nickname,
        option_type: option_type,
        optioner: optioner,
        start_time: moment(start_time).format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(end_time).format('YYYY-MM-DD HH:mm:ss'),
        player_name: player_name,
        is_virtual: is_virtual,
        currentPage: currentPage,
        pageSize: pageSize
    });
}

/**
 * 积分全下
 * @param {string} group_nickname 群昵称(台号)
 * @param {string} player_name 选手昵称 
 * @returns 
 */
export const SCORE_ALL_DOWN = async (group_nickname, player_name) => {
    return await API.post(`${prefix}/player_option/score_all_down`, {
        group_nickname: group_nickname ,
        player_name: player_name
    });
}

/**
 * 撤销上下分
 * @param {string} id 操作记录的id
 * @param {string} player_name 选手
 * @param {string} group_nickname 群昵称
 * @returns 
 */
export const UNDO_OPTION_SCORE = async (id, player_name, group_nickname) => {
    return await API.post(`${prefix}/player_option/undo_option_score`, {
        id: id,
        player_name: player_name,
        group_nickname: group_nickname
    });
}

/**
 * 获取银行卡
 * @param {string} group_nickname 群昵称
 * @returns {Promise<import("axios").AxiosResponse<any>>}
 */
export const GET_BANKCARD = async (group_nickname) => {
    return await API.post(`${prefix}/player_option/get_bankcard`, {
        group_nickname: group_nickname
    });
}