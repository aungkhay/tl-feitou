<template>
    <div class="px-2 py-3">

        <div class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row dense>
                <v-col cols="12" sm="3" class="d-flex">
                    <div class="w-50 pr-1">
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
                    </div>
                    <div class="w-50 pl-1">
                        <v-select
                            v-model="filters.option_type"
                            :items="['兑换', '清零']"
                            item-title="label"
                            item-value="value"
                            label="选择操作类型"
                            density="compact"
                            variant="outlined"
                            hide-details
                        >
                            <template #item="{ props }">
                                <v-list-item v-bind="props" density="compact" />
                            </template>                    
                        </v-select>
                    </div>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-autocomplete
                        v-model="filters.player_name"
                        v-model:search="filterPlayer"
                        :items="filterPlayers"
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
                </v-col>
                <v-col cols="12" sm="2">
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
                <v-col cols="12" sm="3" class="d-flex">
                    <div class="w-50 pr-1">
                        <v-checkbox v-model="filters.is_virtual" color="primary" label="是否包含虚拟" hide-details density="compact"></v-checkbox>
                    </div>
                    <div class="w-50 pl-1">
                        <v-btn color="primary" @click="getRecords" block><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>

        <div class="d-flex flex-wrap">
            <v-btn size="small" color="primary" class="mr-2 mb-2" @click="allGroupDialog = true">单个玩家兑换(所有群)</v-btn>
            <v-btn size="small" color="primary" class="mr-2 mb-2" @click="singleGroupDialog = true">一键兑换(一个群玩家)</v-btn>
            <v-btn size="small" color="primary" class="mr-2 mb-2" @click="allGroupExchangeDialog = true">一键兑换(所有群玩家)</v-btn>
            <v-btn size="small" color="error" class="mr-2 mb-2" @click="cancelExchangeDialog = true"><v-icon>mdi-undo</v-icon> 撤销兑换</v-btn>
            <v-btn size="small" color="primary" class="mr-2 mb-2" @click="clearPointDialog = true">清零</v-btn>
            <v-btn size="small" color="primary" class="mr-2 mb-2" @click="clearVirtualPlayerDialog = true">虚拟选手整台清零</v-btn>
            <v-btn size="small" color="success" class="mb-2" :loading="isExporting" @click="exportTable"><v-icon>mdi-file-excel</v-icon> 导出报表</v-btn>
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
            <template #item.player_name="{ item }">
                <span :class="{ 'text-error font-weight-bold': isVirtualPlayer(item.player_name) }">{{ item.player_name }}</span>
            </template>
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
            <template #item.exchange_date="{ item }">
                {{ $filters.formatDate(item.exchange_date) }}
            </template>
             <template #body.append>
                <tr>
                    <td colspan="11" class="py-2">
                        <span class="mr-5">总积分数量: {{ summary.total_points_change }}</span>
                        <span>返水金额: {{ summary.total_score_change }}</span>
                    </td>
                </tr>
             </template>
        </v-data-table-server>

        <v-dialog
            v-model="allGroupDialog"
            max-width="350"
            persistent
        >
            <v-card>
                <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                    <div>单个玩家兑换(所有群)</div>
                    <v-btn icon="mdi-close" @click="resetForm" variant="text" density="compact"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-autocomplete
                        v-model="obj.player_name"
                        v-model:search="searchPlayer"
                        :items="players"
                        item-title="playername"
                        item-value="playername"
                        label="玩家昵称"
                        variant="outlined"
                        color="primary"
                        autocomplete="off"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>
                    </v-autocomplete>

                    <div class="d-flex justify-center">
                        <v-btn color="primary" :disabled="isSaving || !obj.player_name" :loading="isSaving" @click="singlePlayerAllGroupExchange">确认</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        
        <v-dialog
            v-model="singleGroupDialog"
            max-width="350"
            persistent
        >
            <v-card>
                <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                    <div>一键兑换(一个群玩家)</div>
                    <v-btn icon="mdi-close" @click="resetForm" variant="text" density="compact"></v-btn>
                </v-card-title>
                <v-card-text>
                     <v-select
                        v-model="obj.group_nickname"
                        :items="groups"
                        item-title="group_nickname"
                        item-value="group_nickname"
                        label="选择操作台"
                        variant="outlined"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>                    
                    </v-select>

                    <div class="d-flex justify-center">
                        <v-btn color="primary" :disabled="isSaving || !obj.group_nickname" :loading="isSaving" @click="singleGroupExchange">确认</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="allGroupExchangeDialog"
            max-width="400"
            persistent
        >
            <v-card title="一键兑换(所有群玩家)">
                <v-card-text>
                    <div class="mb-4">确定要一键兑换所有群玩家吗？</div>
                    <div class="d-flex justify-end">
                        <v-btn variant="tonal" color="primary" class="mr-2" :disabled="isSaving" @click="resetForm">取消</v-btn>
                        <v-btn variant="tonal" color="error" :loading="isSaving" @click="allGroupExchange">确定</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="cancelExchangeDialog"
            max-width="400"
            persistent
        >
            <v-card title="撤销兑换">
                <v-card-text>
                    <div class="mb-4">确定要撤销兑换吗？</div>
                    <div class="d-flex justify-end">
                        <v-btn variant="tonal" color="primary" class="mr-2" :disabled="isSaving" @click="resetForm">取消</v-btn>
                        <v-btn variant="tonal" color="error" :loading="isSaving" @click="cancelExchange">确定</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="clearPointDialog"
            max-width="350"
            persistent
        >
            <v-card>
                <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                    <div>清零</div>
                    <v-btn icon="mdi-close" @click="resetForm" variant="text" density="compact"></v-btn>
                </v-card-title>
                <v-card-text>
                     <v-select
                        v-model="obj.group_nickname"
                        :items="groups"
                        item-title="group_nickname"
                        item-value="group_nickname"
                        label="选择操作台"
                        variant="outlined"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>                    
                    </v-select>

                    <v-autocomplete
                        v-model="obj.player_name"
                        v-model:search="searchPlayer"
                        :items="players"
                        item-title="playername"
                        item-value="playername"
                        label="玩家昵称"
                        variant="outlined"
                        color="primary"
                        autocomplete="off"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>
                    </v-autocomplete>

                    <div class="d-flex justify-center">
                        <v-btn color="primary" :disabled="isSaving || !obj.group_nickname || !obj.player_name" :loading="isSaving" @click="pointsClear">确认</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="clearVirtualPlayerDialog"
            max-width="350"
            persistent
        >
            <v-card>
                <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                    <div>虚拟选手整台清零</div>
                    <v-btn icon="mdi-close" @click="resetForm" variant="text" density="compact"></v-btn>
                </v-card-title>
                <v-card-text>
                     <v-select
                        v-model="obj.group_nickname"
                        :items="groups"
                        item-title="group_nickname"
                        item-value="group_nickname"
                        label="选择操作台"
                        variant="outlined"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>                    
                    </v-select>

                    <div class="d-flex justify-center">
                        <v-btn color="primary" :disabled="isSaving || !obj.group_nickname" :loading="isSaving" @click="virtualPlayerPointsClear">确认</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../../stores/user';
