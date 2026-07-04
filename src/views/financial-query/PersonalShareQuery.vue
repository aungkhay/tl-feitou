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
                    <v-autocomplete
                        v-model="filters.player_name"
                        v-model:search="searchPlayer"
                        :items="players"
                        item-title="playername"
                        item-value="playername"
                        label="选手昵称"
                        variant="outlined"
                        hide-details
                        color="primary"
                        density="compact"
                        autocomplete="off"
                        clearable
                        @click:clear="filters.player_name = null"
                    >
                        <template #item="{ props, item }">
                            <v-list-item v-bind="props" density="compact" title="" subtitle="">
                                <v-list-item-title :class="{'text-error': isVirtualPlayer(item.raw.playername)}">{{ item.raw.playername }}</v-list-item-title>
                            </v-list-item>
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
            <template #item.nickname="{ item }">
                <span :class="{ 'text-error font-weight-bold': isVirtualPlayer(item.nickname) }">{{ item.nickname }}</span>
            </template>
            <template #item.stat_date="{ item }">
                {{ $filters.formatDate(item.stat_date) }}
            </template>
            <template #body.append>
                <tr class="font-weight-bold bg-grey-lighten-2">
                    <td colspan="3">合计</td>
                    <td>{{ summary.zxzcxm }}</td>
                    <td>{{ summary.zxyl }}</td>
                    <td>{{ summary.xml_sb }}</td>
                    <td>{{ summary.sb_yl }}</td>
                </tr>
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useUserStore } from '../../stores/user';
import { GET_ZC_DETAILS_INQUIRY } from '../../js/api/financial_inquiries';
import { formattedDate, exportExcel } from '../../js/common';
import { useToast } from 'vue-toastification';
import moment from 'moment';
import { PLAYER_FUZZY_QUERY } from '../../js/api/player_option';

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
    // { title: '序列', value: 'index', fixed: 'start', width: 60 },
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
    start_date: moment().startOf('day').toDate(),
    start_time: '00:00:00',
    end_date: moment().startOf('day').toDate(),
    end_time: '23:59:59',
    group_nickname: null,
    player_name: null,
});
const summary = ref({
    sb_yl: 0,
    xml_sb: 0,
    zxyl: 0,
    zxzcxm: 0
});

const searchPlayer = ref(null);
const players = ref([]);

const getRecords = async () => {
    loading.value = true;
    try {
        const res = await GET_ZC_DETAILS_INQUIRY(
            filters.value.start_date && filters.value.start_time ? moment(filters.value.start_date).format('YYYY-MM-DD') + ' ' + filters.value.start_time : null,
            filters.value.end_date && filters.value.end_time ? moment(filters.value.end_date).format('YYYY-MM-DD') + ' ' + filters.value.end_time : null,
            filters.value.group_nickname, 
            filters.value.player_name, 
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
        toast.error('获取记录失败，请稍后再试');
    } finally {
        loading.value = false;
    }
};

const exportTable = async () => {
    isExporting.value = true;
    try {
        const res = await GET_ZC_DETAILS_INQUIRY(
            filters.value.start_date && filters.value.start_time ? moment(filters.value.start_date).format('YYYY-MM-DD') + ' ' + filters.value.start_time : null,
            filters.value.end_date && filters.value.end_time ? moment(filters.value.end_date).format('YYYY-MM-DD') + ' ' + filters.value.end_time : null,
            filters.value.group_nickname, 
            filters.value.player_name, 
            1, 
            total.value || 10000
        );
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

const fuzzyPlayer = async () => {
    if (!searchPlayer.value) {
        return;
    }
    const res = await PLAYER_FUZZY_QUERY(searchPlayer.value);
    if (res && res.code == 200) {
        players.value = res.data.list;
    }
}

watch(
    () => searchPlayer.value,
    (newVal) => {
        if (newVal) {
            fuzzyPlayer();
        } else {
            players.value = [];
        }
    }
)
</script>