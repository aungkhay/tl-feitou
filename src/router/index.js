import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/',
        redirect: '/home',
        component: () => import('../layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/Home.vue'),
            },
            {
                path: 'in-out-points',
                name: 'PointInOut',
                component: () => import('../views/home/PointInOut.vue'),
            },
            {
                path: 'multi-desk-transfer',
                name: 'MultiDeskTransfer',
                component: () => import('../views/home/MultiDeskTransfer.vue'),
            },
            {
                path: 'bank-card-settings',
                name: 'BankCardSettings',
                component: () => import('../views/bank-operations/BankCardSettings.vue'),
            },
            {
                path: 'card-balance-transfer',
                name: 'CardBalanceTransfer',
                component: () => import('../views/bank-operations/CardBalanceTransfer.vue'),
            },
            {
                path: 'bank-card-detail',
                name: 'BankCardDetail',
                component: () => import('../views/bank-operations/BankCardDetail.vue'),
            },
            {
                path: 'bank-cash-statistics',
                name: 'BankCashStatistics',
                component: () => import('../views/bank-operations/BankCashStatistics.vue'),
            },
            {
                path: 'expanse-registeration',
                name: 'ExpanseRegisteration',
                component: () => import('../views/ExpanseRegisteration.vue'),
            },
            {
                path: 'jiajiancai-registration',
                name: 'JiaJianCaiRegistration',
                component: () => import('../views/JiaJianCaiRegistration.vue'),
            },
            {
                path: 'wash-hand-bet-details',
                name: 'WashHandBetDetails',
                component: () => import('../views/financial-query/WashHandBetDetail.vue'),
            },
            {
                path: 'query-bureau-details',
                name: 'QueryBureauDetails',
                component: () => import('../views/financial-query/QueryBureauDetail.vue'),
            },
            {
                path: 'wash-hand-code-profit-loss',
                name: 'WashHandCodeProfitLoss',
                component: () => import('../views/financial-query/WashHandCodeProfitLoss.vue'),
            },
            {
                path: 'feipai-query',
                name: 'FeiPaiQuery',
                component: () => import('../views/financial-query/FeipaiQuery.vue'),
            },
            {
                path: 'sanbao-query',
                name: 'SanbaoQuery',
                component: () => import('../views/financial-query/SanbaoQuery.vue'),
            },
            {
                path: 'hedging-change-query',
                name: 'HedgingChangeQuery',
                component: () => import('../views/financial-query/HedgingChangeQuery.vue'),
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
            },
            {
                path: 'cash-recharge-details',
                name: 'CashRechargeDetails',
                component: () => import('../views/financial-query/CashRechargeDetail.vue'),
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
            },
            {
                path: 'sanbao-statistics',
                name: 'SanbaoStatistics',
                component: () => import('../views/financial-statistics/SanbaoStatistics.vue'),
            },
            {
                path: 'personal-share-statistics',
                name: 'PersonalShareStatistics',
                component: () => import('../views/financial-statistics/PersonalShareStatistics.vue'),
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

    if(to.matched.some(record => record.meta.requiresAuth)) {
    
        if(!userStore.isLoggedIn) {
            return next({
                name: 'login',
                replace: false,
            });
        }

    } else {
        if(to.name ===  'login' && userStore.isLoggedIn) {
            return next({
                name: 'Home',
                replace: true,
            });
        }
    }

    return next();
})

export default router