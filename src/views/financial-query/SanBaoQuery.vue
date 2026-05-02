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
                                prepend-inner-icon="mdi-clock-outline"
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
                                prepend-inner-icon="mdi-clock-outline"
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
            <template #item.shoe_round="{ item }">
                <span>{{ item.cc }} - {{ item.jc }}</span>
            </template>
            <template #item.kj="{ item }">
                <span>{{ checkResult(item.kj) }}</span>
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useUserStore } from '../../stores/user';
import { GET_SANBAO_DETAILS_QUERY } from '../../js/api/financial_inquiries';
import { formattedDate, exportExcel, checkResult } from '../../js/common';
import { useToast } from 'vue-toastification';

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
    { title: '日期', value: 'stat_date', fixed: 'start', width: 120 },
    { title: '台号', value: 'group_nickname', fixed: 'start', minWidth: 120 },
    { title: '靴局', value: 'shoe_round', minWidth: 120 },
    { title: '闲对(虎单)', value: 'xd', minWidth: 120 },
    { title: '庄对(龙单)', value: 'zd', minWidth: 120 },
    { title: '和', value: 'h', minWidth: 80 },
    { title: '幸运6(龙双)', value: 'l', minWidth: 120 },
    { title: '完美(虎双)', value: 'm', minWidth: 120 },
    { title: '任意(对)', value: 'd', minWidth: 120 },
    { title: '开奖结果', value: 'kj', minWidth: 150 },
    { title: '闲对(虎单)输赢', value: 'xd_yl', minWidth: 140 },
    { title: '庄对(龙单)输赢', value: 'zd_yl', minWidth: 140 },
    { title: '和输赢', value: 'h_yl', minWidth: 80 },
    { title: '幸运6(龙双)输赢', value: 'l_yl', minWidth: 140 },
    { title: '完美(虎双)输赢', value: 'm_yl', minWidth: 140 },
    { title: '任意(对)输赢', value: 'd_yl', minWidth: 140 },
    { title: '本局输赢', value: 'yl', minWidth: 120 },
    // { title: '备注', value: 'remark', minWidth: 150 }
]);
const isExporting = ref(false);
const groups = computed(() => userStore.groups);
const fromDateMenu = ref(false);
const toDateMenu = ref(false);
const filters = ref({
    startTime: null,
    endTime: null,
    group_nickname: null
});

const getRecords = async () => {
    loading.value = true;
    try {
        const res = await GET_SANBAO_DETAILS_QUERY(
            filters.value.startTime,
            filters.value.endTime,
            filters.value.group_nickname,
            page.value,
            perPage.value
        );

        if (res.code == 200) {
            records.value = res.data.list.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.total;
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}

const exportTable = async () => {
    isExporting.value = true;
    try {
        const res = await GET_SANBAO_DETAILS_QUERY(
            filters.value.startTime,
            filters.value.endTime,
            filters.value.group_nickname,
            1,
            total.value || 10000
        );

        if (res.code == 200) {
            const data = res.data.list.map(item => ({
                '序列': item.index,
                '日期': item.stat_date,
                '台号': item.group_nickname,
                '靴局': `${item.cc} - ${item.jc}`,
                '闲对(虎单)': item.xd,
                '庄对(龙单)': item.zd,
                '和': item.h,
                '幸运6(龙双)': item.l,
                '完美(虎双)': item.m,
                '任意(对)': item.d,
                '开奖结果': item.kj,
                '闲对(虎单)输赢': item.xd_yl,
                '庄对(龙单)输赢': item.zd_yl,
                '和输赢': item.h_yl,
                '幸运6(龙双)输赢': item.l_yl,
                '完美(虎双)输赢': item.m_yl,
                '任意(对)输赢': item.d_yl,
                '本局输赢': item.yl
            }));
            exportExcel(data, `三宝查询-${formattedDate(new Date())}`);
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