<template>
    <div class="pa-4">

        <div class="text-h5 font-weight-bold">上下分</div>

        <div class="d-flex align-center justify-space-between mt-3">
            <div>
                <v-btn color="primary"><v-icon>mdi-arrow-up</v-icon> 上分</v-btn>
                <v-btn color="primary" class="mx-2"><v-icon>mdi-arrow-down</v-icon> 下分</v-btn>
                <v-btn color="primary"><v-icon>mdi-arrow-collapse-down</v-icon> 积分全下</v-btn>
            </div>
            <div>
                <v-btn color="error" class="mr-2"><v-icon>mdi-undo</v-icon> 撤销上下分</v-btn>
                <v-btn color="error"><v-icon>mdi-bank</v-icon> 获取银行卡</v-btn>
            </div>
        </div>

        <v-data-table-server
            v-model:items-per-page="itemsPerPage1"
            :headers="headers1"
            :items="records1"
            :items-length="totalItems1"
            :loading="loading1"
            density="compact"
            class="mt-2 table1"
            @update:options="getRecords1"
            hover
        >
            <template #loading>
                <v-skeleton-loader type="table-row@3"/>
            </template>
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
        </v-data-table-server>
        <v-card elevation="0" class="border px-2 pt-3 pb-2 rounded mt-10">
            <v-row dense>
                <v-col cols="12" md="5" class="d-flex align-center">
                    <v-select
                        v-model="filters.group_nickname"
                        :items="[]"
                        label="群昵称"
                        density="compact"
                        item-title="name"
                        item-value="Id"
                        variant="outlined"
                        hide-details
                        class="mr-1"
                    ></v-select>
                    <v-text-field
                        v-model="filters.optioner"
                        label="操作人"
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="mx-1"
                        clearable
                    ></v-text-field>
                    <v-select
                        v-model="filters.player_name"
                        :items="[]"
                        label="选手昵称"
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="ml-1"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="d-flex align-center">
                    <v-select
                        v-model="filters.option_type"
                        :items="scoreOptionType"
                        label="选择操作类型"
                        density="compact"
                        item-title="name"
                        item-value="name"
                        variant="outlined"
                        hide-details
                        class="mr-1"
                    ></v-select>
                    <v-select
                        v-model="filters.is_virtual"
                        :items="[{Id: 0, name: '不包括虚拟'}, {Id: 1, name: '包括虚拟'}]"
                        label="是否包括虚拟"
                        density="compact"
                        item-title="name"
                        item-value="Id"
                        variant="outlined"
                        hide-details
                        class="ml-1"
                    ></v-select>
                </v-col>
                <v-col cols="12" md="3" class="d-flex align-center">
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
                                :model-value="formattedFilterDate(filters.start_time)"
                                hide-details
                                clearable
                                @click:clear="filters.start_time = null"
                                class="mr-1"
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="filters.start_time"
                            @update:model-value="startDateMenu = false"
                        />
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
                                :model-value="formattedFilterDate(filters.end_time)"
                                hide-details
                                clearable
                                @click:clear="filters.end_time = null"
                                class="ml-1"
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="filters.end_time"
                            @update:model-value="endDateMenu = false"
                        />
                    </v-menu>
                </v-col>
                <v-col cols="12" md="1">
                    <v-btn color="primary" block @click="getRecords2"><v-icon>mdi-magnify</v-icon> 搜索</v-btn>
                </v-col>
            </v-row>
        </v-card>
        <v-data-table-server
            v-model:items-per-page="itemsPerPage2"
            :headers="headers2"
            :items="records2"
            :items-length="totalItems2"
            :loading="loading2"
            density="compact"
            class="mt-2 table2"
            fixed-header
            hover
            @update:options="getRecords2"
        >
            <template #loading>
                <v-skeleton-loader type="table-row@3"/>
            </template>
            <template #item.working_date="{ item }">
                {{ $filters.formatDate(item.working_date) }}
            </template>
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { GET_PLAYER_DETAIL, GET_SCORE_OPTION_RECORD, GET_SCORE_OPTION_TYPE } from '../../js/api/player_option';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();
const scoreOptionType = computed(() => userStore.operation_type);
const filters = ref({
    group_nickname: '彭涛',
    option_type: '',
    optioner: '',
    start_time: new Date(),
    end_time: new Date(),
    player_name: '',
    is_virtual: 1,
})
const startDateMenu = ref(false);
const endDateMenu = ref(false);
const records1 = ref([]);
const headers1 = ref([
    { title: '序列', key: 'index', sortable: false, fixed: 'start', width: 60 },
    { title: '台号', key: 'group_nickname', sortable: false, fixed: 'start', width: 100 },
    { title: '会员昵称', key: 'playername', sortable: false, fixed: 'start', minWidth: 100 },
    { title: '剩余积分', key: 'score', sortable: false, minWidth: 90 },
    { title: '冻结积分', key: 'freeze_score', sortable: false, minWidth: 90 },
    { title: '初始积分', key: 'raw_score', sortable: false, minWidth: 90 },
    { title: '庄闲洗码', key: 'total_xml_zx', sortable: false, minWidth: 90 },
    { title: '三宝洗码', key: 'total_xml_sb', sortable: false, minWidth: 90 },
    { title: '庄闲赢亏', key: 'total_xzyl', sortable: false, minWidth: 90 },
    { title: '三宝赢亏', key: 'total_sbyl', sortable: false, minWidth: 90 },
    { title: '有效流水', key: 'total_yxxz', sortable: false, minWidth: 90 },
    { title: '代理商', key: 'reference_name', sortable: false, minWidth: 90 },
    { title: '日积分', key: 'daily_points', sortable: false, minWidth: 90 },
    { title: '总积分', key: 'total_points', sortable: false, minWidth: 90 },
    { title: '注册时间', key: 'registTime', sortable: false, minWidth: 170 },
    { title: '存款', key: 'deposit', sortable: false, minWidth: 90 },
    { title: '欠积分', key: 'owe_points', sortable: false, minWidth: 90 },
    { title: '状态', key: 'is_hide', sortable: false, minWidth: 70 },
    { title: '操作时间', key: 'option_time', sortable: false, minWidth: 170 },
])
const itemsPerPage1 = ref(10);
const totalItems1 = ref(0);
const isReady1 = ref(false);
const loading1 = ref(false);

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
]);
const itemsPerPage2 = ref(10);
const totalItems2 = ref(0);
const loading2 = ref(false);
const isReady2 = ref(false);

const formattedFilterDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('zh-CN')
}

const getRecords1 = async () => {
    if (!isReady1.value) return;
    loading1.value = true;
    try {
        const res = await GET_PLAYER_DETAIL(filters.value.group_nickname);
        if (res.code == 200) {
            records1.value = res.data.map((item, index) => ({ ...item, index: index + 1 }));
            totalItems1.value = res.data.length;
        }
    } finally {
        loading1.value = false;
    }
}

const getRecords2 = async () => {
    if (!isReady2.value) return;
    loading2.value = true;
    try {
        const res = await GET_SCORE_OPTION_RECORD(
            filters.value.group_nickname,
            filters.value.option_type,
            filters.value.optioner,
            filters.value.start_time,
            filters.value.end_time,
            filters.value.player_name,
            filters.value.is_virtual
        );
        if (res.code == 200) {
            records2.value = res.data.map((item, index) => ({ ...item, index: index + 1 }));
            totalItems2.value = res.data.length;
        }
    } finally {
        loading2.value = false;
    }
}

onMounted(async () => {
    const res = await GET_SCORE_OPTION_TYPE('彭涛');
    if (res.code == 200) {
        if (res.data.length > 0) {
            filters.value.option_type = res.data[0].name;
            isReady1.value = true;
            isReady2.value = true;
        }
        getRecords1();
        getRecords2();
    }
});
</script>