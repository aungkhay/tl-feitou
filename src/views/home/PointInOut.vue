<template>
    <div class="px-2 py-3">

        <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
                <div class="d-flex align-center" style="width: 200px;">
                    <v-autocomplete
                        v-model="filters.group_nickname"
                        :items="groups"
                        label="群昵称"
                        density="compact"
                        item-title="group_nickname"
                        item-value="group_nickname"
                        variant="outlined"
                        color="primary"
                        hide-details
                        class="mr-2"
                        autocomplete="off"
                        clearable
                        @click:clear="filters.group_nickname = null; currentPage1 = 1; getRecords1();"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>
                    </v-autocomplete>
                </div>
                <v-btn color="primary" @click="addSubstractPointDialog = true; addOrSubstract = 'add'"><v-icon>mdi-arrow-up</v-icon> 上分</v-btn>
                <v-btn color="primary" class="mx-2" @click="addSubstractPointDialog = true; addOrSubstract = 'substract'"><v-icon>mdi-arrow-down</v-icon> 下分</v-btn>
                <v-btn color="primary" @click="substractAllPointDialog = true"><v-icon>mdi-arrow-collapse-down</v-icon> 积分全下</v-btn>
            </div>
            <div>
                <v-btn color="success" :disabled="isExportingTable1" :loading="isExportingTable1" @click="exportTable1()"><v-icon>mdi-file-excel</v-icon> 导出表格1</v-btn>
                <v-btn color="success" class="ml-2" :disabled="isExportingTable2" :loading="isExportingTable2" @click="exportTable2()"><v-icon>mdi-file-excel</v-icon> 导出表格2</v-btn>
            </div>
        </div>

        <v-data-table-server
            ref="table1Ref"
            v-model:page="currentPage1"
            v-model:items-per-page="itemsPerPage1"
            :headers="headers1"
            :items="records1"
            :items-length="totalItems1"
            :loading="loading1"
            density="compact"
            class="mt-2 table1"
            :items-per-page-options="pageSizeOptions"
            hover
            fixed-header
            hide-default-footer
            height="300"
        >
            <!-- <template #loading>
                <v-skeleton-loader type="table-row@3"/>
            </template> -->
            <template #item.registTime="{ item }">
                {{ $filters.formatFullDate(item.registTime) }}
            </template>
            <template #item.is_hide="{ item }">
                <span v-if="item.is_hide" class="text-red">隐藏</span>
                <span v-else class="text-green">显示</span>
            </template>
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
            <template #body.append>
                <tr v-if="noMoreData1">
                    <td :colspan="headers1.length" class="text-center py-2">没有更多数据</td>
                </tr>
            </template>
        </v-data-table-server>
        
        <v-card elevation="0" class="border px-2 pt-3 pb-2 rounded mt-10">
            <v-row dense>
                <v-col cols="12" md="3" class="d-flex align-center">
                    <div class="w-50">
                        <v-text-field
                            v-model="filters.optioner"
                            label="操作人"
                            density="compact"
                            variant="outlined"
                            hide-details
                            class="mx-1"
                            clearable
                            @click:clear="filters.optioner = null"
                        ></v-text-field>
                    </div>
                    <div class="w-50">
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
                                <v-list-item v-bind="props" density="compact">
                                    <template #append>
                                        <span class="text-caption" :class="item.raw.is_hide ? 'text-red' : 'text-green'">
                                            {{ item.raw.is_hide ? '隐藏' : '显示' }}
                                        </span>
                                    </template>
                                </v-list-item>
                            </template>
                        </v-autocomplete>
                    </div>
                </v-col>
                <v-col cols="12" md="3" class="d-flex align-center">
                    <v-select
                        v-model="filters.option_type"
                        :items="options"
                        label="选择操作类型"
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="mr-1"
                        color="primary"
                        clearable
                        @click:clear="filters.option_type = null"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>
                    </v-select>
                    <v-checkbox v-model="filters.is_virtual" color="primary" class="w-50" label="是否包括虚拟" hide-details density="compact"></v-checkbox>
                </v-col>
                <v-col cols="12" md="4" class="d-flex align-center">
                    <v-menu
                        v-model="startDateMenu"
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
                                @click:clear="filters.start_date = null; filters.start_time = null;"
                                class="mr-1"
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
                                <v-btn text color="primary" variant="tonal" @click="startDateMenu = false">确定</v-btn>
                            </div>
                        </div>
                    </v-menu>
                    <v-menu
                        v-model="endDateMenu"
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
                                class="ml-1"
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
                                <v-btn text color="primary" variant="tonal" @click="endDateMenu = false">确定</v-btn>
                            </div>
                        </div>
                    </v-menu>
                </v-col>
                <v-col cols="12" md="2">
                    <v-btn color="primary" block @click="getRecords2"><v-icon>mdi-magnify</v-icon> 搜索</v-btn>
                </v-col>
            </v-row>
        </v-card>
        
        <v-data-table-server
            ref="table2Ref"
            v-model:page="currentPage2"
            v-model:items-per-page="itemsPerPage2"
            :headers="headers2"
            :items="records2"
            :items-length="totalItems2"
            :loading="loading2"
            density="compact"
            class="mt-2 table2"
            fixed-header
            hover
            :items-per-page-options="pageSizeOptions"
            hide-default-footer
            height="300"
        >
            <!-- <template #loading>
                <v-skeleton-loader type="table-row@3"/>
            </template> -->
            <template #item.working_date="{ item }">
                {{ $filters.formatDate(item.working_date) }}
            </template>
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
            <template #item.demo="{ item }">
                {{ item.demo ? item.demo : '-' }}
            </template>
            <template #item.actions="{ item }">
                <v-btn :disabled="!$filters.check10MinuteAgo(item.option_time)" size="small" color="error" variant="tonal" @click="cancelAddSubstract(item)"><v-icon>mdi-undo</v-icon> 撤销</v-btn>
            </template>
            <template #body.append>
                <tr v-if="noMoreData2">
                    <td :colspan="headers2.length" class="text-center py-2">没有更多数据</td>
                </tr>
            </template>
        </v-data-table-server>

        <v-dialog
            v-model="cancelAddSubstractDialog"
            max-width="400px"
            persistent
        >
            <v-card title="撤销操作">
                <v-card-text>
                    <v-table density="compact" class="bg-grey-lighten-2 rounded-lg">
                        <tbody>
                            <tr>
                                <td>台号：</td>
                                <td>{{ selectedRecord2?.group_nickname }}</td>
                            </tr>
                            <tr>
                                <td>会员昵称:</td>
                                <td>{{ selectedRecord2?.playername }}</td>
                            </tr>
                            <tr>
                                <td>操作类型:</td>
                                <td>{{ selectedRecord2?.option_type }}</td>
                            </tr>
                            <tr>
                                <td>操作金额:</td>
                                <td>{{ selectedRecord2?.score }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                    <div class="mt-2">您确定要撤销这条操作记录吗？</div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="取消" variant="tonal" :disabled="isCanceling" @click="cancelAddSubstractDialog = false" color="red"></v-btn>
                    <v-btn text="确定" variant="tonal" :disabled="isCanceling" :loading="isCanceling" @click="confirmCancelAddSubstract()" color="primary"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <AddSubstractPoint v-model="addSubstractPointDialog" :mode="addOrSubstract" :bank-cards="bankCards" :groups="groups" @complete="completeAddSubstract" />
        <SubstractAllPoint v-model="substractAllPointDialog" :bank-cards="bankCards" :groups="groups" @complete="completeAddSubstract" />
    </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch, getCurrentInstance, nextTick } from 'vue';
