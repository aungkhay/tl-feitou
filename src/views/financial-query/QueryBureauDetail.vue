<template>
    <div class="pa-4">
        <div class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row>
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
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>                    
                    </v-select>
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
                                :model-value="formattedDate(filters.date)"
                                hide-details
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="filters.date"
                            @update:model-value="dateMenu = false"
                        />
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
                <span>{{ item.cc + '-' + item.jc }}</span>
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formattedDate } from '../../js/common';
import { useUserStore } from '../../stores/user';
import { GET_ROUND_DETAILS } from '../../js/api/financial_inquiries';

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
    { title: '台庄闲', value: 'table_banker_player', minWidth: 80 },
    { title: '台三宝+幸运6', value: 'table_three_treasures_lucky_6', minWidth: 150 },
    { title: '零头', value: 'lt', minWidth: 80 },
    { title: '上盘', value: 'sp', minWidth: 80 },
    { title: '上盘买', value: 'spm', minWidth: 80 },
    { title: '结果', value: 'kj', minWidth: 80 },
    { title: '开奖时间', value: 'option_time', minWidth: 170 },
    { title: '总赢亏', value: 'zyk', minWidth: 80 },
    { title: '庄闲赢亏', value: 'xzyk', minWidth: 100 },
    { title: '个赢亏', value: 'gyk', minWidth: 80 },
    { title: '对冲赢亏', value: 'dcyk', minWidth: 100 },
    { title: '闲庄台赢亏', value: 'banker_player_table_win_loss', minWidth: 150 },
    { title: '三宝+幸运6台赢亏', value: 'three_treasures_lucky_6_table_win_loss', minWidth: 200 },
    { title: '三宝+幸运6上盘赢亏', value: 'three_treasures_lucky_6_upper_plate_win_loss', minWidth: 200 },
    { title: '闲庄上盘赢亏', value: 'banker_player_upper_plate_win_loss', minWidth: 150 },
    { title: '零头赢亏', value: 'ltyk', minWidth: 100 },
    { title: '飞牌金额', value: 'fly_card_amount', minWidth: 100 },
    { title: '飞牌闲庄', value: 'fly_card_banker_player', minWidth: 100 },
    { title: '飞牌输赢', value: 'fly_card_win_loss', minWidth: 100 },
    { title: '上盘抽水赢亏', value: 'upper_plate_rake_win_loss', minWidth: 120 },
]);

const groups = computed(() => userStore.groups);
const dateMenu = ref(false);
const filters = ref({
    shoe: 1,
    date: new Date(),
    is_virtual: true,
    group_nickname: null,
});

const getRecords = async () => {
    loading.value = true;
    try {
        const res = await GET_ROUND_DETAILS(
            filters.value.shoe,
            filters.value.date,
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
        
    } finally {
        loading.value = false;
    }
}

watch(() => groups.value, (newGroups) => {
    if (newGroups.length > 0 && !filters.value.group_nickname) {
        filters.value.group_nickname = newGroups[0].group_nickname;
    }
}, { immediate: true });
</script>