<template>
    <v-app-bar :elevation="5" density="comfortable">
        <v-app-bar-title class="text-body-1 d-flex align-center">
            <span>{{ appTitle.parent }}</span>
            <v-icon>mdi-circle-small</v-icon>
            <span class="text-primary">{{ appTitle.child }}</span>
        </v-app-bar-title>
        <template v-slot:append>
            <v-menu
                v-for="(tab, tabIndex) in tabs" :key="tabIndex"
                transition="scale-transition"
            >
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props">{{ tab.title }}</v-btn>
                </template>
                <v-list>
                    <v-list-item
                        v-for="(item, i) in tab.children"
                        :key="i"
                        :value="i"
                        density="compact"
                        @click="makeChange(tab, item)"
                        :active="item.key == appTitle.key" 
                        color="primary"
                    >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                        <template v-if="item?.children" v-slot:append>
                            <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
                        </template>
                        <v-menu v-if="item?.children" :open-on-focus="false" activator="parent" submenu>
                            <v-list>
                                <v-list-item 
                                    density="compact" 
                                    v-for="(child, index) in item.children" :key="index" 
                                    @click="makeChange(tab, item, child)"
                                    :active="child.key == appTitle.key"
                                    color="primary"
                                >
                                    <v-list-item-title>{{ child.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>

        <LogoutDialog v-model="showLogoutDialog" />
        <ChangePasswordDialog v-model="showChangePasswordDialog" />
        <TgToken v-model="showTgTokenDialog" />
        <PointExchangeRateDialog v-model="showPointExchangeRateDialog" />
        <PersonalExchangeRateDialog v-model="showPersonalExchangeRateDialog" />
        <QuickPullShortcutDialog v-model="showQuickPullShortcutDialog" />
        <QuickBankcardShortcutDialog v-model="showQuickBankcardShortcutDialog" />
        <PlayerCopyDialog v-model="showPlayerCopyDialog" />
        <DeleteDataDialog v-model="showDeleteDataDialog" />
    </v-app-bar>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import LogoutDialog from './system-settings/LogoutDialog.vue';
import ChangePasswordDialog from './system-settings/ChangePasswordDialog.vue';
import TgToken from './system-settings/TgToken.vue';
import PointExchangeRateDialog from './business-settings/PointExchangeRateDialog.vue';
import PersonalExchangeRateDialog from './business-settings/PersonalExchangeRateDialog.vue';
import QuickPullShortcutDialog from './business-settings/QuickPullShortcutDialog.vue';
import QuickBankcardShortcutDialog from './business-settings/QuickBankcardShortcutDialog.vue';
import PlayerCopyDialog from './business-settings/PlayerCopyDialog.vue';
import DeleteDataDialog from './business-settings/DeleteDataDialog.vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const userStore = useUserStore();
const appTitle = computed(() => userStore.appTitle);
const tabs = ref([
    {
        key: 'home',
        title: '首页',
        children: [
            { key: 'in-out-points', routeName: 'PointInOut', title: '上下分' },
            { key: 'multi-desk-transfer', routeName: 'MultiDeskTransfer', title: '多台转分' },
            { key: 'exchange-points', routeName: '', title: '兑换积分' },
        ],
    },
    {
        key: 'system-settings',
        title: '系统设置',
        children: [
            { key: 'change-password', title: '修改密码' },
            { key: 'set-tg-token', title: '设置飞机Token' },
            { key: 'logout', title: '退出' },
        ],
    },
    {
        key: 'business-settings',
        title: '业务设置',
        children: [
            { key: 'points-exchange-rate', title: '积分兑换比率' },
            { key: 'personal-exchange-rate', title: '个人兑换比率' },
            {
                key: 'quick-settings',
                title: '快捷设置',
                children: [
                    { key: 'quick-pull-shortcut', title: '设置拉取端快捷方式' },
                    { key: 'quick-bankcard-shortcut', title: '设置银行卡快捷方式' },
                ],
            },
            { key: 'player-copy', title: '玩家复制' },
            { key: 'delete-data', title: '删除数据' },
        ],
    },
    {
        key: 'bank-card-business',
        title: '银行卡业务',
        children: [
            { key: 'bank-card-settings',  routeName: 'BankCardSettings', title: '银行卡设置' },
            { key: 'transfer-registration', routeName: 'CardBalanceTransfer', title: '转账登记' },
            { key: 'bank-card-details', routeName: 'BankCardDetail', title: '银行卡明细' },
            { key: 'bank-cash-statistics', routeName: 'BankCashStatistics', title: '银行现金统计' },
        ],
    },
    {
        key: 'office-business',
        title: '办公业务',
        children: [
            { key: 'expense-registration',  routeName: 'ExpenseRegistration', title: '费用登记' },
        ],
    },
    {
        key: 'jiajiancai-business',
        title: '加减彩业务',
        children: [
            { key: 'jiajiancai-registration', routeName: 'JiajiancaiRegistration', title: '加减彩登记' },
        ],
    },
    {
        key: 'financial-query',
        title: '财务查询',
        children: [
            { key: 'wash-hand-bet-details', routeName: 'WashHandBetDetails', title: '洗手下注明细' },
            { key: 'query-bureau-details', routeName: 'QueryBureauDetails', title: '查询局明细' },
            { key: 'wash-hand-code-profit-loss', routeName: 'WashHandCodeProfitLoss', title: '洗手洗码盈亏' },
            { key: 'feipai-query', routeName: 'FeipaiQuery', title: '飞牌查询' },
            { key: 'sanbao-query', routeName: 'SanbaoQuery', title: '三宝查询' },
            { key: 'hedging-change-query', routeName: 'HedgingChangeQuery', title: '对冲零钱查询' },
            { key: 'promotion-business-query', routeName: 'PromotionBusinessQuery', title: '推广业务查询' },
            { key: 'loan-deposit-withdrawal-query', routeName: 'LoanDepositWithdrawalQuery', title: '借款，存取款查询' },
            { key: 'personal-share-query', routeName: 'PersonalShareQuery', title: '个人占成查询' },
            { key: 'cash-recharge-details', routeName: 'CashRechargeDetails', title: '现金充值明细' },
            { key: 'wash-hand-data-error-check', routeName: 'WashHandDataErrorCheck', title: '洗手数据查错' },
            { key: 'reconciliation-analysis-difference', routeName: 'ReconciliationAnalysisDifference', title: '对账分析差额' },
            { key: 'wash-hand-flow-analysis', routeName: 'WashHandFlowAnalysis', title: '洗手流水分析' },
        ],
    },
    {
        key: 'financial-statistics',
        title: '财务统计',
        children: [
            { key: 'table-general-ledger', routeName: 'TableGeneralLedger', title: '台面总账' },
            { key: 'sanbao-statistics', routeName: 'SanbaoStatistics', title: '三宝统计' },
            { key: 'personal-share-statistics', routeName: 'PersonalShareStatistics', title: '个人占成统计' },
            { key: 'hedging-change-statistics', routeName: 'HedgingChangeStatistics', title: '对冲零钱统计' },
            { key: 'promotion-business-statistics', routeName: 'PromotionBusinessStatistics', title: '推广业务统计' },
        ],
    },
    {
        key: 'agent-business',
        title: '代理业务',
        children: [
            { key: 'agent-settings', routeName: 'AgentSettings', title: '代理设置' },
            { key: 'agent-commission', routeName: 'AgentCommission', title: '代理返佣' },
            { key: 'agent-details', routeName: 'AgentDetails', title: '代理明细' },
        ],
    },
    {
        key: 'data-analysis',
        title: '数据分析',
        children: [
            { key: 'pump-detail-analysis', routeName: 'PumpDetailAnalysis', title: '抽水明细分析' },
            { key: 'pump-statistics-analysis', routeName: 'PumpStatisticsAnalysis', title: '抽水统计分析' },
            { key: 'activity-analysis', routeName: 'ActivityAnalysis', title: '活跃度分析' },
            { key: 'recently-inactive-players', routeName: 'RecentlyInactivePlayers', title: '最近没有玩过玩家' },
            { key: 'manual-bet-entry-log', routeName: 'ManualBetEntryLog', title: '手工录入注码日志' },
        ],
    },
])
const showLogoutDialog = ref(false);
const showChangePasswordDialog = ref(false);
const showTgTokenDialog = ref(false);
const showPointExchangeRateDialog = ref(false);
const showPersonalExchangeRateDialog = ref(false);
const showQuickPullShortcutDialog = ref(false);
const showQuickBankcardShortcutDialog = ref(false);
const showPlayerCopyDialog = ref(false);
const showDeleteDataDialog = ref(false);
const router = useRouter();

const makeChange = (tab, item, child = null) => {
    let setAppTitle = true;

    if (item?.routeName) {
        router.push({ name: item.routeName });
        userStore.setAppTitle(tab.title, item.title, item.key);
    } else if (child?.routeName) {
        router.push({ name: child.routeName });
        userStore.setAppTitle(tab.title, child.title, child.key);
    } else {
        switch (child ? child.key : item.key) {
            case 'change-password':
                showChangePasswordDialog.value = true;
                setAppTitle = false;
                break;
            case 'set-tg-token':
                showTgTokenDialog.value = true;
                setAppTitle = false;
                break;
            case 'logout':
                showLogoutDialog.value = true;
                setAppTitle = false;
                break;
            case 'points-exchange-rate':
                showPointExchangeRateDialog.value = true
                setAppTitle = false;
                break;
            case 'personal-exchange-rate':
                showPersonalExchangeRateDialog.value = true
                setAppTitle = false;
                break;
            case 'quick-pull-shortcut':
                showQuickPullShortcutDialog.value = true
                setAppTitle = false;
                break;
            case 'quick-bankcard-shortcut':
                showQuickBankcardShortcutDialog.value = true
                setAppTitle = false;
                break;
            case 'player-copy':
                showPlayerCopyDialog.value = true
                setAppTitle = false;
                break;
            case 'delete-data':
                showDeleteDataDialog.value = true
                setAppTitle = false;
                break;
            default:
                console.log(`选择了: ${item.title}`);
        }
    }
}

onMounted(() => {
    const pathSegments = route.path.split('/').filter(segment => segment);
    if (pathSegments.length > 0) {
        const key = pathSegments[0];
        for (const tab of tabs.value) {
            const item = tab.children.find(child => child.key === key);
            if (item) {
                userStore.setAppTitle(tab.title, item.title, key);
                break;
            }
        }
    }
    console.log(pathSegments)
})
</script>