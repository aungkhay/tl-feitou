<template>
    <v-app>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useUserStore } from './stores/user';
import { GET_GROUP_NICKNAME } from './js/api/player_option';
import { useDrawerStore } from './stores/drawer';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();
const drawerStore = useDrawerStore();

watch(
	() => route.path,
	() => {
		drawerStore.setCurrentRoute(route.name);
	},
	{ immediate: true, deep: true }
)

onMounted(() => {
    if (userStore.isLoggedIn) {
        GET_GROUP_NICKNAME();
    }
    window.addEventListener('resize', () => {
		drawerStore.setInnerWidth();
    });
})
</script>