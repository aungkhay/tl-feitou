import API from "../http";
const prefix = '/api/ht';

/**
 * 多台转分 
 * @param {string} source_desk 源台号(群昵称）
 * @param {number} source_score 源分数
 * @param {string} source_player_name 源玩家昵称
 * @param {string} target_desk 目标台号(群昵称）
 * @param {string} target_player_name 目标玩家昵称
 * @returns
 */
export const TRANS_SCORE = async (source_desk, source_score, source_player_name, target_desk, target_player_name) => {
    return await API.post(`${prefix}/desk_option/trans_score`, {
        source_desk: source_desk,
        source_score: source_score,
        source_player_name: source_player_name,
        target_desk: target_desk,
        target_player_name: target_player_name
    });
}