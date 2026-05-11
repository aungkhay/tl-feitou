<template>
    <div class="px-2 py-3">
        <div class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row>
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
                        autocomplete="off"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>                    
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-text-field
                        v-model="filters.shoe"
                        label="靴号"
                        variant="outlined"
                        density="compact"
                        hide-details
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-menu
                        v-model="dateMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                    >
                        <template #activator="{ props }">
                            <v-text-field
                                v-bind="props"
                                label="日期"
                                variant="outlined"
                                density="compact"
                                readonly
                                :model-value="formattedDate(filters.date, filters.time)"
                                hide-details
                            ></v-text-field>
                        </template>

                        <div class="bg-blue-lighten-4">
                            <div class="d-flex">
                                <v-date-picker v-model="filters.date" color="primary" bg-color="blue-lighten-4"/>
                                <v-time-picker v-model="filters.time" use-seconds format="24hr" color="primary" bg-color="blue-lighten-4"/>
                            </div>
                            <div class="d-flex justify-end mb-2 mr-2">
                                <v-btn text color="primary" variant="tonal" @click="dateMenu = false">确定</v-btn>
                            </div>
                        </div>
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-checkbox v-model="filters.is_virtual" color="primary" label="是否包含虚拟" hide-details density="compact"></v-checkbox>
                </v-col>
                <v-col cols="12" sm="2">
                    <div class="d-flex">
                        <div class="w-50 pr-1">
                            <v-btn color="primary" @click="getRecords" block><v-icon>mdi-magnify</v-icon> 按天查询靴</v-btn>
                        </div>
                        <div class="w-50 pl-1">
                            <v-btn color="success" @click="exportTable" :loading="isExporting" block><v-icon>mdi-file-excel</v-icon> 导出报表</v-btn>
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
            <template #item.cc="{ item }">
                <span>{{ item.cc + '-' + item.jc }}</span>
            </template>
            <template #item.stime="{ item }">
                {{ $filters.formatFullDate(item.stime) }}
            </template>
            <template #item.kj="{ item }">
                <span>{{ checkResult(item.kj) }}</span>
            </template>
            <template #body.append>
                <tr class="font-weight-bold bg-grey-lighten-2">
                    <td colspan="3" style="position: sticky; left: 0; background-color: #d4d4d4; z-index: 1;">合计: {{ summary.total_count }}</td>
                    <td>{{ summary.total_x }}</td>
                    <td>{{ summary.total_z }}</td>
                    <td>{{ summary.total_xd }}</td>
                    <td>{{ summary.total_zd }}</td>
                    <td>{{ summary.total_l }}</td>
                    <td>{{ summary.total_m }}</td>
                    <td>{{ summary.total_g_m }}</td>
                    <td>{{ summary.total_g_x }}</td>
                    <td>{{ summary.total_g_z }}</td>
                    <td>{{ summary.total_g_xd }}</td>
                    <td>{{ summary.total_g_zd }}</td>
                    <td>{{ summary.total_g_h }}</td>
                    <td>{{ summary.total_d }}</td>
                    <td>{{ summary.total_g_d }}</td>
                    <td>{{ summary.total_zxdc }}</td>
                    <td>{{ summary.total_g_l }}</td>
                    <td>{{ summary.total_tzx }}</td>
                    <td>{{ summary.total_tsbl }}</td>
                    <td>{{ summary.total_lt }}</td>
                    <td>{{ summary.total_sp }}</td>
                    <td>{{ summary.total_spm }}</td>
                    <td colspan="2"></td>
                    <td>{{ summary.total_zyk }}</td>
                    <td>{{ summary.total_xzyk }}</td>
                    <td>{{ summary.total_gyk }}</td>
                    <td>{{ summary.total_dcyk }}</td>
                    <td>{{ summary.total_xztyk }}</td>
                    <td>{{ summary.total_sbltyk }}</td>
                    <td>{{ summary.total_sblspyk }}</td>
                    <td>{{ summary.total_xzspyk }}</td>
                    <td>{{ summary.total_ltyk }}</td>
                    <td>{{ summary.total_spzsyk }}</td>
                </tr>
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formattedDate, exportExcel, checkResult } from '../../js/common';
import { useUserStore } from '../../stores/user';
import { GET_ROUND_DETAILS } from '../../js/api/financial_inquiries';
import { useToast } from 'vue-toastification';
import moment from 'moment';

