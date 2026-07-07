<template>
    <div class="px-2 py-3">

        <div class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row dense>
                <v-col cols="12" sm="2">
                    <v-autocomplete
                        v-model="filters.agent_name"
                        v-model:search="searchPlayer"
                        :items="players"
                        label="代理名称"
                        density="compact"
                        item-title="playername"
                        item-value="playername"
                        variant="outlined"
                        hide-details
                        class="ml-1"
                        color="primary"
                        clearable
                        @click:clear="filters.agent_name = null"
                        autocomplete="off"
                    >
                        <template #item="{ props, item }">
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
                    <div class="d-flex">
                        <div class="w-50 pr-1">
                            <v-btn color="primary" @click="getMembers" block><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                        </div>
                        <div class="w-50 pl-1">
                            <v-btn color="success" block @click="exportTable" :loading="isExporting" :disabled="!members.length"><v-icon>mdi-file-excel</v-icon> 导出报表</v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>

        <v-data-table-server
            v-model:page="page"
            v-model:items-per-page="perPage"
            :headers="headers"
            :items="members"
            :items-length="total"
            :loading="loading"
            density="compact"
            class="table1"
            :items-per-page-options="pageSizeOptions"
            @update:options="getMembers"
            hover
        >
            <template #loading>
                <v-skeleton-loader type="table-row@3"/>
            </template>
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
            <template #body.append>
                <tr class="font-weight-bold bg-grey-lighten-2">
                    <td colspan="2">合计({{ summary.total_users }})</td>
                    <td>{{ summary.sum_yxxz }}</td>
                    <td>{{ summary.sum_zx_yl }}</td>
                    <td>{{ summary.sum_xml_sb }}</td>
                    <td>{{ summary.sum_sb_yl }}</td>
                    <td>{{ summary.sum_yxxz }}</td>
                    <td>{{ summary.sum_daily_points }}</td>
                    <td>{{ summary.sum_total_points }}</td>
                    <td></td>
                </tr>
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useToast } from 'vue-toastification';
import { useUserStore } from '../../stores/user';
import { GET_MEMBER_DETAILS } from '../../js/api/agent_business';
import moment from 'moment';
import { formattedDate, exportExcel } from '../../js/common';
import { PLAYER_FUZZY_QUERY } from '../../js/api/player_option';

const toast = useToast();
const userStore = useUserStore();
const pageSizeOptions = computed(() => userStore.tablePageSize);
const isExporting = ref(false);

const page = ref(1);
const perPage = ref(15);
const total = ref(0);
const members = ref([]);
const loading = ref(false);
const headers = [
    // { title: '序列', value: 'index', minWidth: 100 },
    { title: '代理', value: 'reference_name', minWidth: 150 },
    { title: '玩家昵称', value: 'username', minWidth: 150 },
    { title: '庄闲(龙虎)洗码', value: 'total_xml_zx', minWidth: 150 },
    { title: '庄闲(龙虎)赢亏', value: 'total_zx_yl', minWidth: 150 },
    { title: '四宝洗码', value: 'total_xml_sb', minWidth: 150 },
    { title: '四宝赢亏', value: 'total_sb_yl', minWidth: 150 },
    { title: '有效流水', value: 'total_yxxz', minWidth: 150 },
    { title: '日积分总分', value: 'daily_points', minWidth: 150 },
    { title: '总积分总分', value: 'total_points', minWidth: 150 },
    { title: '操作时间', value: 'option_time', minWidth: 180 },
];
const summary = ref({
    sum_daily_points: 0,
    sum_sb_yl: 0,
    sum_total_points: 0,
    sum_xml_sb: 0,
    sum_xml_zx: 0,
    sum_yxxz: 0,
    sum_zx_yl: 0,
    total_users: 0,
})

const fromDateMenu = ref(false);
const toDateMenu = ref(false);
const players = ref([]);
const searchPlayer = ref('');
const filters = ref({
    agent_name: null,
    start_date: moment().startOf('day').toDate(),
    start_time: '00:00:00',
    end_date: moment().startOf('day').toDate(),
    end_time: '23:59:59',
});

const getMembers = async () => {
    // if (!filters.value.agent_name) {
    //     return;
    // }

    loading.value = true;
    try {
        const { start_date, start_time, end_date, end_time } = filters.value;

        const res = await GET_MEMBER_DETAILS(
            filters.value.agent_name,
            start_date && start_time ? moment(start_date).format('YYYY-MM-DD') + ' ' + start_time : null,
            end_date && end_time ? moment(end_date).format('YYYY-MM-DD') + ' ' + end_time : null,
            page.value,
            perPage.value
        );
        if (res.code == 200) {
            members.value = res.data.list.map((member, index) => ({ ...member, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.total;
            summary.value = res.data.summary;
        } else {
            toast.error(res.msg || '获取成员详情失败');
        }
    } catch (error) {
        toast.error(error.message || '获取成员详情失败');
    } finally {
        loading.value = false;
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

const exportTable = async () => {
    isExporting.value = true;
    try {
        const { start_date, start_time, end_date, end_time } = filters.value;

        const res = await GET_MEMBER_DETAILS(
            filters.value.agent_name,
            start_date && start_time ? moment(start_date).format('YYYY-MM-DD') + ' ' + start_time : null,
            end_date && end_time ? moment(end_date).format('YYYY-MM-DD') + ' ' + end_time : null,
            1,
            total.value || 10000
        );
        if (res.code == 200) {
            const data = res.data.list.map(item => ({
                '序列': item.index,
                '代理': item.reference_name,
                '玩家昵称': item.username,
                '庄闲(龙虎)洗码': item.total_xml_zx,
                '庄闲(龙虎)赢亏': item.total_zx_yl,
                '四宝洗码': item.total_xml_sb,
                '四宝赢亏': item.total_sb_yl,
                '有效流水': item.valid_turnover,
                '日积分总分': item.daily_points,
                '总积分总分': item.total_points,
                '操作时间': item.option_time,
            }));
            exportExcel(data, `代理会员明细-${filters.value.agent_name}-${formattedDate(new Date())}`);
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