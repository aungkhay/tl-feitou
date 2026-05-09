<template>
    <div class="px-2 py-3">
        <div class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row dense>
                <v-col cols="12" sm="2">
                    <v-autocomplete
                        v-model="filters.group_nickname"
                        :items="groups"
                        item-title="group_nickname"
                        item-value="group_nickname"
                        label="选择操作台"
                        density="compact"
                        variant="outlined"
                        hide-details
                        clearable
                        @click:clear="filters.group_nickname = null"
                        autocomplete="off"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-select
                        v-model="filters.bet_type"
                        :items="betTypes"
                        item-title="title"
                        item-value="value"
                        label="下注类型"
                        density="compact"
                        variant="outlined"
                        hide-details
                        clearable
                        @click:clear="filters.bet_type = null"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>
                    </v-select>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-text-field
                        v-model="filters.player_name"
                        item-title="title"
                        item-value="value"
                        label="选手名称"
                        density="compact"
                        variant="outlined"
                        hide-details
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-menu
                        v-model="fromDateMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                    >
                        <template #activator="{ props }">
                            <v-text-field
                                v-bind="props"
                                label="开始时间"
                                variant="outlined"
                                density="compact"
                                readonly
                                :model-value="formattedDate(filters.startTime)"
                                hide-details
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="filters.startTime"
                            @update:model-value="fromDateMenu = false"
                        />
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-menu
                        v-model="toDateMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                    >
                        <template #activator="{ props }">
                            <v-text-field
                                v-bind="props"
                                label="结束时间"
                                variant="outlined"
                                density="compact"
                                readonly
                                :model-value="formattedDate(filters.endTime)"
                                hide-details
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="filters.endTime"
                            @update:model-value="toDateMenu = false"
                        />
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="2">
                    <div class="d-flex">
                        <div class="w-50 pr-1">
                            <v-btn color="primary" block @click="getRecords"><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                        </div>
                        <div class="w-50 pl-1">
                            <v-btn color="success" block :loading="isExporting" @click="exportTable"><v-icon>mdi-file-excel</v-icon> 导出报表</v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>

        <v-data-table-server
            v-model:page="page"
            v-model:items-per-page="perPage"
            :headers="headers"
            :items="records"
            :items-length="total"
            :loading="loading"
            density="compact"
            class="table1"
            :items-per-page-options="pageSizeOptions"
            @update:options="getRecords"
            hover
        >
            <template #loading>
                <v-skeleton-loader type="table-row@8"/>
            </template>
            <template #item.bet_time="{ item }">
                {{ $filters.formatFullDate(item.bet_time) }}
            </template>
            <template #item.result_time="{ item }">
                {{ $filters.formatFullDate(item.result_time) }}
            </template>
            <template #body.append>
                <tr class="font-weight-bold bg-grey-lighten-2">
                    <td colspan="3">下注前金额: {{ summary.total_before_bet_ye }}</td>
                    <td colspan="2">总数: {{ summary.total_count }}</td>
                    <td colspan="2">总下注: {{ summary.total_xz }}</td>
                    <td colspan="2">总盈亏: {{ summary.total_yl }}</td>
                    <td colspan="6"></td>
                </tr>
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formattedDate, exportExcel } from '../../js/common';
import { useUserStore } from '../../stores/user';
import { GET_PLAYER_BETTING_DETAILS } from '../../js/api/financial_inquiries';
import { getCurrentInstance } from 'vue'
import { useToast } from 'vue-toastification';
import moment from 'moment';

const { appContext } = getCurrentInstance()

const toast = useToast();
const userStore = useUserStore();
const fromDateMenu = ref(false);
const toDateMenu = ref(false);