const toast = useToast();
const userStore = useUserStore();
const records = ref([]);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const loading = ref(false);
const pageSizeOptions = computed(() => userStore.tablePageSize);
const headers = ref([
    { title: '序列', value: 'index', fixed: 'start', width: 60 },
    { title: '台号', value: 'group_nickname', fixed: 'start', width: 120 },
    { title: '局', value: 'cc', fixed: 'start', minWidth: 80 },
    { title: '闲', value: 'x', minWidth: 80 },
    { title: '庄', value: 'z', minWidth: 80 },
    { title: '闲对', value: 'xd', minWidth: 80 },
    { title: '庄对', value: 'zd', minWidth: 80 },
    { title: '幸运6', value: 'l', minWidth: 80 },
    { title: '完美', value: 'm', minWidth: 80 },
    { title: '个人完美', value: 'g_m', minWidth: 100 },
    { title: '个闲', value: 'g_x', minWidth: 80 },
    { title: '个庄', value: 'g_z', minWidth: 80 },
    { title: '个闲对', value: 'g_xd', minWidth: 80 },
    { title: '个庄对', value: 'g_zd', minWidth: 80 },
    { title: '个和', value: 'g_h', minWidth: 80 },
    { title: '任意', value: 'd', minWidth: 80 },
    { title: '个人任意', value: 'g_d', minWidth: 100 },
    { title: '庄闲对冲', value: 'zxdc', minWidth: 100 },
    { title: '个人幸运6', value: 'g_l', minWidth: 110 },
    { title: '台庄闲', value: 'tzx', minWidth: 80 },
    { title: '台三宝+幸运6', value: 'tsbl', minWidth: 150 },
    { title: '零头', value: 'lt', minWidth: 80 },
    { title: '上盘', value: 'sp', minWidth: 80 },
    { title: '上盘买', value: 'spm', minWidth: 80 },
    { title: '结果', value: 'kj', minWidth: 80 },
    { title: '开奖时间', value: 'stime', minWidth: 170 },
    { title: '总赢亏', value: 'zyk', minWidth: 80 },
    { title: '庄闲赢亏', value: 'xzyk', minWidth: 100 },
    { title: '个赢亏', value: 'gyk', minWidth: 80 },
    { title: '对冲赢亏', value: 'dcyk', minWidth: 100 },
    { title: '闲庄台赢亏', value: 'xztyk', minWidth: 150 },
    { title: '三宝+幸运6台赢亏', value: 'sbltyk', minWidth: 200 },
    { title: '三宝+幸运6上盘赢亏', value: 'sblspyk', minWidth: 200 },
    { title: '闲庄上盘赢亏', value: 'xzspyk', minWidth: 150 },
    { title: '零头赢亏', value: 'ltyk', minWidth: 100 },
    // { title: '飞牌金额', value: 'fly_card_amount', minWidth: 100 },
    // { title: '飞牌闲庄', value: 'fly_card_banker_player', minWidth: 100 },
    // { title: '飞牌输赢', value: 'fly_card_win_loss', minWidth: 100 },
    { title: '上盘抽水赢亏', value: 'spzsyk', minWidth: 120 },
]);
const summary = ref({
    total_count: 0,
    total_z: 0,
    total_h: 0,
    total_x: 0,
    total_zd: 0,
    total_xd: 0,
    total_l: 0,
    total_m: 0,
    total_d: 0,
    total_g_z: 0,
    total_g_x: 0,
    total_g_zd: 0,
    total_g_xd: 0,
    total_g_h: 0,
    total_g_m: 0,
    total_g_l: 0,
    total_zxdc: 0,
    total_tzx: 0,
    total_tsbl: 0,
    total_lt: 0,
    total_sp: 0,
    total_spm: 0,
    total_zyk: 0,
    total_xzyk: 0,
    total_gyk: 0,
    total_dcyk: 0,
    total_xztyk: 0,
    total_sbltyk: 0,
    total_sblspyk: 0,
    total_xzspyk: 0,
    total_ltyk: 0,
    total_spzsyk: 0
})

