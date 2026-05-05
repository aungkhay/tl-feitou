<template>
    <div>
        <v-navigation-drawer
            v-model="drawer"
            :permanent="innerWidth > 786 || isDrawerOpen > 0"
            expand-on-hover
            :rail="isDrawerOpen == 2"
            style="box-shadow: 1px 0px 7px 1px #00000020;"
            theme="dark"
            width="200"
        >
            <v-list-item height="64" class="text-primary font-weight-bold"><v-icon>mdi-finance</v-icon> 财务端</v-list-item>

            <v-list nav slim :opened="open">
                <div v-for="(item, index) in drawerItems" :key="index">
                    <v-list-group 
                        :value="item.title"
                        :collapse-icon="item.children?.length > 0 ? 'mdi-chevron-up' : null"
                        :expand-icon="item.children?.length > 0 ? 'mdi-chevron-down' : null"
                    >
                        <template v-slot:activator="{ props }">
                            <v-list-item 
                                v-bind="props" 
                                :title="item.title" 
                                :value="item.title"
                                :prepend-icon="item.icon"
                                :active="item.isSelected"
                                color="primary"
                                @click="item.children ? {} : changeRoute(index, -1)"
                                :height="50"
                            ></v-list-item>
                        </template>

                        <div v-for="(child, i) in item?.children" :key="i">
                            <v-list-item
                                :title="child.title"
                                :value="child.title"
                                :active="child.isSelected"
                                color="primary"
                                @click="changeRoute(index, i)"
                                :height="50"
                            ></v-list-item>
                        </div>
                        
                    </v-list-group>
                </div>
            </v-list>

            <template v-slot:append>
                <div class="px-2 py-3">
                    <v-btn block color="red-darken-4" variant="flat" @click="showLogoutDialog = true"><v-icon>mdi-logout</v-icon><span v-if="isDrawerOpen < 2">退出</span></v-btn>
                </div>
            </template>
        </v-navigation-drawer>

        <LogoutDialog v-model="showLogoutDialog" />
    </div>
</template>

<script setup>
import FinanceImg from '../assets/Finance-rafiki.svg';
import LogoutDialog from './system-settings/LogoutDialog.vue';
import { ref, computed, watch } from 'vue';
import { useDisplay } from 'vuetify';
import router from '../router';
import { useUserStore } from '../stores/user';
import { useTabsStore } from '../stores/tabs';
import { useDrawerStore } from '../stores/drawer';

