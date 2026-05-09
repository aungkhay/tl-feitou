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
                                clearable
                                @click:clear="filters.startTime = null"
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
                                clearable
                                @click:clear="filters.endTime = null"
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
            <template #item.date="{ item }">
                {{ $filters.formatDate(item.date) }}
            </template>
            <template #body.append>
                <tr class="font-weight-bold bg-grey-lighten-2">
                    <td colspan="3">合计</td>
                    <td>{{ summary.sb }}</td>
                    <td>{{ summary.sb_yl }}</td>
                    <td>{{ summary.l }}</td>
                    <td>{{ summary.m }}</td>
                    <td>{{ summary.d }}</td>
                    <td>{{ summary.l_yl }}</td>
                    <td>{{ summary.m_yl }}</td>
                    <td>{{ summary.d_yl }}</td>
                    <td>{{ summary.company_yl }}</td>
                </tr>
            </template>
        </v-data-table-server>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { useUserStore } from '../../stores/user';
import { formattedDate, exportExcel } from '../../js/common';
import { GET_SB_STATISTICS } from '../../js/api/financial_statistics';
import { useToast } from 'vue-toastification';
import { getCurrentInstance } from 'vue'
import moment from 'moment';

const { appContext } = getCurrentInstance()
const toast = useToast();
const userStore = useUserStore();
const records = ref([]);
const total = ref(0);
const page = ref(1);
const perPage = ref(10);
const loading = ref(false);
const pageSizeOptions = computed(() => userStore.tablePageSize);
const headers = ref([
    { title: '序列', value: 'index', fixed: 'start', width: 60 },
    { title: '台号', value: 'group_nickname', fixed: 'start', minWidth: 120 },
    { title: '工作日', value: 'stat_date', minWidth: 120 },
    { title: '三宝总投注分', value: 'sb', minWidth: 150 },
    { title: '三宝洗手赢亏分', value: 'sb_yl', minWidth: 150 },
    { title: '幸运6(单)总投注分', value: 'l', minWidth: 150 },
    { title: '完美(双)总投注分', value: 'm', minWidth: 150 },
    { title: '任意总投注分', value: 'd', minWidth: 150 },
    { title: '幸运6(单)洗手赢亏总分', value: 'l_yl', minWidth: 180 },
    { title: '完美(双)洗手赢亏总分', value: 'm_yl', minWidth: 170 },
    { title: '任意洗手赢亏总分', value: 'd_yl', minWidth: 150 },
    { title: '公司利润总分', value: 'company_yl', minWidth: 150 }
]);
const summary = ref({
    sb: 0,
    sb_yl: 0,
    l: 0,
    m: 0,
    d: 0,
    l_yl: 0,
    m_yl: 0,
    d_yl: 0,
    company_yl: 0
})
const isExporting = ref(false);
const groups = computed(() => userStore.groups);
const fromDateMenu = ref(false);
const toDateMenu = ref(false);
const filters = ref({
    startTime: moment().startOf('day').toDate(),
    endTime: moment().add(1, 'day').startOf('day').toDate(),
    group_nickname: null
});

const getRecords = async () => {
    loading.value = true;
    try {
        const res = await GET_SB_STATISTICS(filters.value.startTime, filters.value.endTime, filters.value.group_nickname, page.value, perPage.value);
        if (res.code == 200) {
            records.value = res.data.list.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.total;
            summary.value = res.data.summary; 
        }
    } catch (error) {
        console.error('Error fetching records:', error);
    } finally {
        loading.value = false;
    }
}

const exportTable = async () => {
    isExporting.value = true;
    try {
        const res = await GET_SB_STATISTICS(filters.value.startTime, filters.value.endTime, filters.value.group_nickname, 1, total.value || 10000);
        if (res.code == 200) {
            const data = res.data.list.map(item => ({
                '台号': item.group_nickname,
                '工作日': appContext.config.globalProperties.$filters.formatDate(item.stat_date),
                '三宝总投注分': item.sb,
                '三宝洗手赢亏分': item.sb_yl,
                '幸运6(单)总投注分': item.l,
                '完美(双)总投注分': item.m,
                '任意总投注分': item.d,
                '幸运6(单)洗手赢亏总分': item.l_yl,
                '完美(双)洗手赢亏总分': item.m_yl,
                '任意洗手赢亏总分': item.d_yl,
                '公司利润总分': item.company_yl
            }));
            
            exportExcel(data, `三宝统计-${formattedDate(new Date())}`);
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