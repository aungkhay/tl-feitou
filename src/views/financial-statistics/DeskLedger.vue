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
                    <td colspan="2">合计</td>
                    <td>{{ summary.xzspyk }}</td>
                    <td>{{ summary.spxm }}</td>
                    <td>{{ summary.spzsyk }}</td>
                    <td>{{ summary.lxly }}</td>
                    <td>{{ summary.dcly }}</td>
                    <td>{{ summary.zxtmzcsy }}</td>
                    <td>{{ summary.zxtmzcxm }}</td>
                    <td>{{ summary.lyhs }}</td>
                </tr>
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useUserStore } from '../../stores/user';
import { formattedDate, exportExcel } from '../../js/common';
import { GET_DAILY_QUERY_SUMMARY } from '../../js/api/financial_statistics';
import { useToast } from 'vue-toastification';
import moment from 'moment';

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
    { title: '日期', value: 'date', fixed: 'start', minWidth: 120 },
    { title: '庄闲/龙虎上盘输赢', value: 'xzspyk', minWidth: 150 },
    { title: '上盘洗码汇总', value: 'spxm', minWidth: 150 },
    { title: '上盘抽水赢亏', value: 'spzsyk', minWidth: 150 },
    { title: '零钱利润', value: 'lxly', minWidth: 120 },
    { title: '对冲总利润', value: 'dcly', minWidth: 120 },
    { title: '庄闲/龙虎台面占成输赢', value: 'zxtmzcsy', minWidth: 180 },
    { title: '庄闲/龙虎台面占成洗码', value: 'zxtmzcxm', minWidth: 180 },
    { title: '利润汇总', value: 'lyhs', minWidth: 120 }
]);
const summary = ref({
    xzspyk: 0,
    spxm: 0,
    spzsyk: 0,
    lxly: 0,
    dcly: 0,
    zxtmzcsy: 0,
    zxtmzcxm: 0,
    lyhs: 0
});
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
        const res = await GET_DAILY_QUERY_SUMMARY(filters.value.startTime, filters.value.endTime, filters.value.group_nickname, page.value, perPage.value);
        if (res.code == 200) {
            records.value = res.data.list.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.total;
            summary.value = res.data.summary; 
        }
    } catch (error) {
        console.error('查询失败:', error);
    } finally {
        loading.value = false;
    }
};

const exportTable = async () => {
    isExporting.value = true;
    try {
        const res = await GET_DAILY_QUERY_SUMMARY(filters.value.startTime, filters.value.endTime, filters.value.group_nickname, 1, total.value || 10000);
        if (res.code == 200) {
            const data = res.data.list.map(item => ({
                '序列': item.index,
                '日期': item.date,
                '庄闲/龙虎上盘输赢': item.xzspyk,
                '上盘洗码汇总': item.spxm,
                '上盘抽水赢亏': item.spzsyk,
                '零钱利润': item.lxly,
                '对冲总利润': item.dcly,
                '庄闲/龙虎台面占成输赢': item.zxtmzcsy,
                '庄闲/龙虎台面占成洗码': item.zxtmzcxm,
                '利润汇总': item.lyhs
            }));
            exportExcel(data, `台面总账-${formattedDate(new Date())}`);
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