const userStore = useUserStore();
const tabsStore = useTabsStore();
const drawerStore = useDrawerStore();
const { xs } = useDisplay();
const showLogoutDialog = ref(false);
const isDrawerOpen = computed(() => drawerStore.isDrawerOpen);
const innerWidth = computed(() => drawerStore.innerWidth);
const currentRoute = computed(() => drawerStore.currentRoute);
const dialog = ref(false);
const drawer = ref(null);
const isLoading = ref(false);
const open = ref([]);
const drawerItems = ref([
    {
        title: '上下分',
        icon: 'mdi-swap-vertical',
        routeName: 'PointInOut',
        isSelected: false,
    },
    {
        title: '多台转分',
        icon: 'mdi-chart-timeline-variant-shimmer',
        routeName: 'MultiDeskTransfer',
        isSelected: false,
    },
    {
        title: '兑换积分',
        icon: 'mdi-chart-bar',
        routeName: 'RedeemPoint',
        isSelected: false,
    },
    {
        title: '银行卡业务',
        icon: 'mdi-bank',
        isSelected: false,
        children: [
            {
                title: '银行卡设置',
                icon: 'mdi-file-document-outline',
                routeName: 'BankCardSettings',
                isSelected: false,
            },
            {
                title: '转账登记',
                icon: 'mdi-file-document-outline',
                routeName: 'CardBalanceTransfer',
                isSelected: false,
            },
            {
                title: '银行卡明细',
                icon: 'mdi-file-document-outline',
                routeName: 'BankCardDetail',
                isSelected: false,
            },
            {
                title: '银行现金统计',
                icon: 'mdi-file-document-outline',
                routeName: 'BankCashStatistics',
                isSelected: false,
            }
        ]
    },
    {
        title: '办公业务',
        icon: 'mdi-briefcase',
        routeName: 'ExpanseRegisteration',
        isSelected: false,
    },
    {
        title: '加减彩业务',
        icon: 'mdi-cash-plus',
        routeName: 'JiajiancaiRegistration',
        isSelected: false,
    },
    {
        title: '财务查询',
        icon: 'mdi-magnify',
        isSelected: false,
        children: [
            {
                title: '洗手下注明细',
                icon: 'mdi-file-document-outline',
                routeName: 'WashHandBetDetails',
                isSelected: false,
            },
            {
                title: '查询局明细',
                icon: 'mdi-file-document-outline',
                routeName: 'QueryBureauDetails',
                isSelected: false,
            },
            {
                title: '洗手洗码盈亏',
                icon: 'mdi-file-document-outline',
                routeName: 'WashHandCodeProfitLoss',
                isSelected: false,
            },
            // { key: 'feipai-query', routeName: 'FeipaiQuery', title: '飞牌查询' },
            {
                title: '三宝查询',
                icon: 'mdi-file-document-outline',
                routeName: 'SanbaoQuery',
                isSelected: false,
            },
            {
                title: '对冲零钱查询',
                icon: 'mdi-file-document-outline',
                routeName: 'HedgingChangeQuery',
                isSelected: false,
            },
            // { key: 'promotion-business-query', routeName: 'PromotionBusinessQuery', title: '推广业务查询' },
            // { key: 'loan-deposit-withdrawal-query', routeName: 'LoanDepositWithdrawalQuery', title: '借款，存取款查询' },
            {
                title: '个人占成明细',
                icon: 'mdi-file-document-outline',
                routeName: 'PersonalShareQuery',
                isSelected: false,
            },
            {
                title: '现金充值明细',
                icon: 'mdi-file-document-outline',
                routeName: 'CashRechargeDetails',
                isSelected: false,
            },
            // { key: 'wash-hand-data-error-check', routeName: 'WashHandDataErrorCheck', title: '洗手数据查错' },
            // { key: 'reconciliation-analysis-difference', routeName: 'ReconciliationAnalysisDifference', title: '对账分析差额' },
            // { key: 'wash-hand-flow-analysis', routeName: 'WashHandFlowAnalysis', title: '洗手流水分析' },
        ]
    },
    {
        title: '财务统计',
        icon: 'mdi-chart-box',
        isSelected: false,
        children: [
            {
                title: '台面总账',
                icon: 'mdi-file-document-outline',
                routeName: 'DeskLedger',
                isSelected: false,
            },
            {
                title: '三宝统计',
                icon: 'mdi-file-document-outline',
                routeName: 'SanbaoStatistics',
                isSelected: false,
            },
            {
                title: '个人占成统计',
                icon: 'mdi-file-document-outline',
                routeName: 'PersonalShareStatistics',
                isSelected: false,
            },
            // { key: 'hedging-change-statistics', routeName: 'HedgingChangeStatistics', title: '对冲零钱统计' },
            // { key: 'promotion-business-statistics', routeName: 'PromotionBusinessStatistics', title: '推广业务统计' },
        ]
    },
    // {
    //     key: 'agent-business',
    //     title: '代理业务',
    //     children: [
    //         { key: 'agent-settings', routeName: 'AgentSettings', title: '代理设置' },
    //         { key: 'agent-commission', routeName: 'AgentCommission', title: '代理返佣' },
    //         { key: 'agent-details', routeName: 'AgentDetails', title: '代理明细' },
    //     ],
    // },
    // {
    //     key: 'data-analysis',
    //     title: '数据分析',
    //     children: [
    //         { key: 'pump-detail-analysis', routeName: 'PumpDetailAnalysis', title: '抽水明细分析' },
    //         { key: 'pump-statistics-analysis', routeName: 'PumpStatisticsAnalysis', title: '抽水统计分析' },
    //         { key: 'activity-analysis', routeName: 'ActivityAnalysis', title: '活跃度分析' },
    //         { key: 'recently-inactive-players', routeName: 'RecentlyInactivePlayers', title: '最近没有玩过玩家' },
    //         { key: 'manual-bet-entry-log', routeName: 'ManualBetEntryLog', title: '手工录入注码日志' },
    //     ],
    // },
    {
        title: '系统设置',
        icon: 'mdi-cog',
        routeName: 'SystemSettings',
        isSelected: false,
    },
    {
        title: '业务设置',
        icon: 'mdi-cog',
        routeName: 'BusinessSettings',
        isSelected: false,
    },
    {
        title: '用户管理',
        icon: 'mdi-account-group',
        routeName: 'UserManagement',
        isSelected: false,
    }
]);

function setDrawerActive(parentIndex, childIndex) {
    drawerItems.value = drawerItems.value.map((item) => {
        let parent = item;
        parent.isSelected = false;

        if (parent.children) {
            let children = parent.children;
            children = children.map(child => {
                child.isSelected = false;
                return child;
            });
            parent.children = children;
        }
        return parent;
    });

    drawerItems.value[parentIndex].isSelected = true;
    if (childIndex >= 0) {
        drawerItems.value[parentIndex].children[childIndex].isSelected = true;
    }

    open.value = [drawerItems.value[parentIndex].title];

    tabsStore.setActive(drawerItems.value[parentIndex].routeName);
    tabsStore.open({
        title: childIndex >= 0 ? drawerItems.value[parentIndex].children[childIndex].title : drawerItems.value[parentIndex].title,
        key: childIndex >= 0 ? drawerItems.value[parentIndex].children[childIndex].routeName : drawerItems.value[parentIndex].routeName,
        fullPath: childIndex >= 0 ? drawerItems.value[parentIndex].children[childIndex].routeName : drawerItems.value[parentIndex].routeName,
    });
}

function changeRoute(parentIndex, childIndex) {
    if (xs.value) {
        drawerStore.closeDrawer();
    }

    if (childIndex >= 0) {
        router.push({ name: drawerItems.value[parentIndex].children[childIndex].routeName })
    } else {
        router.push({ name: drawerItems.value[parentIndex].routeName })
    }
    setDrawerActive(parentIndex, childIndex);
}

watch(
    () => currentRoute.value,
    () => {
        for (let i = 0; i < drawerItems.value.length; i++) {
            const parent = drawerItems.value[i];
            if(parent.routeName && parent.routeName == currentRoute.value) {
                setDrawerActive(i, -1);
                break;
            } else if(parent.children) {
                const childIndex = parent.children.findIndex((item) => item.routeName == currentRoute.value);
                if(childIndex >= 0) {
                    setDrawerActive(i, childIndex);
                    break;
                }
            }
        }
    },
    { immediate: true, deep: true }
)
</script>

<style scoped>
.v-list-group__items .v-list-item {
  padding-inline-start: 16px !important;
}
</style>