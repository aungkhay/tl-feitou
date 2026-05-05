import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user';
import { useDrawerStore } from '../stores/drawer';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('../views/TestPage.vue')
    },
    {
        path: '/',
        redirect: '/in-out-points',
        component: () => import('../layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: 'system-settings',
                name: 'SystemSettings',
                component: () => import('../views/SystemSettings.vue'),
                meta: { title: '系统设置' }
            },
            {
                path: 'business-settings',
                name: 'BusinessSettings',
                component: () => import('../views/BusinessSettings.vue'),
                meta: { title: '业务设置' }
            },
            {
                path: 'in-out-points',
                name: 'PointInOut',
                component: () => import('../views/home/PointInOut.vue'),
                meta: { title: '上下分' }
            },
            {
                path: 'redeem-point',
                name: 'RedeemPoint',
                component: () => import('../views/home/RedeemPoint.vue'),
                meta: { title: '积分兑换' }
            },
            {
                path: 'multi-desk-transfer',
                name: 'MultiDeskTransfer',
                component: () => import('../views/home/MultiDeskTransfer.vue'),
                meta: { title: '多台转分' }
            },
            {
                path: 'bank-card-settings',
                name: 'BankCardSettings',
                component: () => import('../views/bank-operations/BankCardSettings.vue'),
                meta: { title: '银行卡设置' }
            },
            {
                path: 'card-balance-transfer',
                name: 'CardBalanceTransfer',
                component: () => import('../views/bank-operations/CardBalanceTransfer.vue'),
                meta: { title: '转账登记' }
            },
            {
                path: 'bank-card-detail',
                name: 'BankCardDetail',
                component: () => import('../views/bank-operations/BankCardDetail.vue'),
                meta: { title: '银行卡明细' }
            },
            {
                path: 'bank-cash-statistics',
                name: 'BankCashStatistics',
                component: () => import('../views/bank-operations/BankCashStatistics.vue'),
                meta: { title: '银行现金统计' }
            },
            {
                path: 'expanse-registeration',
                name: 'ExpanseRegisteration',
                component: () => import('../views/ExpanseRegisteration.vue'),
                meta: { title: '办公业务' }
            },
            {
                path: 'jiajiancai-registration',
                name: 'JiajiancaiRegistration',
                component: () => import('../views/JiajiancaiRegistration.vue'),
                meta: { title: '加减财业务' }
            },
            {
                path: 'wash-hand-bet-details',
                name: 'WashHandBetDetails',
                component: () => import('../views/financial-query/WashHandBetDetail.vue'),
                meta: { title: '洗码下注明细' }
            },
            {
                path: 'query-bureau-details',
                name: 'QueryBureauDetails',
                component: () => import('../views/financial-query/QueryBureauDetail.vue'),
                meta: { title: '局查询明细' }
            },
            {
                path: 'wash-hand-code-profit-loss',
                name: 'WashHandCodeProfitLoss',
                component: () => import('../views/financial-query/WashHandCodeProfitLoss.vue'),
                meta: { title: '洗手洗码盈亏' }
            },
            {
                path: 'feipai-query',
                name: 'FeiPaiQuery',
                component: () => import('../views/financial-query/FeipaiQuery.vue'),
                meta: { title: '飞牌查询' }
            },
            {
                path: 'sanbao-query',
                name: 'SanbaoQuery',
                component: () => import('../views/financial-query/SanbaoQuery.vue'),
                meta: { title: '三宝查询' }
            },
            {
                path: 'hedging-change-query',
                name: 'HedgingChangeQuery',
                component: () => import('../views/financial-query/HedgingChangeQuery.vue'),
                meta: { title: '对冲零钱查询' }
            },
            {
                path: 'promotion-business-query',
                name: 'PromotionBusinessQuery',
                component: () => import('../views/financial-query/PromotionBusinessQuery.vue'),
            },
            {
                path: 'loan-deposit-withdraw-query',
                name: 'LoanDepositWithdrawQuery',
                component: () => import('../views/financial-query/LoanDepositWithdrawQuery.vue'),
            },
            {
                path: 'personal-share-query',
                name: 'PersonalShareQuery',
                component: () => import('../views/financial-query/PersonalShareQuery.vue'),
                meta: { title: '个人占成查询' }
            },
            {
                path: 'cash-recharge-details',
                name: 'CashRechargeDetails',
                component: () => import('../views/financial-query/CashRechargeDetail.vue'),
                meta: { title: '现金充值明细' }
            },
            {
                path: 'wash-hand-data-error-check',
                name: 'WashHandDataErrorCheck',
                component: () => import('../views/financial-query/WashHandDataErrorCheck.vue'),
            },
            {
                path: 'reconciliation-analysis-difference',
                name: 'ReconciliationAnalysisDifference',
                component: () => import('../views/financial-query/ReconciliationAnalysisDifference.vue'),
            },
            {
                path: 'wash-hand-flow-analysis',
                name: 'WashHandFlowAnalysis',
                component: () => import('../views/financial-query/WashHandFlowAnalysis.vue'),
            },
            {
                path: 'desk-ledger',
                name: 'DeskLedger',
                component: () => import('../views/financial-statistics/DeskLedger.vue'),
                meta: { title: '台面总账' }
            },
            {
                path: 'sanbao-statistics',
                name: 'SanbaoStatistics',
                component: () => import('../views/financial-statistics/SanbaoStatistics.vue'),
                meta: { title: '三宝统计' }
            },
            {
                path: 'personal-share-statistics',
                name: 'PersonalShareStatistics',
                component: () => import('../views/financial-statistics/PersonalShareStatistics.vue'),
                meta: { title: '个人占成统计' }
            },
            {
                path: 'hedging-change-statistics',
                name: 'HedgingChangeStatistics',
                component: () => import('../views/financial-statistics/HedgingChangeStatistics.vue'),
            },
            {
                path: 'promotion-statistics',
                name: 'PromotionStatistics',
                component: () => import('../views/financial-statistics/PromotionStatistics.vue'),
            },
            {
                path: 'agent-settings',
                name: 'AgentSettings',
                component: () => import('../views/agent-business/AgentSettings.vue'),
            },
            {
                path: 'agent-commission',
                name: 'AgentCommission',
                component: () => import('../views/agent-business/AgentCommission.vue'),
            },
            {
                path: 'agent-details',
                name: 'AgentDetails',
                component: () => import('../views/agent-business/AgentDetails.vue'),
            },
            {
                path: 'pump-detail-analysis',
                name: 'PumpDetailAnalysis',
                component: () => import('../views/data-analysis/PumpDetailAnalysis.vue'),
            },
            {
                path: 'pump-statistic-analysis',
                name: 'PumpStatisticAnalysis',
                component: () => import('../views/data-analysis/PumpStatisticAnalysis.vue'),
            },
            {
                path: 'activity-analysis',
                name: 'ActivityAnalysis',
                component: () => import('../views/data-analysis/ActivityAnalysis.vue'),
            },
            {
                path: 'recent-inactive-players',
                name: 'RecentInactivePlayer',
                component: () => import('../views/data-analysis/RecentInactivePlayer.vue'),
            },
            {
                path: 'manual-bet-entry-log',
                name: 'ManualBetEntryLog',
                component: () => import('../views/data-analysis/ManualBetEntryLog.vue'),
            },
            {
                path: 'user-management',
                name: 'UserManagement',
                component: () => import('../views/UserManagement.vue'),
            }
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();

    const drawerStore = useDrawerStore();

    const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
    const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

    if(nearestWithTitle) {
        document.title = nearestWithTitle.meta.title;
        drawerStore.setBarTitle(nearestWithTitle.meta.title);
    } else if(previousNearestWithMeta) {
        document.title = previousNearestWithMeta.meta.title;
        drawerStore.setBarTitle(previousNearestWithMeta.meta.title);
    }

    if(to.matched.some(record => record.meta.requiresAuth)) {
    
        if(!userStore.isLoggedIn) {
            return next({
                name: 'login',
                replace: false,
            });
        }

    } else {
        if(to.name === 'login' && userStore.isLoggedIn) {
            return next({
                name: 'login',
                replace: true,
            });
        }
    }

    return next();
})

export default router