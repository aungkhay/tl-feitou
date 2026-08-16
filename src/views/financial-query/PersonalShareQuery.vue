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
                            <v-btn color="primary" @click="searchData" block><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                        </div>
                        <div class="w-50 pl-1">
                            <v-btn color="success" block @click="exportTable" :loading="isExporting"><v-icon>mdi-file-excel</v-icon> 导出报表</v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>

        <v-data-table-server
            ref="tableRef"
            v-model:page="page"
            v-model:items-per-page="perPage"
            :headers="headers"
            :items="records"
            :items-length="total"
            :loading="loading"
            density="compact"
            class="table1"
            hide-default-footer
            :items-per-page-options="pageSizeOptions"
            hover
            fixed-header
            :height="`calc(100vh - 200px)`"
        >
            <!-- <template #loading>
                <v-skeleton-loader type="table-row@8"/>
            </template> -->
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
                    <td>{{ summary.xd_xz }}</td>
                    <td>{{ summary.h_xz }}</td>
                    <td>{{ summary.l_xz }}</td>
                    <td>{{ summary.k_xz }}</td>
                    <td>{{ summary.m_xz }}</td>
                    <td>{{ summary.q_xz }}</td>
                    <td>{{ summary.zd_yl }}</td>
                </tr>
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useUserStore } from '../../stores/user';
import { GET_ZC_DETAILS_INQUIRY } from '../../js/api/financial_inquiries';
import { formattedDate, exportExcel, isReachBottom } from '../../js/common';
import { useToast } from 'vue-toastification';
import moment from 'moment';
import { PLAYER_FUZZY_QUERY } from '../../js/api/player_option';

const toast = useToast();
const userStore = useUserStore();
const isVirtualPlayer = computed(() => userStore.isVirtualPlayer);
const records = ref([]);
const total = ref(0);
const page = ref(1);
const perPage = ref(50);
const loading = ref(false);
const tableRef = ref(null);
const scrollEl = ref(null);
const noMoreData = computed(() => {
    return total.value > 0 && records.value.length >= total.value
})
const pageSizeOptions = computed(() => userStore.tablePageSize);
const headers = ref([
    // { title: '序列', value: 'index', fixed: 'start', width: 60 },
    { title: '台号', value: 'group_nickname', fixed: 'start', minWidth: 120 },
    { title: '日期', value: 'stat_date', minWidth: 120 },
    { title: '昵称', value: 'userName', minWidth: 100 },
    { title: '庄闲占成洗码', value: 'zxzcxm', minWidth: 150 },
    { title: '庄闲盈利', value: 'zxyl', minWidth: 150 },
    { title: '三宝洗码', value: 'xml_sb', minWidth: 150 },
    { title: '闲对下注', value: 'xd_xz', minWidth: 150 },
    { title: '和下注', value: 'h_xz', minWidth: 150 },
    { title: '小老虎下注', value: 'l_xz', minWidth: 150 },
    { title: '大老虎下注', value: 'k_xz', minWidth: 150 },
    { title: '完美下注', value: 'm_xz', minWidth: 150 },
    { title: '幸运7下注', value: 'q_xz', minWidth: 150 },
    { title: '庄对盈利', value: 'zd_yl', minWidth: 150 },
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
    zxzcxm: 0,
    xd_xz: 0,
    h_xz: 0,
    l_xz: 0,
    k_xz: 0,
    m_xz: 0,
    q_xz: 0,
    zd_yl: 0,
});

const searchPlayer = ref(null);
const players = ref([]);

const searchData = () => {
    records.value = [];
    total.value = 0;
    page.value = 1;
    getRecords();
};

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
        if (res.code == 200) {
            const resData = res.data.list.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            if (page.value === 1) {
                records.value = resData;
            } else {
                records.value = [...records.value, ...resData];
            }
            total.value = res.data.total;
            summary.value = res.data.summary;
        }
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
                '昵称': item.userName,
                '庄闲占成洗码': item.zxzcxm,
                '庄闲赢亏': item.zxyl,
                '三宝洗码': item.xml_sb,
                '闲对下注': item.xd_xz,
                '和下注': item.h_xz,
                '小老虎下注': item.l_xz,
                '大老虎下注': item.k_xz,
                '完美下注': item.m_xz,
                '幸运7下注': item.q_xz,
                '庄对盈利': item.zd_yl
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

const onTableScroll = async (e) => {
    const isBottom = isReachBottom(e)
    if (!isBottom) return
    if (loading.value || noMoreData.value) return

    if (loading.value) {
        return
    }
    page.value += 1
    await getRecords()
}

const bindTableBodyScroll = () => {
    unbindTableBodyScroll()

    const rootEl = tableRef.value?.$el
    if (!rootEl) return

    scrollEl.value = rootEl.querySelector('.v-table__wrapper')
    if (!scrollEl.value) return

    scrollEl.value.addEventListener('scroll', onTableScroll, { passive: true })
}

const unbindTableBodyScroll = () => {
    if (scrollEl.value) {
        scrollEl.value.removeEventListener('scroll', onTableScroll)
        scrollEl.value = null
    }
}

onMounted(async () => {
    getRecords();
    await nextTick()
    bindTableBodyScroll()
})

onBeforeUnmount(() => {
    unbindTableBodyScroll()
})
</script>