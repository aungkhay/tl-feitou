<template>
    <v-app>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';
import { GET_GROUP_NICKNAME } from './js/api/player_option';

const userStore = useUserStore();

onMounted(() => {
    if (userStore.isLoggedIn) {
        GET_GROUP_NICKNAME();
    }
})
</script>