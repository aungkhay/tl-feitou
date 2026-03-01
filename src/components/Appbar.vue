<template>
    <v-app-bar :elevation="2" density="comfortable">
        <v-app-bar-title class="font-weight-bold">Financial Account</v-app-bar-title>
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
                        @click="makeChange(item)"
                    >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                        <template v-if="item?.children" v-slot:append>
                            <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
                        </template>
                        <v-menu v-if="item?.children" :open-on-focus="false" activator="parent" submenu>
                            <v-list>
                                <v-list-item density="compact" v-for="(child, index) in item.children" :key="index" link @click="makeChange(child)">
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
        <TransferScore v-model="showTransferScoreDialog" />
    </v-app-bar>
</template>

<script setup>
import { ref } from 'vue';
import TransferScore from './home/TransferScore.vue';
import LogoutDialog from './system-settings/LogoutDialog.vue';
import ChangePasswordDialog from './system-settings/ChangePasswordDialog.vue';
import TgToken from './system-settings/TgToken.vue';
import PointExchangeRateDialog from './business-settings/PointExchangeRateDialog.vue';
import PersonalExchangeRateDialog from './business-settings/PersonalExchangeRateDialog.vue';
import QuickPullShortcutDialog from './business-settings/QuickPullShortcutDialog.vue';
import QuickBankcardShortcutDialog from './business-settings/QuickBankcardShortcutDialog.vue';
import PlayerCopyDialog from './business-settings/PlayerCopyDialog.vue';
import DeleteDataDialog from './business-settings/DeleteDataDialog.vue';
import { useRouter } from 'vue-router';

const tabs = ref([
    {
        key: 'home',
        title: '首页',
        children: [
            { key: 'in-out-points', title: '上下分' },
            { key: 'multi-terminal-transfer', title: '多台转分' },
            { key: 'exchange-points', title: '兑换积分' },
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
            { key: 'bank-card-settings', title: '银行卡设置' },
            { key: 'transfer-registration', title: '转账登记' },
            { key: 'bank-card-details', title: '银行卡明细' },
            { key: 'bank-cash-statistics', title: '银行现金统计' },
        ],
    },
    {
        key: 'office-business',
        title: '办公业务',
        children: [
            { key: 'expense-registration', title: '费用登记' },
        ],
    },
    {
        key: 'jiajiancai-business',
        title: '加减彩业务',
        children: [
            { key: 'jiajiancai-registration', title: '加减彩登记' },
        ],
    },
    {
        key: 'financial-query',
        title: '财务查询',
        children: [
            { key: 'wash-hand-bet-details', title: '洗手下注明细' },
            { key: 'query-bureau-details', title: '查询局明细' },
            { key: 'wash-hand-code-profit-loss', title: '洗手洗码盈亏' },
            { key: 'feipai-query', title: '飞牌查询' },
            { key: 'sanbao-query', title: '三宝查询' },
            { key: 'hedging-change-query', title: '对冲零钱查询' },
            { key: 'promotion-business-query', title: '推广业务查询' },
            { key: 'loan-deposit-withdrawal-query', title: '借款，存取款查询' },
            { key: 'personal-share-query', title: '个人占成查询' },
            { key: 'cash-recharge-details', title: '现金充值明细' },
            { key: 'wash-hand-data-error-check', title: '洗手数据查错' },
            { key: 'reconciliation-analysis-difference', title: '对账分析差额' },
            { key: 'wash-hand-flow-analysis', title: '洗手流水分析' },
        ],
    },
    {
        key: 'financial-statistics',
        title: '财务统计',
        children: [
            { key: 'table-general-ledger', title: '台面总账' },
            { key: 'sanbao-statistics', title: '三宝统计' },
            { key: 'personal-share-statistics', title: '个人占成统计' },
            { key: 'hedging-change-statistics', title: '对冲零钱统计' },
            { key: 'promotion-business-statistics', title: '推广业务统计' },
        ],
    },
    {
        key: 'agent-business',
        title: '代理业务',
        children: [
            { key: 'agent-settings', title: '代理设置' },
            { key: 'agent-commission', title: '代理返佣' },
            { key: 'agent-details', title: '代理明细' },
        ],
    },
    {
        key: 'data-analysis',
        title: '数据分析',
        children: [
            { key: 'pump-detail-analysis', title: '抽水明细分析' },
            { key: 'pump-statistics-analysis', title: '抽水统计分析' },
            { key: 'activity-analysis', title: '活跃度分析' },
            { key: 'recently-inactive-players', title: '最近没有玩过玩家' },
            { key: 'manual-bet-entry-log', title: '手工录入注码日志' },
        ],
    },
])
const showTransferScoreDialog = ref(false);
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

