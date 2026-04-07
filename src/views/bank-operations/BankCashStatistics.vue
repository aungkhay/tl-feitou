<template>
    <div class="pa-4">
        <div class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row dense>
                <v-col cols="12" sm="2">
                    <v-select
                        v-model="selectedFilterMethod"
                        :items="filterMethods"
                        label="统计方式"
                        item-title="title"
                        item-value="value"
                        density="compact"
                        variant="outlined"
                        hide-details
                    ></v-select>
                </v-col>
                <v-col v-if="selectedFilterMethod == 'by_period'" cols="12" sm="2">
                    <v-select
                        v-model="filters.card_status"
                        :items="cardStatuses"
                        label="卡状态"
                        density="compact"
                        variant="outlined"
                        hide-details
                        clearable
                        @click:clear="filters.card_status = null"
                    ></v-select>
                </v-col>
                <v-col v-if="selectedFilterMethod == 'by_day'" cols="12" sm="2">
                    <v-text-field
                        v-model="filters.card_name"
                        label="卡姓名"
                        density="compact"
                        variant="outlined"
                        clearable
                        hide-details
                        @click:clear="filters.card_name = ''"
                    ></v-text-field>
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
                <v-col cols="12" sm="2" class="d-flex align-center">
                    <div class="w-50 mr-1">
                        <v-btn color="primary" block @click="getCards">查询</v-btn>
                    </div>
                    <div class="w-50 ml-1">
                        <v-btn text color="success" :loading="isExporting" block @click="exportTable"><v-icon>mdi-file-excel</v-icon> 导出表格</v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>
        
        <v-data-table-server
            v-model:page="page"
            v-model:items-per-page="perPage"
            :headers="headers"
            :items="cards"
            :items-length="total"
            :loading="loading"
            density="compact"
            class="table1"
            :items-per-page-options="pageSizeOptions"
            @update:options="getCards"
            hover
        >
            <template #loading>
                <v-skeleton-loader type="table-row@3"/>
            </template>
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formattedDate } from '../../js/common';
import { useUserStore } from '../../stores/user';
import { BANK_STATISTICS_BY_DAY, BANK_STATISTICS_BY_PERIOD } from '../../js/api/bank_business';
import { exportExcel } from '../../js/common';

const fromDateMenu = ref(false);
const toDateMenu = ref(false);
const toDate = ref(new Date());
const cardStatuses = ref(['正常', '冻结', '隐藏']);

const userStore = useUserStore();
const cards = ref([]);
const total = ref(0);
const page = ref(1);
const perPage = ref(10);
const loading = ref(false);
const pageSizeOptions = computed(() => userStore.tablePageSize);
const headers = ref([
    { title: '列', value: 'index', fixed: 'start', width: 60 },
    { title: '上分', value: 'deposit_amount', width: 100 },
    { title: '下分', value: 'withdraw_amount', width: 100 },
    { title: '转入', value: 'transfer_in_amount', width: 100 },
    { title: '转出', value: 'transfer_out_amount', width: 100 },
    { title: '手续费', value: 'fee_amount', width: 100 },
    { title: '办公费用', value: 'office_fee_amount', width: 120 },
    { title: '小计', value: 'net_amount', width: 100 },
    { title: '时间', value: 'option_time' },
]);
const isExporting = ref(false);
const filterMethods = ref([
    { title: '按天统计单张银行卡', value: 'by_day' },
    { title: '统计某时间段所有银行卡', value: 'by_period' },
]);
const selectedFilterMethod = ref('by_day');
const filters = ref({
    card_status: null,
    card_name: '',
    startTime: '',
    endTime: '',
});

const getCards = async () => {
    loading.value = true;

    try {
        let res;
        if (selectedFilterMethod.value === 'by_day') {
            res = await BANK_STATISTICS_BY_DAY(
                filters.value.card_name,
                filters.value.startTime,
                filters.value.endTime,
                page.value,
                perPage.value
            );
        } else {
            res = await BANK_STATISTICS_BY_PERIOD(
                filters.value.card_status,
                filters.value.startTime,
                filters.value.endTime,
                page.value,     
                perPage.value
            );
        }
        if (res.code === 200) {
            cards.value = res.data.rows.map((item, index) => {
                return{
                    index: (page.value - 1) * perPage.value + index + 1,
                    deposit_amount: item.option_type === '上分' ? item.total_amount : 0,
                    withdraw_amount: item.option_type === '下分' ? item.total_amount : 0,
                    transfer_in_amount: item.option_type === '转入' ? item.total_amount : 0,
                    transfer_out_amount: item.option_type === '转出' ? item.total_amount : 0,
                    fee_amount: item.option_type === '手续费' ? item.total_amount : 0,
                    office_fee_amount: item.option_type === '办公费用' ? item.total_amount : 0,
                    net_amount: 0,
                    option_time: item.option_time,
                }
            });
            total.value = res.data.count;
        }
    } finally {
        loading.value = false;
    }
}

const exportTable = () => {

}
</script>