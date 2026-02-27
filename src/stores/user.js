import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('_token_') ?? '',
        profile: localStorage.getItem('_profile_') ? JSON.parse(localStorage.getItem('_profile_')) : null,
        isLoggedIn: localStorage.getItem('_token_') ? true : false,
        group_nickname: 'Group1',
        operation_type: [],
        player_detail: []
    }),
    actions: {
        setToken(token) {
            this.token = token;
            if (token) {
                localStorage.setItem('_token_', token);
            } else {
                localStorage.removeItem('_token_');
            }
        },
        setIsLoggedIn(payload) {
            this.isLoggedIn = payload;
        },
        setProfile(profile) {
            this.profile = profile;
            if (profile) {
                localStorage.setItem('_profile_', JSON.stringify(profile));
            } else {
                localStorage.removeItem('_profile_');
            }
        },
        setOperationType(operation_type) {
            this.operation_type = operation_type;
        },
        setPlayerDetail(player_detail) {
            this.player_detail = player_detail;
        }
    },
    getters: {
    }
});