import API from "../http";
import moment from "moment";

const prefix = '/api/ht';

/**
 * 获取积分兑换比例
 * @param {string} group_nickname 群昵称(台号) 
 * @returns {Promise<import("axios").AxiosResponse<any>>}
 */
export const GET_POINTS_EXCHANGE_RATIO = async (group_nickname) => {
    return await API.post(`${prefix}/bussioness_setup/get_points_exchange_ratio`, {
        group_nickname: group_nickname
    });
}

/**
 * 积分兑换比例
 * @param {string} group_nickname 群昵称(台号)
 * @param {number} points_reached 满多少积分
 * @param {number} points_exchange 兑换多少积分
 * @returns {Promise<import("axios").AxiosResponse<any>>}
 */
export const POINTS_EXCHANGE_RATIO = async (group_nickname, points_reached, points_exchange) => {
    return await API.post(`${prefix}/bussioness_setup/points_echange_ratio`, {
        group_nickname: group_nickname,
        points_reached: points_reached,
        points_exchange: points_exchange
    });
}

/**
 * 获取个人兑换比例
 * @param {string} group_nickname 群昵称(台号)
 * @returns {Promise<import("axios").AxiosResponse<any>>}
 */
export const GET_PERSONAL_EXCHANGE_RATIO = async (group_nickname) => {
    return await API.post(`${prefix}/bussioness_setup/get_persional_echange_ratio`, {
        group_nickname: group_nickname
    });
}

/**
 * 个人兑换比例
 * @param {string} player_name 
 * @param {string} group_nickname 操作台
 * @param {number} bp_personal_share 庄闲个人占成比例
 * @param {number} bp_personal_share_upperlimit 庄闲个人占成上限
 * @param {number} sb_personal_share 三宝个人占成比例
 * @param {string} redemption_type 兑换类型
 * @param {number} rebate_ratio 返水比例
 * @param {number} personal_points_redemption_ratio 个人积分兑换比例
 * @param {string} redemption_start_time 兑换开始时间
 * @param {string} rebate_type 返水类型
 * @param {string} rebate_pair_start_time 返水开始计算时间
 * @param {number} start_exchange 是否启动兑换
 * @returns {Promise<import("axios").AxiosResponse<any>>}
 */
export const PERSONAL_EXCHANGE_RATIO = async (player_name, group_nickname, bp_personal_share, bp_personal_share_upperlimit, sb_personal_share, redemption_type, rebate_ratio, personal_points_redemption_ratio, redemption_start_time, rebate_type, rebate_pair_start_time, start_exchange) => {
    return await API.post(`${prefix}/bussioness_setup/persional_echange_ratio`, {
        player_name: player_name,
        group_nickname: group_nickname,
        bp_personal_share: bp_personal_share,
        bp_personal_share_upperlimit: bp_personal_share_upperlimit,
        sb_personal_share: sb_personal_share,
        redemption_type: redemption_type,
        rebate_ratio: rebate_ratio,
        personal_points_redemption_ratio: personal_points_redemption_ratio,
        redemption_start_time: moment(redemption_start_time).format('YYYY-MM-DD HH:mm:ss'),
        rebate_type: rebate_type,
        rebate_pair_start_time: moment(rebate_pair_start_time).format('YYYY-MM-DD HH:mm:ss'),
        start_exchange: start_exchange
    });
}

/**
 * 
 * @param {string} source_desk 源台
 * @param {array} play_name_array 玩家昵称数组 
 * @param {string} target_desk 目的台
 * @returns {Promise<import("axios").AxiosResponse<any>>}
 */
export const PLAYER_COPY = async (source_desk, play_name_array, target_desk) => {
    return await API.post(`${prefix}/bussioness_setup/player_copy`, {
        source_desk: source_desk,
        array_player_name: play_name_array,
        target_desk: target_desk
    });
}

/**
 * 
 * @param {string} group_nickname 群昵称
 * @param {string} last_time 最后时间
 * @returns {Promise<import("axios").AxiosResponse<any>>}
 */
export const DELETE_DATA = async (group_nickname, last_time) => {
    return await API.post(`${prefix}/bussioness_setup/delete_data`, {
        group_nickname: group_nickname,
        last_time: last_time
    });
}