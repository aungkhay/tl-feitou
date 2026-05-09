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
                    <v-text-field
                        v-model="filters.player_name"
                        label="洗手昵称"
                        variant="outlined"
                        density="compact"
                        hide-details
                        clearable
                        @click:clear="filters.player_name = ''"
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
                                clearable
                                @click:clear="filters.startTime = ''"
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
                                @click:clear="filters.endTime = ''"
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
            <template #item.stat_date="{ item }">
                {{ $filters.formatDate(item.stat_date) }}
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useUserStore } from '../../stores/user';
import { GET_ZC_DETAILS_INQUIRY } from '../../js/api/financial_inquiries';
import { formattedDate, exportExcel } from '../../js/common';
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
    { title: '台号', value: 'group_nickname', fixed: 'start', minWidth: 120 },
    { title: '日期', value: 'stat_date', width: 120 },
    { title: '昵称', value: 'nickname', minWidth: 100 },
    { title: '闲庄/龙虎占成洗码', value: 'zxzcxm', minWidth: 150 },
    { title: '闲庄/龙虎占成赢亏', value: 'zxyl', minWidth: 150 },
    { title: '三宝占成洗码', value: 'xml_sb', minWidth: 150 },
    { title: '三宝占成赢亏', value: 'sb_yl', minWidth: 150 },
    // { title: '占成总流水', value: 'total_profit', minWidth: 150 },
]);
const isExporting = ref(false);
const groups = computed(() => userStore.groups);
const fromDateMenu = ref(false);
const toDateMenu = ref(false);
const filters = ref({
    startTime: moment().startOf('day').toDate(),
    endTime: moment().add(1, 'day').startOf('day').toDate(),
    group_nickname: null,
    player_name: null,
});

const getRecords = async () => {
    loading.value = true;
    try {
        const res = await GET_ZC_DETAILS_INQUIRY(filters.value.startTime, filters.value.endTime, filters.value.group_nickname, filters.value.player_name, page.value, perPage.value);
        records.value = res.data.list.map((record, index) => ({
            ...record,
            index: (page.value - 1) * perPage.value + index + 1,
        }));
        total.value = res.data.total;
    } catch (error) {
        console.error('Error fetching records:', error);
        toast.error('获取记录失败，请稍后再试');
    } finally {
        loading.value = false;
    }
};

const exportTable = async () => {
    isExporting.value = true;
    try {
        const res = await GET_ZC_DETAILS_INQUIRY(filters.value.startTime, filters.value.endTime, filters.value.group_nickname, filters.value.player_name, 1, total.value || 10000);
        if (res.code == 200) {
            const data = res.data.list.map(item => ({
                '序列': item.index,
                '台号': item.group_nickname,
                '日期': item.stat_date,
                '昵称': item.nickname,
                '闲庄/龙虎占成洗码': item.zxzcxm,
                '闲庄/龙虎占成赢亏': item.zxyl,
                '三宝占成洗码': item.xml_sb,
                '三宝占成赢亏': item.sb_yl
            }));
            exportExcel(data, `个人占成明细-${formattedDate(new Date())}`);
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