import { GET_POINTS_EXCHANGE_INFO, SINGLE_PLAYER_ALL_GROUP_EXCHANGE, SINGLE_GROUP_EXCHANGE, ALL_GROUP_EXCHANGE, CANCEL_EXCHANGE, POINTS_CLEAR, VIRTUAL_PLAYER_POINTS_CLEAR } from '../../js/api/point_exchange';
import { useToast } from 'vue-toastification';
import { exportExcel, formattedDate } from '../../js/common';
import moment from 'moment';
import { PLAYER_FUZZY_QUERY } from '../../js/api/player_option';

const toast = useToast();

const allGroupDialog = ref(false);
const singleGroupDialog = ref(false);
const allGroupExchangeDialog = ref(false);
const cancelExchangeDialog = ref(false);
const clearPointDialog = ref(false);
const clearVirtualPlayerDialog = ref(false);
const isSaving = ref(false);
const isExporting = ref(false);

const userStore = useUserStore();
const isVirtualPlayer = computed(() => userStore.isVirtualPlayer);
const page = ref(1);
const perPage = ref(15);
const total = ref(0);
const records = ref([]);
const loading = ref(false);
const headers = ref([
    // { title: '序列', value: 'index', fixed: 'start', width: 60 },
    { title: '台号', value: 'group_nickname', fixed: 'start', minWidth: 100 },
    { title: '会员昵称', value: 'player_name', minWidth: 150 },
    { title: '兑换积分/庄闲洗码/返水', value: 'option_type', minWidth: 200 },
    { title: '兑换比例', value: 'personal_points_redemption_ratio', minWidth: 150 },
    { title: '积分数量', value: 'redeem_points', minWidth: 150 },
    { title: '操作时间', value: 'option_time', minWidth: 180 },
    { title: '备注', value: 'memo', minWidth: 200 },
    { title: '兑换/返水类型', value: 'exchange_type', minWidth: 150 },
    { title: '返水金额', value: 'rebate_amount', minWidth: 150 },
    { title: '庄闲洗码/返水兑换日期', value: 'exchange_date', minWidth: 180 },
    { title: '操作员', value: 'operator', minWidth: 120 },
]);
const pageSizeOptions = computed(() => userStore.tablePageSize);
const groups = computed(() => userStore.groups);
const startDateMenu = ref(false);
const endDateMenu = ref(false);
const filters = ref({
    group_nickname: null,
    start_date: moment().startOf('day').format('YYYY-MM-DD'),
    start_time: '00:00:00',
    end_date: moment().startOf('day').format('YYYY-MM-DD'),
    end_time: '23:59:59',
    player_name: null,
    option_type: '兑换',
    is_virtual: 0
})
const summary = ref({
    total_points_change: 0,
    total_score_change: 0
})

