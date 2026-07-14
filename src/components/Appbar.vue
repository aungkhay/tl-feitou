<template>
    <v-app-bar :elevation="0" density="compact" color="grey-lighten-4">
        <v-app-bar-nav-icon @click="switchDrawer"></v-app-bar-nav-icon>
        <v-app-bar-title class="font-weight-bold">{{ barTitle }}</v-app-bar-title>

        <template #extension>
            <div class="bg-grey-lighten-4 w-100">
                <v-tabs v-model="active" show-arrows density="compact" color="primary" bg-color="grey-lighten-3" variant="text">
                    <v-tab density="compact" v-for="t in tabs" :key="t.key" :value="t.key" @click="goTab(t)" @contextmenu.prevent="openTabMenu($event, t)">
                        <span class="mr-2 text-caption">{{ t.title }}</span>
                        <v-btn v-if="tabs.length > 1" icon variant="text" size="20" @click.stop="closeTab(t)"><v-icon size="x-small">mdi-close</v-icon></v-btn>
                    </v-tab>
                </v-tabs>

                <v-menu
                    v-model="tabMenu.open"
                    :target="[tabMenu.x, tabMenu.y]"
                    location="top"
                    :close-on-content-click="true"
                >
                    <v-list density="compact" min-width="180">
                        <v-list-item
                            title="关闭当前"
                            :disabled="!tabMenu.tab || tabs.length <= 1"
                            @click="closeTab(tabMenu.tab)"
                        />
                        <v-list-item
                            title="关闭其它"
                            :disabled="!tabMenu.tab || tabs.length <= 1"
                            @click="closeOthers(tabMenu.tab)"
                        />
                    </v-list>
                </v-menu>
            </div>
        </template>

        <v-spacer></v-spacer>
        <div class="text-error">【汇总:{{ score.zyk }}, N宝:{{ score.sblyk }}, 零钱:{{ score.ltyk }}, 对冲:{{ score.dcyk }}, 个占:{{ score.gyk }}, 台占:{{ score.xztyk }}】【剩余:{{ score.total_score }}, 初始:{{ score.total_raw_score }}】</div>
        <v-btn :icon="isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" color="primary" @click="toggleFullScreen"></v-btn>
        <v-btn color="primary" @click="refreshPage" variant="tonal"><v-icon>mdi-refresh</v-icon> 刷新</v-btn>
    </v-app-bar>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, reactive, watch } from 'vue';
import { useDrawerStore } from '../stores/drawer';
import { useTabsStore } from '../stores/tabs';
import { useRouter } from 'vue-router';
import { GET_PROFIT_SCORE } from '../js/api/player_option';

const drawerStore = useDrawerStore();
const tabsStore = useTabsStore();
const barTitle = computed(() => drawerStore.barTitle);
const tabs = computed(() => tabsStore.tabs);
const active = computed({
    get: () => tabsStore.activeKey,
    set: (key) => tabsStore.setActive(key),
});
const router = useRouter();
const isFullScreen = ref(false);
const score = ref({
    total_score: 0,
    total_raw_score: 0,
    zyk: 0,
    sblyk: 0,
    ltyk: 0,
    dcyk: 0,
    gyk: 0,
    xztyk: 0,
});

const tabMenu = reactive({
    open: false,
    x: 0,
    y: 0,
    tab: null,
});

function openTabMenu(e, tab) {
    tabMenu.tab = tab;
    tabMenu.x = e.clientX;
    tabMenu.y = e.clientY;

    // reopen reliably
    tabMenu.open = false;
    requestAnimationFrame(() => (tabMenu.open = true));
}

function switchDrawer() {
    drawerStore.setDrawer();
}

function goTab(t) {
    tabsStore.setActive(t.key);
    router.push({ name: t.key });
}

function closeTab(tab) {
    const nextPath = tabsStore.close(tab.key);
    if (nextPath) router.push({ name: nextPath });
}

function closeOthers(tab) {
    const nextPath = tabsStore.closeOthers(tab.key); // add this action in store
    if (nextPath) router.push({ name: nextPath });
}

const refreshPage = () => {
    const currentRoute = router.currentRoute.value;
    router.replace({ path: '/redirect' }).then(() => {
        router.replace(currentRoute.fullPath);
    });
};

const toggleFullScreen = async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (e) {
        console.error('Fullscreen error:', e);
    }
}

const checkFullscreen = () => {
    isFullScreen.value = !isFullScreen.value;
};

const getScore = async () => {
    try {
        const response = await GET_PROFIT_SCORE();
        if (response && response.data) {
            score.value = response.data[0];
        }
    } catch (error) {
        console.error('Error fetching profit score:', error);
    }
};

onMounted(() => {
    window.addEventListener('resize', checkFullscreen);
    getScore(); // Initial fetch
    setInterval(getScore, 10000); // Refresh score every 10 seconds
});
</script>