import { GET_GROUP_NICKNAME, GET_GROUP_PLAYERS, GET_PLAYER_DETAIL, GET_SCORE_OPTION_RECORD, GET_SCORE_OPTION_TYPE, UNDO_OPTION_SCORE, GET_BANKCARD, PLAYER_FUZZY_QUERY } from '../../js/api/player_option';
import { useUserStore } from '../../stores/user';
import AddSubstractPoint from '../../components/home/AddSubstractPoint.vue';
import SubstractAllPoint from '../../components/home/SubstractAllPoint.vue';
import { useToast } from "vue-toastification";
import { exportExcel } from '../../js/common';
import moment from 'moment';
import { formattedDate, isReachBottom } from '../../js/common';

const { proxy } = getCurrentInstance();
const userStore = useUserStore();
const toast = useToast();
const bankCards = ref([]);
const pageSizeOptions = computed(() => userStore.tablePageSize);
const scoreOptionType = computed(() => userStore.operation_type);
const options = computed(() => userStore.option1);
const groups = computed(() => userStore.groups);
const players = ref([]);
const searchPlayer = ref('');
const filters = ref({
    group_nickname: null,
    option_type: null,
    optioner: null,
    start_date: moment().startOf('day').format('YYYY-MM-DD'),
    start_time: '00:00:00',
    end_date: moment().startOf('day').format('YYYY-MM-DD'),
    end_time: '23:59:59',
    player_name: null,
    is_virtual: 1,
})
const startDateMenu = ref(false);
const endDateMenu = ref(false);
const records1 = ref([]);
const headers1 = ref([
    { title: '序列', key: 'index', sortable: false, fixed: 'start', width: 60 },
    { title: '台号', key: 'group_nickname', sortable: false, fixed: 'start', width: 100 },
    { title: '会员昵称', key: 'playername', sortable: false, fixed: 'start', minWidth: 100 },
    { title: '剩余积分', key: 'score', sortable: false, minWidth: 70 },
    { title: '冻结积分', key: 'freeze_score', sortable: false, minWidth: 70 },
    { title: '初始积分', key: 'raw_score', sortable: false, minWidth: 70 },
    { title: '庄闲洗码', key: 'total_xml_zx', sortable: false, minWidth: 70 },
    { title: '三宝洗码', key: 'total_xml_sb', sortable: false, minWidth: 70 },
    { title: '庄闲赢亏', key: 'total_xzyl', sortable: false, minWidth: 70 },
    { title: '三宝赢亏', key: 'total_sbyl', sortable: false, minWidth: 70 },
    { title: '有效流水', key: 'total_yxxz', sortable: false, minWidth: 70 },
    { title: '代理商', key: 'reference_name', sortable: false, minWidth: 90 },
    { title: '日积分', key: 'daily_points', sortable: false, minWidth: 70 },
    { title: '总积分', key: 'total_points', sortable: false, minWidth: 70 },
    { title: '注册时间', key: 'registTime', sortable: false, minWidth: 170 },
    { title: '存款', key: 'deposit', sortable: false, minWidth: 70 },
    { title: '欠积分', key: 'owe_points', sortable: false, minWidth: 70 },
    { title: '状态', key: 'is_hide', sortable: false, minWidth: 70 },
    { title: '操作时间', key: 'option_time', sortable: false, minWidth: 170 },
])
const currentPage1 = ref(1);
const itemsPerPage1 = ref(10);
const totalItems1 = ref(0);
const isReady1 = ref(false);
const loading1 = ref(false);
const loadingMore1 = ref(false)

