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
                <v-col>
                    <v-autocomplete
                        v-model="filters.player_name"
                        v-model:search="searchPlayer"
                        :items="players"
                        label="选手昵称"
                        density="compact"
                        item-title="playername"
                        item-value="playername"
                        variant="outlined"
                        hide-details
                        class="ml-1"
                        color="primary"
                        clearable
                        @click:clear="filters.player_name = null"
                        autocomplete="off"
                    >
                        <template #item="{ props, item }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="2" class="d-flex">
                    <div class="w-50 pr-1">
                        <v-text-field
                            v-model="filters.shoe"
                            label="靴号"
                            variant="outlined"
                            density="compact"
                            hide-details
                            clearable
                            @click:clear="filters.shoe = null"
                        />
                    </div>
                    <div class="w-50 pl-1">
                        <v-text-field 
                            v-model="filters.round"
                            label="局号"
                            variant="outlined"
                            density="compact"
                            hide-details
                            clearable
                            @click:clear="filters.round = null"
                        />
                    </div>
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
                                @click:clear="filters.end_date = null; filters.end_time = null;"
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
                    <v-checkbox v-model="filters.is_contains_virtual" color="primary" label="是否包含虚拟" hide-details density="compact"></v-checkbox>
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
             <template #body.append>
                <tr class="font-weight-bold bg-grey-lighten-2">
                    <td colspan="4">合计</td>
                    <td>{{ summary.total_xml_zx }}</td>
                    <td>{{ summary.total_xml_sb }}</td>
                    <td>{{ summary.total_zx_yl }}</td> 
                    <td>{{ summary.total_sb_yl }}</td> 
                    <td>{{ summary.total_yxxz }}</td> 
                    <td></td>
                </tr>
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useUserStore } from '../../stores/user';
import { GET_PLAYER_DETAILS_QUERY} from '../../js/api/financial_inquiries';
import { formattedDate, exportExcel } from '../../js/common';
import { useToast } from 'vue-toastification';
import moment from 'moment';
import { PLAYER_FUZZY_QUERY } from '../../js/api/player_option';

const toast = useToast();
const userStore = useUserStore();
const records = ref([]);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const loading = ref(false);
const pageSizeOptions = computed(() => userStore.tablePageSize);

const filters = ref({
    player_name: null,
    shoe: null,
    round: null,
    start_date: moment().startOf('day').toDate(),
    start_time: '00:00:00',
    end_date: moment().startOf('day').toDate(),
    end_time: '23:59:59',
    is_contains_virtual: true,
    group_nickname: null
});

const allHeaders = ref([
    { title: '序列', value: 'index', fixed: 'start', width: 80 },
    { title: '选手', value: 'username', fixed: 'start', width: 120 },
    { title: '代理号', value: 'reference_name', fixed: 'start', minWidth: 120 },
    { title: '日期', value: 'stat_date', minWidth: 120},
    { title: '庄闲洗码总分', value: 'xml_zx', minWidth: 120 },
    { title: '三宝+幸运6+对子洗码总分', value: 'xml_sb', minWidth: 200 },
    { title: '庄闲赢亏总分', value: 'zx_yl', minWidth: 120 },
    { title: '三宝+幸运6+对子总分', value: 'sb_yl', minWidth: 200 },
    { title: '有效流水总分', value: 'yxxz', minWidth: 120 },
    { title: '日积分总分', value: 'daily_points', minWidth: 110 },
    // { title: 'DayAddUpEffectiveMoney', value: 'g_m', minWidth: 100 },
    // { title: 'AllAddUpEffectiveMoney', value: 'g_xd', minWidth: 80 }
]);
const headers = computed(() => {
    // hide username and reference_name columns filters'player_name is empty, otherwise show them
    if (!filters.value.player_name) {
        allHeaders.value.find(header => header.value === 'username').hidden = true;
        allHeaders.value.find(header => header.value === 'reference_name').hidden = true;
    } else {
        allHeaders.value.find(header => header.value === 'username').hidden = false;
        allHeaders.value.find(header => header.value === 'reference_name').hidden = false;
    }
    return allHeaders.value.filter(header => !header.hidden);
});
const isExporting = ref(false);
const groups = computed(() => userStore.groups);
const fromDateMenu = ref(false);
const toDateMenu = ref(false);
const players = ref([]);
const searchPlayer = ref('');

const summary = ref({
    total_sb_yl: 0,
    total_xml_sb: 0,
    total_xml_zx: 0,
    total_yxxz: 0,
    total_zx_yl: 0
})

const getRecords = async () => {
    loading.value = true;
    try {
        const { player_name, shoe, round, start_date, start_time, end_date, end_time, is_contains_virtual, group_nickname } = filters.value;
        const res = await GET_PLAYER_DETAILS_QUERY(
            player_name, 
            shoe, 
            round, 
            start_date && start_time ? moment(start_date).format('YYYY-MM-DD') + ' ' + start_time : null,
            end_date && end_time ? moment(end_date).format('YYYY-MM-DD') + ' ' + end_time : null,
            is_contains_virtual, 
            group_nickname, 
            page.value, 
            perPage.value
        );
        if (res.code == 200) {
            records.value = res.data.list.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.total;
            summary.value = res.data.summary
        }
    } catch (error) {
        console.error('Error fetching records:', error);
        toast.error('获取记录失败，请稍后再试');
    } finally {
        loading.value = false;
    }
}

const exportTable = async () => {
    isExporting.value = true;
    try {
        const { name, shoe, round, start_date, start_time, end_date, end_time, is_contains_virtual, group_nickname } = filters.value;
        const res = await GET_PLAYER_DETAILS_QUERY(
            name, 
            shoe, 
            round, 
            start_date && start_time ? moment(start_date).format('YYYY-MM-DD') + ' ' + start_time : null,
            end_date && end_time ? moment(end_date).format('YYYY-MM-DD') + ' ' + end_time : null,
            is_contains_virtual, 
            group_nickname, 
            1, 
            total.value || 10000
        );
        if (res.code == 200) {
            const data = res.data.list.map(item => ({
                '序列': item.index,
                '选手': item.username,
                '代理号': item.reference_name,
                '庄闲洗码总分': item.xml_zx,
                '三宝+幸运6+对子洗码总分': item.xml_sb,
                '庄闲赢亏总分': item.zx_yl,
                '三宝+幸运6+对子总分': item.sb_yl,
                '有效流水总分': item.yxxz,
                '日积分总分': item.daily_points
            }));
            exportExcel(data, `选手洗码盈亏-${formattedDate(new Date())}`);
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