const records = ref([]);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const loading = ref(false);
const isExporting = ref(false);
const pageSizeOptions = computed(() => userStore.tablePageSize);
const headers = ref([
    { title: '序列', value: 'index', fixed: 'start', minWidth: 70 },
    { title: '会员昵称', value: 'palyer_nickname', minWidth: 120 },
    { title: '靴局', value: 'round', minWidth: 100 },
    { title: '下注金额', value: 'bet', minWidth: 120 },
    { title: '下注输赢', value: 'win', minWidth: 120 },
    { title: '下注命令', value: 'bet_command', minWidth: 150 },
    { title: '命令格式', value: 'command_format', minWidth: 150 },
    { title: '下注时间', value: 'bet_time', minWidth: 170 },
    { title: '开奖结果', value: 'result', minWidth: 150 },
    { title: '开奖时间', value: 'result_time', minWidth: 170 },
    { title: '结算状态', value: 'settlement_status', minWidth: 120 },
    { title: '原始字符串', value: 'raw_string', minWidth: 170 },
    { title: '下注前金额', value: 'before_bet_money', minWidth: 120 },
    { title: '初始金额', value: 'init_money', minWidth: 120 },
    { title: '台号', value: 'table_number', minWidth: 100, fixed: 'end' },
])

const groups = computed(() => userStore.groups);
const betTypes = ref([
    { title: "庄", value: "z" },
    { title: "闲对", value: "xd" },
    { title: "庄对", value: "zd" },
    { title: "和", value: "h" },
    { title: "幸运6", value: "l" },
    { title: "完美", value: "m" },
    { title: "任意", value: "d" },
    { title: "庄闲洗码", value: "xml_zx" },
    { title: "三宝洗码", value: "xml_sb" },
    { title: "庄闲盈亏", value: "zx_yl" },
    { title: "三宝盈亏", value: "sb_yl" },
    { title: "有效流水", value: "yxxz" },
]);
const summary = ref({
    total_before_bet_ye: 0,
    total_count: 0,
    total_xz: 0,
    total_yl: 0
});

const filters = ref({
    group_nickname: null,
    bet_type: null,
    player_name: '',
    startTime: moment().startOf('day').toDate(),
    endTime: moment().add(1, 'day').startOf('day').toDate(),
});

const getRecords = async () => {
    loading.value = true;
    try {
        const res = await GET_PLAYER_BETTING_DETAILS(
            filters.value.player_name,
            filters.value.startTime,
            filters.value.endTime,
            filters.value.bet_type,
            filters.value.group_nickname,
            page.value,
            perPage.value,
        );
        if (res.code == 200) {
            records.value = res.data.rows.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.count;
            summary.value = res.data.summary;
        }
    } catch (error) {
        console.error('获取记录失败:', error);
    } finally {
        loading.value = false;
    }
}

const exportTable = async () => {
    isExporting.value = true;
    try {
        const res = await GET_PLAYER_BETTING_DETAILS(
            filters.value.player_name,
            filters.value.startTime,
            filters.value.endTime,
            filters.value.bet_type,
            filters.value.group_nickname,
            1,
            total.value || 1000
        );
        if (res.code == 200) {
            const data = res.data.rows.map(item => ({
                '序列': item.index,
                '会员昵称': item.palyer_nickname,
                '靴局': item.round,
                '下注金额': item.bet,
                '下注输赢': item.win,
                '下注命令': item.bet_command,
                '命令格式': item.command_format,
                '下注时间': appContext.config.globalProperties.$filters.formatFullDate(item.bet_time),
                '开奖结果': item.result,
                '开奖时间': appContext.config.globalProperties.$filters.formatFullDate(item.result_time),
                '结算状态': item.settlement_status,
                '原始字符串': item.raw_string,
                '下注前金额': item.before_bet_money,
                '初始金额': item.init_money,
                '台号': item.table_number,
            }));
            exportExcel(data, `洗码下注明细-${formattedDate(new Date())}`);
        } else {
            toast.error(res.msg || '获取数据失败，无法导出表格');
        }
    } catch (error) {
        console.error('Error exporting records:', error);
        toast.error('导出失败，请稍后再试');
    } finally {
        isExporting.value = false;
    }
}
</script>