const records2 = ref([]);
const headers2 = ref([
    { title: '序列', key: 'index', sortable: false, fixed: 'start', width: 60 },
    { title: '台号', key: 'group_nickname', sortable: false, fixed: 'start', width: 100 },
    { title: '会员昵称', key: 'playername', sortable: false, fixed: 'start', minWidth: 100 },
    { title: '操作金额', key: 'score', sortable: false, minWidth: 100 },
    { title: '操作前金额', key: 'before_option_score', sortable: false, minWidth: 110 },
    { title: '操作类型', key: 'option_type', sortable: false, minWidth: 100 },
    { title: '工作日', key: 'working_date', sortable: false, minWidth: 140 },
    { title: '操作时间', key: 'option_time', sortable: false, minWidth: 170 },
    { title: '操作员', key: 'optioner', sortable: false, minWidth: 100 },
    { title: '操作说明', key: 'demo', sortable: false, minWidth: 100 },
    { title: '银行卡', key: 'bank_card', sortable: false, minWidth: 100 },
    { title: '操作', key: 'actions', sortable: false, fixed: 'end', minWidth: 100 },
]);
const currentPage2 = ref(1);
const itemsPerPage2 = ref(10);
const totalItems2 = ref(0);
const loading2 = ref(false);
const isReady2 = ref(false);
const selectedRecord2 = ref(null);
const cancelAddSubstractDialog = ref(false);
const isCanceling = ref(false);

