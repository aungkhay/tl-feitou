<template>
    <div class="px-2 py-3">
        <PointExchangeRateDialog v-model="showPointExchangeRateDialog" />
        <PersonalExchangeRateDialog v-model="showPersonalExchangeRateDialog" />
        <QuickPullShortcutDialog v-model="showQuickPullShortcutDialog" />
        <QuickBankcardShortcutDialog v-model="showQuickBankcardShortcutDialog" />
        <PlayerCopyDialog v-model="showPlayerCopyDialog" />
        <DeleteDataDialog v-model="showDeleteDataDialog" />

        <div class="d-flex flex-wrap">
            <v-btn @click="showPointExchangeRateDialog = true" color="primary" variant="tonal" size="x-large" class="mr-2 mb-2">积分兑换比率</v-btn>
            <v-btn @click="showPersonalExchangeRateDialog = true" color="primary" variant="tonal" size="x-large" class="mr-2 mb-2">个人兑换比率</v-btn>
            <v-btn @click="showQuickPullShortcutDialog = true" color="primary" variant="tonal" size="x-large" class="mr-2 mb-2">设置拉取端快捷方式</v-btn>
        </div>
        <div class="d-flex flex-wrap">
            <v-btn @click="showQuickBankcardShortcutDialog = true" color="primary" variant="tonal" size="x-large" class="mr-2 mb-2">设置银行卡快捷方式</v-btn>
            <v-btn @click="showPlayerCopyDialog = true" color="primary" variant="tonal" size="x-large" class="mr-2 mb-2"><v-icon>mdi-content-copy</v-icon> 玩家复制</v-btn>
            <v-btn @click="showDeleteDataDialog = true" color="error" variant="tonal" size="x-large" class="mr-2 mb-2"><v-icon>mdi-trash-can</v-icon> 删除数据</v-btn>
        </div>
    </div>
</template>

<script setup>
import PointExchangeRateDialog from '../components/business-settings/PointExchangeRateDialog.vue';
import PersonalExchangeRateDialog from '../components/business-settings/PersonalExchangeRateDialog.vue';
import QuickPullShortcutDialog from '../components/business-settings/QuickPullShortcutDialog.vue';
import QuickBankcardShortcutDialog from '../components/business-settings/QuickBankcardShortcutDialog.vue';
import PlayerCopyDialog from '../components/business-settings/PlayerCopyDialog.vue';
import DeleteDataDialog from '../components/business-settings/DeleteDataDialog.vue';
import { ref } from 'vue';

const showPointExchangeRateDialog = ref(false);
const showPersonalExchangeRateDialog = ref(false);
const showQuickPullShortcutDialog = ref(false);
const showQuickBankcardShortcutDialog = ref(false);
const showPlayerCopyDialog = ref(false);
const showDeleteDataDialog = ref(false);
</script>