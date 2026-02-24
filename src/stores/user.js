import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('_token_') ?? '',
        isLoggedIn: localStorage.getItem('_token_') ? true : false,
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
    },
    getters: {
    }
});