const isExporting = ref(false);
const groups = computed(() => userStore.groups);
const dateMenu = ref(false);
const filters = ref({
    shoe: 1,
    date: new Date(),
    time: '00:00:00',
    is_virtual: true,
    group_nickname: null,
});

const getRecords = async () => {
    loading.value = true;
    try {
        const res = await GET_ROUND_DETAILS(
            filters.value.shoe,
            filters.value.date && filters.value.time ? moment(filters.value.date).format('YYYY-MM-DD') + ' ' + filters.value.time : null,
            filters.value.is_virtual,
            filters.value.group_nickname,
            page.value,
            perPage.value
        );
        if (res.code === 200) {
            records.value = res.data.list.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.count;
        }
    } catch (error) {
        console.error('获取记录失败:', error);
        toast.error('获取记录失败，请稍后再试');
    } finally {
        loading.value = false;
    }
}

const exportTable = async () => {
    isExporting.value = true;
    try {
        const res = await GET_ROUND_DETAILS(
            filters.value.shoe,
            filters.value.date && filters.value.time ? moment(filters.value.date).format('YYYY-MM-DD') + ' ' + filters.value.time : null,
            filters.value.is_virtual,
            filters.value.group_nickname,
            1,
            total.value || 10000
        );
        if (res.code === 200) {
            const data = res.data.list.map(item => ({
                '台号': item.group_nickname,
                '靴号': item.shoe,
                '局数': item.cc,
                '闲': item.x,
                '庄': item.z,
                '闲对': item.xd,
                '庄对': item.zd,
                '幸运6': item.l,
                '完美': item.m,
                '个人完美': item.g_m,
                '个闲': item.g_x,
                '个庄': item.g_z,
                '个闲对': item.g_xd,
                '个庄对': item.g_zd,
                '个和': item.g_h,
                '任意': item.d,
                '个人任意': item.g_d,
                '庄闲对冲': item.zxdc,
                '个人幸运6': item.g_l,
                '台庄闲': item.tzx,
                '台三宝+幸运6': item.tsbl,
                '零头': item.lt,
                '上盘': item.sp,
                '上盘买': item.spm,
                '结果': item.kj,
                '开奖时间': formattedDate(item.stime),
                '总赢亏': item.zyk,
                '庄闲赢亏': item.xzyk,
                '个赢亏': item.gyk,
                '对冲赢亏': item.dcyk,
                '闲庄台赢亏': item.xztyk,
                '三宝+幸运6台赢亏': item.sbltyk,
                '三宝+幸运6上盘赢亏': item.sblspyk,
                '闲庄上盘赢亏': item.xzspyk,
                '零头赢亏': item.ltyk,
                // '飞牌金额': item.fly_card_amount,
                // '飞牌闲庄': item.fly_card_banker_player,
                // '飞牌输赢': item.fly_card_win_loss,
                '上盘抽水赢亏': item.spzsyk,
             }));
            exportExcel(data, `局查询明细-${filters.value.group_nickname}-靴号${filters.value.shoe}-${formattedDate(new Date())}`);
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

watch(() => groups.value, (newGroups) => {
    if (newGroups.length > 0 && !filters.value.group_nickname) {
        filters.value.group_nickname = newGroups[0].group_nickname;
    }
}, { immediate: true });
</script>