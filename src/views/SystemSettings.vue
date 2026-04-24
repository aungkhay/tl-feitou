<template>
    <div class="px-2 py-3">
        <ChangePasswordDialog v-model="showChangePasswordDialog" />
        <TgToken v-model="showTgTokenDialog" />
        <v-btn color="primary" variant="tonal" size="x-large" @click="showChangePasswordDialog = true" class="mr-2"><v-icon class="mr-2">mdi-lock-reset</v-icon> 修改密码</v-btn>
        <v-btn color="primary" variant="tonal" size="x-large" @click="showTgTokenDialog = true">设置飞机Token</v-btn>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ChangePasswordDialog from '../components/system-settings/ChangePasswordDialog.vue';
import TgToken from '../components/system-settings/TgToken.vue';

const showChangePasswordDialog = ref(false);
const showTgTokenDialog = ref(false);
</script>