const obj = ref({
    player_name: null,
    group_nickname: null,
})

const filterPlayer = ref('');
const filterPlayers = ref([]);
const searchPlayer = ref('');
const players = ref([]);

const resetForm = () => {
    obj.value.player_name = null;
    obj.value.group_nickname = null;
    allGroupDialog.value = false;
    singleGroupDialog.value = false;
    allGroupExchangeDialog.value = false;
    cancelExchangeDialog.value = false;
    clearPointDialog.value = false;
    clearVirtualPlayerDialog.value = false;
}

const getRecords = async () => {
    loading.value = true;
    try {
        const res = await GET_POINTS_EXCHANGE_INFO(
            filters.value.group_nickname,
            filters.value.start_date && filters.value.start_time ? moment(filters.value.start_date).format('YYYY-MM-DD') + ' ' + filters.value.start_time : null,
            filters.value.end_date && filters.value.end_time ? moment(filters.value.end_date).format('YYYY-MM-DD') + ' ' + filters.value.end_time : null,
            filters.value.player_name,
            filters.value.option_type,
            filters.value.is_virtual,
            page.value,
            perPage.value
        );
        if (res.code == 200) {
            records.value = res.data.list.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.total;
            summary.value = res.data.summary || { total_points_change: 0, total_score_change: 0 };
        }
    } catch (error) {
        console.error('查询失败:', error);
    } finally {
        loading.value = false;
    }
}

const singlePlayerAllGroupExchange = async () => {
    if (obj.value.player_name.trim() === '') {
        return;
    }
    isSaving.value = true;
    try {
        const res = await SINGLE_PLAYER_ALL_GROUP_EXCHANGE(obj.value.player_name);
        if (res.code == 200) {
            resetForm();
            getRecords();
            toast.success(res.msg || '兑换成功');
        } else {
            toast.error(res.msg || '兑换失败');
        }
    } catch (error) {
        toast.error('兑换失败');
    } finally {
        isSaving.value = false;
    }
}

const singleGroupExchange = async () => {
    if (obj.value.group_nickname.trim() === '') {
        return;
    }
    isSaving.value = true;
    try {
        const res = await SINGLE_GROUP_EXCHANGE(obj.value.group_nickname);
        if (res.code == 200) {
            resetForm();
            getRecords();
            toast.success(res.msg || '兑换成功');
        } else {
            toast.error(res.msg || '兑换失败');
        }
    } catch (error) {
        toast.error('兑换失败');
    } finally {
        isSaving.value = false;
    }
}