const goToHome = () => {
    router.push({ name: 'Home' });
}

const makeChange = (item) => {
    switch (item.key) {
        
        case 'in-out-points':
            router.push({ name: 'PointInOut' });
            break;
        case 'multi-terminal-transfer':
            showTransferScoreDialog.value = true;
            break;
        case 'change-password':
            showChangePasswordDialog.value = true;
            break;
        case 'set-tg-token':
            showTgTokenDialog.value = true;
            break;
        case 'logout':
            showLogoutDialog.value = true;
            break;
        case 'points-exchange-rate':
            showPointExchangeRateDialog.value = true;
            break;
        case 'personal-exchange-rate':
            showPersonalExchangeRateDialog.value = true;
            break;
        case 'quick-pull-shortcut':
            showQuickPullShortcutDialog.value = true;
            break;
        case 'quick-bankcard-shortcut':
            showQuickBankcardShortcutDialog.value = true;
            break;
        case 'player-copy':
            showPlayerCopyDialog.value = true;
            break;
        case 'delete-data':
            showDeleteDataDialog.value = true;
            break;
        case 'bank-card-settings':
            router.push({ name: 'BankCardSettings' });
            break;
        case 'transfer-registration':
            router.push({ name: 'CardBalanceTransfer' });
            break;
        case 'bank-card-details':
            router.push({ name: 'BankCardDetail' });
            break;
        case 'bank-cash-statistics':
            router.push({ name: 'BankCashStatistics' });
            break;
        case 'expense-registration':
            router.push({ name: 'ExpanseRegisteration' });
            break;
        case 'jiajiancai-registration':
            router.push({ name: 'JiaJianCaiRegistration' });
            break;
        case 'wash-hand-bet-details':
            router.push({ name: 'WashHandBetDetails' });
            break;
        case 'query-bureau-details':
            router.push({ name: 'QueryBureauDetails' });
            break;
        case 'wash-hand-code-profit-loss':
            router.push({ name: 'WashHandCodeProfitLoss' });
            break;
        case 'feipai-query':
            router.push({ name: 'FeiPaiQuery' });
            break;
        case 'sanbao-query':
            router.push({ name: 'SanbaoQuery' });
            break;
        case 'hedging-change-query':
            router.push({ name: 'HedgingChangeQuery' });
            break;
        case 'promotion-business-query':
            router.push({ name: 'PromotionBusinessQuery' });
            break;
        case 'loan-deposit-withdrawal-query':
            router.push({ name: 'LoanDepositWithdrawQuery' });
            break;
        case 'personal-share-query':
            router.push({ name: 'PersonalShareQuery' });
            break;
        case 'cash-recharge-details':
            router.push({ name: 'CashRechargeDetails' });
            break;
        case 'wash-hand-data-error-check':
            router.push({ name: 'WashHandDataErrorCheck' });
            break;
        case 'reconciliation-analysis-difference':
            router.push({ name: 'ReconciliationAnalysisDifference' });
            break;
        case 'wash-hand-flow-analysis':
            router.push({ name: 'WashHandFlowAnalysis' });
            break;
        case 'table-general-ledger':
            router.push({ name: 'DeskLedger' });
            break;
        case 'sanbao-statistics':
            router.push({ name: 'SanbaoStatistics' });
            break;
        case 'personal-share-statistics':
            router.push({ name: 'PersonalShareStatistics' });
            break;
        case 'hedging-change-statistics':
            router.push({ name: 'HedgingChangeStatistics' });
            break;
        case 'promotion-business-statistics':
            router.push({ name: 'PromotionStatistics' });
            break;
        case 'agent-settings':
            router.push({ name: 'AgentSettings' });
            break;
        case 'agent-commission':
            router.push({ name: 'AgentCommission' });
            break;
        case 'agent-details':
            router.push({ name: 'AgentDetails' });
            break;
        case 'pump-detail-analysis':
            router.push({ name: 'PumpDetailAnalysis' });
            break;
        case 'pump-statistics-analysis':
            router.push({ name: 'PumpStatisticAnalysis' });
            break;
        case 'activity-analysis':
            router.push({ name: 'ActivityAnalysis' });
            break;
        case 'recently-inactive-players':
            router.push({ name: 'RecentInactivePlayer' });
            break;
        case 'manual-bet-entry-log':
            router.push({ name: 'ManualBetEntryLog' });
            break;
        default:
            console.log(`选择了: ${item.title}`);
    }
}
</script>