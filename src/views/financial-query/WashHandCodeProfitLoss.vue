<template>
    <div class="pa-4">
        <div class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row dense>
                <v-col cols="12" sm="2">
                    <v-select
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
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>                    
                    </v-select>
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
                    <v-checkbox v-model="filters.is_contains_virtual" color="primary" label="是否包含虚拟" hide-details density="compact"></v-checkbox>
                </v-col>
                <v-col cols="12" sm="2">
                    <div class="d-flex">
                        <div class="w-50 pr-1">
                            <v-btn color="primary" @click="getRecords" block><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                        </div>
                        <div class="w-50 pl-1">
                            <v-btn color="success" block><v-icon>mdi-file-excel</v-icon> 导出报表</v-btn>
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
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useUserStore } from '../../stores/user';
import { GET_PLAYER_DETAILS_QUERY } from '../../js/api/financial_inquiries';
import { formattedDate } from '../../js/common';

const userStore = useUserStore();
const records = ref([]);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const loading = ref(false);
const pageSizeOptions = computed(() => userStore.tablePageSize);
const headers = ref([
    { title: '序列', value: 'index', fixed: 'start', width: 60 },
    { title: '洗手', value: 'username', fixed: 'start', width: 60 },
    { title: '代理号', value: 'reference_name', fixed: 'start', minWidth: 120 },
    { title: '庄闲洗码总分', value: 'xml_zx', minWidth: 120 },
    { title: '三宝+幸运6+对子洗码总分', value: 'xml_sb', minWidth: 200 },
    { title: '庄闲赢亏总分', value: 'zx_yl', minWidth: 120 },
    { title: '三宝+幸运6+对子总分', value: 'sb_yl', minWidth: 200 },
    { title: '有效流水总分', value: 'yxxz', minWidth: 120 },
    { title: '日积分总分', value: 'daily_points', minWidth: 110 },
    // { title: 'DayAddUpEffectiveMoney', value: 'g_m', minWidth: 100 },
    // { title: 'AllAddUpEffectiveMoney', value: 'g_xd', minWidth: 80 }
]);

const groups = computed(() => userStore.groups);
const fromDateMenu = ref(false);
const toDateMenu = ref(false);
const filters = ref({
    name: '',
    shoe: null,
    round: null,
    startTime: null,
    endTime: null,
    is_contains_virtual: true,
    group_nickname: ''
});

const getRecords = async () => {
    loading.value = true;
    try {
        const { name, shoe, round, startTime, endTime, is_contains_virtual, group_nickname } = filters.value;
        const res = await GET_PLAYER_DETAILS_QUERY(name, shoe, round, startTime, endTime, is_contains_virtual, group_nickname, page.value, perPage.value);
        if (res.code == 200) {
            records.value = res.data.list.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.total;
        }
    } catch (error) {
        console.error('Error fetching records:', error);
    } finally {
        loading.value = false;
    }
}
</script>