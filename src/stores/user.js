import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        isElectron: import.meta.env.VITE_IS_ELECTRON === 'true' ? true : false,
        token: localStorage.getItem('_token_') ?? '',
        profile: localStorage.getItem('_profile_') ? JSON.parse(localStorage.getItem('_profile_')) : null,
        isLoggedIn: localStorage.getItem('_token_') ? true : false,
        group_nickname: '',
        operation_type: [],
        player_detail: [],
        groups: [],
        option1: ['现金', '红包', '活动', '返水', '借款', '还款', '纠错', '初始化', '存款', '取款', '积分'],
        tablePageSize: [5, 10, 20, 30, 50],
        appTitle: {
            parent: '首页',
            child: '上下分',
            key: ''
        },
        virtualPlayer: localStorage.getItem('_virtualPlayer_') ? JSON.parse(localStorage.getItem('_virtualPlayer_')) : [],
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
        setAppTitle(parent, child, key) {
            this.appTitle.parent = parent;
            this.appTitle.child = child;
            this.appTitle.key = key;
        },
        setOperationType(operation_type) {
            this.operation_type = operation_type;
        },
        setPlayerDetail(player_detail) {
            this.player_detail = player_detail;
            this.virtualPlayer = player_detail.list.filter(p => p.is_virtual == 1);
            localStorage.setItem('_virtualPlayer_', JSON.stringify(this.virtualPlayer));
        },
        setGroups(groups) {
            this.groups = groups;
        },
        setGroupNickname(group_nickname) {
            this.group_nickname = group_nickname;
        },
        logout() {
            this.setToken('');
            this.setIsLoggedIn(false);
            this.setProfile(null);
            this.setVirtualPlayer([]);
        },
        setVirtualPlayer(virtualPlayer) {
            this.virtualPlayer = virtualPlayer;
        }
    },
    getters: {
        isVirtualPlayer: (state) => {
            return (item) => {
                if (!item) return false;
                if (item.is_virtual === true || item.is_virtual === 1) {
                    return true;
                }

                const itemNames = [
                    item.username,
                    item.playername,
                    item.palyer_nickname,
                    item.nickname
                ].filter(Boolean);

                return state.virtualPlayer.some(v => {
                    const virtualNames = [
                        v.username,
                        v.playername,
                        v.palyer_nickname,
                        v.nickname
                    ].filter(Boolean);

                    return itemNames.some(name => virtualNames.includes(name));
                });
            };
        }
    }
});