<template>
    <div>
        <Drawer />
        <Appbar />
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>

<script setup>
import Appbar from '../components/Appbar.vue';
import Drawer from '../components/Drawer.vue';
import { GET_ALL_PLAYER } from '../js/api/user.js';
import { useUserStore } from '../stores/user.js';
import { onMounted } from 'vue';

const userStore = useUserStore();
const fetchAllPlayers = async () => {
    const res = await GET_ALL_PLAYER();
    if (res && res.code == 200) {
        userStore.setVirtualPlayer(res.data.filter(p => p.is_virtual == 1));
    }
};

onMounted(() => {
    fetchAllPlayers();
});
</script>