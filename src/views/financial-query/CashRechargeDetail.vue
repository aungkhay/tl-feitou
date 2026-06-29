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
                        @click:append-inner="filters.group_nickname = null"
                        autocomplete="off"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>                    
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-select
                        v-model="filters.option_type"
                        :items="['充值', '取款']"
                        label="操作类型"
                        variant="outlined"
                        density="compact"
                        hide-details
                        clearable
                        @click:clear="filters.option_type = ''"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>   
                    </v-select>
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
                                :model-value="formattedDate(filters.start_date, filters.start_time)"
                                hide-details
                                clearable
                                @click:clear="filters.start_date = null; filters.start_time = null"
                            ></v-text-field>
                        </template>

                        <div class="bg-blue-lighten-4">
                            <div class="d-flex">
                                <v-date-picker 
                                    v-model="filters.start_date" 
                                    color="primary" 
                                    bg-color="blue-lighten-4"
                                />
                                <v-time-picker 
                                    v-model="filters.start_time" 
                                    use-seconds 
                                    format="24hr" 
                                    color="primary" 
                                    bg-color="blue-lighten-4"
                                />
                            </div>
                            <div class="d-flex justify-end mb-2 mr-2">
                                <v-btn text color="primary" variant="tonal" @click="fromDateMenu = false">确定</v-btn>
                            </div>
                        </div>
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
                                :model-value="formattedDate(filters.end_date, filters.end_time)"
                                hide-details
                                clearable
                                @click:clear="filters.end_date = null; filters.end_time = null"
                            ></v-text-field>
                        </template>

                        <div class="bg-blue-lighten-4">
                            <div class="d-flex">
                                <v-date-picker 
                                    v-model="filters.end_date" 
                                    color="primary" 
                                    bg-color="blue-lighten-4"
                                />
                                <v-time-picker 
                                    v-model="filters.end_time" 
                                    use-seconds 
                                    format="24hr" 
                                    color="primary" 
                                    bg-color="blue-lighten-4"
                                />
                            </div>
                            <div class="d-flex justify-end mb-2 mr-2">
                                <v-btn text color="primary" variant="tonal" @click="toDateMenu = false">确定</v-btn>
                            </div>
                        </div>
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="2">
                    <div class="d-flex">
                        <div class="w-50 pr-1">
                            <v-btn color="primary" @click="getRecords" block><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                        </div>
                        <div class="w-50 pl-1">
                            <v-btn color="success" block @click="exportTable" :loading="isExporting"><v-icon>mdi-file-excel</v-icon> 导出报表</v-btn>
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
            <template #item.shoe_round="{ item }">
                <span>{{ item.cc }} - {{ item.jc }}</span>
            </template>
            <template #item.playername="{ item }">
                <span :class="{ 'text-error font-weight-bold': isVirtualPlayer(item.playername) }">{{ item.playername }}</span>
            </template>
            <template #body.append>
                <tr class="font-weight-bold bg-grey-lighten-2">
                    <td colspan="2">总充值: {{ summary.total_add }}</td>
                    <td colspan="2">总取款: {{ summary.total_subtract }}</td>
                    <td colspan="2">净总额: {{ summary.net_total }}</td>
                    <td colspan="5"></td>
                </tr>
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useUserStore } from '../../stores/user';
import { GET_RECHARGE_DETAILS_INQUIRY } from '../../js/api/financial_inquiries';
import { formattedDate, exportExcel } from '../../js/common';
import { useToast } from 'vue-toastification';
import moment from 'moment';

const toast = useToast();
const userStore = useUserStore();
const isVirtualPlayer = computed(() => userStore.isVirtualPlayer);
const records = ref([]);
const total = ref(0);
const page = ref(1);
const perPage = ref(15);
const loading = ref(false);
const pageSizeOptions = computed(() => userStore.tablePageSize);
const headers = ref([
    { title: '序列', value: 'index', fixed: 'start', width: 60 },
    { title: '台号', value: 'group_nickname', fixed: 'start', minWidth: 120 },
    { title: '会员昵称', value: 'playername', minWidth: 120 },
    { title: '操作金额', value: 'score', minWidth: 120 },
    { title: '操作前金额', value: 'before_option_score', minWidth: 120 },
    { title: '操作类型', value: 'option_type', minWidth: 120 },
    { title: '工作日', value: 'working_date', minWidth: 120 },
    { title: '操作时间', value: 'option_time', minWidth: 170 },
    { title: '操作员', value: 'optioner', minWidth: 120 },
    { title: '操作说明', value: 'memo', minWidth: 200 },
    { title: '银行卡', value: 'bank_card', minWidth: 150 },
]);
const summary = ref({
    net_total: 0,
    total_add: 0,
    total_subtract: 0,
})
const isExporting = ref(false);
const groups = computed(() => userStore.groups);
const fromDateMenu = ref(false);
const toDateMenu = ref(false);
const filters = ref({
    start_date: moment().startOf('day').toDate(),
    start_time: '00:00:00',
    end_date: moment().startOf('day').toDate(),
    end_time: '23:59:59',
    group_nickname: null,
    option_type: null,
});

const getRecords = async () => {
    loading.value = true;
    try {
        const res = await GET_RECHARGE_DETAILS_INQUIRY(
            filters.value.start_date && filters.value.start_time ? moment(filters.value.start_date).format('YYYY-MM-DD') + ' ' + filters.value.start_time : null,
            filters.value.end_date && filters.value.end_time ? moment(filters.value.end_date).format('YYYY-MM-DD') + ' ' + filters.value.end_time : null,
            filters.value.group_nickname, 
            filters.value.option_type, 
            page.value, 
            perPage.value
        );
        records.value = res.data.list.map((record, index) => ({
            ...record,
            index: (page.value - 1) * perPage.value + index + 1,
        }));
        total.value = res.data.total;
        summary.value = res.data.summary;
    } catch (error) {
        console.error('Error fetching records:', error);
    } finally {
        loading.value = false;
    }
};

const exportTable = async () => {
    isExporting.value = true;
    try {
        const res = await GET_RECHARGE_DETAILS_INQUIRY(
            filters.value.start_date && filters.value.start_time ? moment(filters.value.start_date).format('YYYY-MM-DD') + ' ' + filters.value.start_time : null,
            filters.value.end_date && filters.value.end_time ? moment(filters.value.end_date).format('YYYY-MM-DD') + ' ' + filters.value.end_time : null,
            filters.value.group_nickname,
            filters.value.option_type,
            1,
            total.value || 10000
        );
        if (res.code == 200) {
            const data = res.data.list.map(item => ({
                '序列': item.index,
                '台号': item.group_nickname,
                '会员昵称': item.playername,
                '操作金额': item.score,
                '操作前金额': item.before_option_score,
                '操作类型': item.option_type,
                '工作日': item.working_date,
                '操作时间': item.option_time,
                '操作员': item.optioner,
                '操作说明': item.memo,
                '银行卡': item.bank_card
            }));
            exportExcel(data, `现金充值明细-${formattedDate(new Date())}`);
        } else {
            toast.error(res.msg || '获取数据失败，无法导出表格');
        }
    } catch (error) {
        console.error('Error exporting records:', error);
        toast.error('导出失败，请稍后再试');
    } finally {
        isExporting.value = false;
    }
};
</script>