const allGroupExchange = async () => {
    isSaving.value = true;
    try {
        const res = await ALL_GROUP_EXCHANGE();
        if (res.code == 200) {
            resetForm();
            getRecords();
            toast.success(res.msg || '兑换成功');
        } else {
            toast.error(res.msg || '兑换失败');
        }
    } catch (error) {
        toast.error('兑换失败');
    } finally {
        isSaving.value = false;
    }
}

const cancelExchange = async () => {
    isSaving.value = true;
    try {
        const res = await CANCEL_EXCHANGE();
        if (res.code == 200) {
            resetForm();
            getRecords();
            toast.success(res.msg || '撤销成功');
        } else {
            toast.error(res.msg || '撤销失败');
        }
    } catch (error) {
        toast.error('撤销失败');
    } finally {
        isSaving.value = false;
    }
}

const pointsClear = async () => {
    if (obj.value.group_nickname.trim() === '' || obj.value.player_name.trim() === '') {
        return;
    }
    isSaving.value = true;
    try {
        const res = await POINTS_CLEAR(obj.value.group_nickname, obj.value.player_name);
        if (res.code == 200) {
            resetForm();
            getRecords();
            toast.success(res.msg || '清零成功');
        } else {
            toast.error(res.msg || '清零失败');
        }
    } catch (error) {
        toast.error('清零失败');
    } finally {
        isSaving.value = false;
    }
}

const virtualPlayerPointsClear = async () => {
    if (obj.value.group_nickname.trim() === '') {
        return;
    }
    isSaving.value = true;
    try {
        const res = await VIRTUAL_PLAYER_POINTS_CLEAR(obj.value.group_nickname);
        if (res.code == 200) {
            resetForm();
            getRecords();
            toast.success(res.msg || '清零成功');
        } else {
            toast.error(res.msg || '清零失败');
        }
    } catch (error) {
        toast.error('清零失败');
    } finally {
        isSaving.value = false;
    }
}

const exportTable = async () => {
    isExporting.value = true;
    try {
        const res = await GET_POINTS_EXCHANGE_INFO(
            filters.value.group_nickname,
            filters.value.start_date && filters.value.start_time ? moment(filters.value.start_date).format('YYYY-MM-DD') + ' ' + filters.value.start_time : null,
            filters.value.end_date && filters.value.end_time ? moment(filters.value.end_date).format('YYYY-MM-DD') + ' ' + filters.value.end_time : null,
            filters.value.player_name,
            filters.value.option_type,
            filters.value.is_virtual,
            1,
            total.value
        );
        if (res.code == 200) {
            const data = res.data.list.map(item => ({
                    '台号': item.group_nickname,
                    '会员昵称': item.player_name,
                    '兑换积分/庄闲洗码/返水': item.option_type,
                    '兑换比例': item.personal_points_redemption_ratio,
                    '积分数量': item.redeem_points,
                    '操作时间': formattedDate(item.option_time),
                    '备注': item.memo || '-',
                    '兑换/返水类型': item.exchange_type || '-',
                    '返水金额': item.rebate_amount || '-',
                    '庄闲洗码/返水兑换日期': item.exchange_date ? formattedDate(item.exchange_date) : '-',
                    '操作员': item.operator || '-'
                })
            );
            exportExcel(data, `兑换积分-${formattedDate(new Date())}`);
        } else {
            toast.error(res.msg || '获取数据失败，无法导出表格');
        }
    } catch (error) {
        toast.error('导出失败');
    } finally {
        isExporting.value = false;
    }
}

const fuzzyFilterPlayer = async () => {
    if (!filterPlayer.value) {
        return;
    }
    const res = await PLAYER_FUZZY_QUERY(filterPlayer.value);
    if (res && res.code == 200) {
        filterPlayers.value = res.data.list;
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
    () => filterPlayer.value,
    (newVal) => {
        if (newVal) {
            fuzzyFilterPlayer();
        } else {
            filterPlayers.value = [];
        }
    }
)

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