const addSubstractPointDialog = ref(false);
const addOrSubstract = ref('add');
const substractAllPointDialog = ref(false);
const isExportingTable1 = ref(false);
const isExportingTable2 = ref(false);

let scrollEl1 = null
let scrollEl2 = null
const table1Ref = ref(null)
const table2Ref = ref(null)
const noMoreData1 = computed(() => {
    return totalItems1.value > 0 && records1.value.length >= totalItems1.value
})
const noMoreData2 = computed(() => {
    return totalItems2.value > 0 && records2.value.length >= totalItems2.value
})

const onTable1Scroll = async (e) => {
    const isBottom = isReachBottom(e)
    if (!isBottom) return
    if (loading1.value || loadingMore1.value || noMoreData1.value) return

    if (loading1.value) {
        return
    }
    currentPage1.value += 1
    await getRecords1()
}

const bindTable1BodyScroll = () => {
    unbindTable1BodyScroll()

    const rootEl = table1Ref.value?.$el
    if (!rootEl) return

    scrollEl1 = rootEl.querySelector('.v-table__wrapper')
    if (!scrollEl1) return

    scrollEl1.addEventListener('scroll', onTable1Scroll, { passive: true })
}

const unbindTable1BodyScroll = () => {
    if (scrollEl1) {
        scrollEl1.removeEventListener('scroll', onTable1Scroll)
        scrollEl1 = null
    }
}

const onTable2Scroll = async (e) => {
    const isBottom = isReachBottom(e)
    if (!isBottom) return
    if (loading2.value || noMoreData2.value) return

    if (loading2.value) {
        return
    }
    currentPage2.value += 1
    await getRecords2()
}

const bindTable2BodyScroll = () => {
    unbindTable2BodyScroll()

    const rootEl = table2Ref.value?.$el
    if (!rootEl) return

    scrollEl2 = rootEl.querySelector('.v-table__wrapper')
    if (!scrollEl2) return

    scrollEl2.addEventListener('scroll', onTable2Scroll, { passive: true })
}

const unbindTable2BodyScroll = () => {
    if (scrollEl2) {
        scrollEl2.removeEventListener('scroll', onTable2Scroll)
        scrollEl2 = null
    }
}

const getRecords1 = async () => {
    // if (!isReady1.value) return;
    loading1.value = true;
    try {
        const res = await GET_PLAYER_DETAIL(filters.value.group_nickname, itemsPerPage1.value, currentPage1.value);
        if (res.code == 200) {
            if (currentPage1.value === 1) {
                records1.value = [];
                records1.value = res.data.list.map((item, index) => ({ ...item, index: index + 1 }));
            } else {
                const newList = res.data.list.map((item, index) => ({ ...item, index: (currentPage1.value - 1) * itemsPerPage1.value + index + 1 }));
                records1.value = [...records1.value, ...newList];
            }
            totalItems1.value = res.data.total;
        }
    } finally {
        loading1.value = false;
    }
}

const getRecords2 = async () => {
    // if (!isReady2.value) return;
    loading2.value = true;
    try {
        const res = await GET_SCORE_OPTION_RECORD(
            filters.value.group_nickname,
            filters.value.option_type,
            filters.value.optioner,
            filters.value.start_date && filters.value.start_time ? moment(filters.value.start_date).format('YYYY-MM-DD') + ' ' + filters.value.start_time : null,
            filters.value.end_date && filters.value.end_time ? moment(filters.value.end_date).format('YYYY-MM-DD') + ' ' + filters.value.end_time : null,
            filters.value.player_name,
            filters.value.is_virtual,
            currentPage2.value,
            itemsPerPage2.value,
        );
        if (res.code == 200) {
            if (currentPage2.value === 1) {
                records2.value = [];
                    records2.value = res.data.list.map((record, index) => ({
                    ...record,
                    index: (currentPage2.value - 1) * itemsPerPage2.value + index + 1,
                }));
            } else {
                const newList = res.data.list.map((record, index) => ({
                    ...record,
                    index: (currentPage2.value - 1) * itemsPerPage2.value + index + 1,
                }));
                records2.value = [...records2.value, ...newList];
            }
            
            totalItems2.value = res.data.total;
        }
    } finally {
        loading2.value = false;
    }
}

const completeAddSubstract = () => {
    getRecords1();
    getRecords2();
}

const getOptionType = async () => {
    const res = await GET_SCORE_OPTION_TYPE(filters.value.group_nickname);
    if (res.code == 200) {
        if (res.data.length > 0) {
            filters.value.option_type = res.data[0].name;
            isReady1.value = true;
            isReady2.value = true;
        }
    }
}

const getPlayers = async () => {
    const res = await GET_GROUP_PLAYERS(filters.value.group_nickname);
    if (res && res.code == 200) {
        players.value = res.data;
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

watch(groups, (newVal) => {
    if (newVal.length > 0) {
        // filters.value.group_nickname = newVal[0].group_nickname;
        userStore.setGroupNickname(newVal[0].group_nickname);
    }
});

watch(() => filters.value.group_nickname, async (newVal) => {
    if (newVal) {
        userStore.setGroupNickname(newVal);
        filters.value.player_name = '';
        // getPlayers();
        // isReady1.value = true;
        // isReady2.value = true;
        getRecords1();
        // currentPage2.value = 1;
        // getRecords2();
    }
});

const cancelAddSubstract = (item) => {
    selectedRecord2.value = item;
    cancelAddSubstractDialog.value = true;
}

const confirmCancelAddSubstract = async () => {
    if (!selectedRecord2.value || isCanceling.value) return;
    cancelAddSubstractDialog.value = false;
    isCanceling.value = true;
    try {
        const res = await UNDO_OPTION_SCORE(selectedRecord2.value.Id, selectedRecord2.value.playername, selectedRecord2.value.group_nickname);
        if (res.code == 200) {
            toast.success(res.msg);
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
        toast.error('操作失败，请稍后再试');
    } finally {
        await getRecords2();
        isCanceling.value = false;
        cancelAddSubstractDialog.value = false;
    }
}

const exportTable1 = async () => {
    isExportingTable1.value = true;

    try {
        const res = await GET_PLAYER_DETAIL(filters.value.group_nickname, 1, totalItems1.value);
        if (res.code == 200) {
            const data = res.data.list.map(item => ({
                    '台号': item.group_nickname,
                    '会员昵称': item.playername,
                    '剩余积分': item.score,
                    '冻结积分': item.freeze_score,
                    '初始积分': item.raw_score,
                    '庄闲洗码': item.total_xml_zx,
                    '三宝洗码': item.total_xml_sb,
                    '庄闲赢亏': item.total_xzyl,
                    '三宝赢亏': item.total_sbyl,
                    '有效流水': item.total_yxxz,
                    '代理商': item.reference_name,
                    '日积分': item.daily_points,
                    '总积分': item.total_points,
                    '注册时间': proxy.$filters.formatFullDate(item.registTime),
                    '存款': item.deposit,
                    '欠积分': item.owe_points,
                    '状态': item.is_hide ? '隐藏' : '显示',
                    '操作时间': proxy.$filters.formatFullDate(item.option_time)
                })
            );
            exportExcel(data, `${filters.value.group_nickname}-上下分-表格1-${formattedDate(new Date())}`);
        } else {
            toast.error(res.msg || '获取数据失败，无法导出表格1');
        }
    } catch (error) {
        toast.error('获取操作类型失败，无法导出表格1');
        isExportingTable1.value = false;
        return;
    } finally {
        isExportingTable1.value = false;
    }
}

const exportTable2 = async () => {
    isExportingTable2.value = true;
    try {
        const res = await GET_SCORE_OPTION_RECORD(
            filters.value.group_nickname,
            filters.value.option_type,
            filters.value.optioner,
            filters.value.start_date && filters.value.start_time ? moment(filters.value.start_date).format('YYYY-MM-DD') + ' ' + filters.value.start_time : null,
            filters.value.end_date && filters.value.end_time ? moment(filters.value.end_date).format('YYYY-MM-DD') + ' ' + filters.value.end_time : null,
            filters.value.player_name,
            filters.value.is_virtual,
            1,
            totalItems2.value,
        );
        if (res.code == 200) {
            const data = res.data.record.map(item => ({
                    '台号': item.group_nickname,
                    '会员昵称': item.playername,
                    '操作金额': item.score,
                    '操作前金额': item.before_option_score,
                    '操作类型': item.option_type,
                    '工作日': proxy.$filters.formatDate(item.working_date),
                    '操作时间': proxy.$filters.formatFullDate(item.option_time),
                    '操作员': item.optioner,
                    '操作说明': item.demo ? item.demo : '-'
                })
            );
            exportExcel(data, `${filters.value.group_nickname}-上下分-表格2-${formattedDate(new Date())}`);
        } else {
            toast.error(res.msg || '获取数据失败，无法导出表格2');
            isExportingTable2.value = false;
            return;
        }
    } catch (error) {
        console.log(error);
        toast.error('获取数据失败，无法导出表格2');
        isExportingTable2.value = false;
        return; 
    } finally {
        isExportingTable2.value = false;
    }
}

const getBankCards = async () => {
    const res = await GET_BANKCARD();
    if (res && res.code == 200) {
        bankCards.value = res.data;
    }
}

watch(
    () => addSubstractPointDialog.value,
    (newVal) => {
        if (newVal == false) {
            getBankCards();
        }
    }
)

watch(
    () => substractAllPointDialog.value,
    (newVal) => {
        if (newVal == false) {
            getBankCards();
        }
    }
)

onMounted(async () => {
    await getBankCards();
    getRecords1()
    getRecords2()

    await nextTick()
    bindTable1BodyScroll()
    bindTable2BodyScroll()
})

onBeforeUnmount(() => {
    unbindTable1BodyScroll()
    unbindTable2BodyScroll()
})
</script>

<style scoped>
.table2 :deep(.v-data-table__thead th) {
    background-color: #d4d4d4 !important;
}
.table2 :deep(.v-data-table__thead th:first-child) {
    border-radius: 5px 0 0 0 !important;
}
.table2 :deep(.v-data-table__thead th:last-child) {
    border-radius: 0 5px 0 0 !important;
}
.table2 :deep(td:first-child) {
    border-left: 1px solid #e0e0e0;
}
.table2 :deep(td:last-child) {
    border-right: 1px solid #e0e0e0;
}
</style>