<template>
    <div class="pa-4">
        <div class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row dense>
                <v-col cols="12" sm="3" class="d-flex">
                    <v-select
                        v-model="filters.option_type"
                        :items="actionTypes"
                        label="操作类型"
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="mr-1"
                        clearable
                        @click:clear="filters.option_type = null"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>
                    </v-select>
                    <v-select
                        v-model="filters.card_type"
                        :items="cardTypes"
                        label="卡类型"
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="ml-1"
                        clearable
                        @click:clear="filters.card_type = null"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>
                    </v-select>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-text-field
                        v-model="filters.card_name"
                        label="银行卡姓名"
                        density="compact"
                        variant="outlined"
                        clearable
                        hide-details
                        @click:clear="filters.card_name = null"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-text-field
                        v-model="filters.optioner"
                        label="操作人"
                        density="compact"
                        variant="outlined"
                        clearable
                        hide-details
                        @click:clear="filters.optioner = null"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" class="d-flex">
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
                                class="mr-2"
                                clearable
                                @click:clear="filters.startTime = null"
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="filters.startTime"
                            @update:model-value="fromDateMenu = false"
                        />
                    </v-menu>
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
                                class="ml-2"
                                clearable
                                @click:clear="filters.endTime = null"
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="filters.endTime"
                            @update:model-value="toDateMenu = false"
                        />
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="1" class="d-flex">
                    <v-btn class="mr-2" color="primary" block><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                    <v-btn color="success" block><v-icon>mdi-file-excel</v-icon> 导出表格</v-btn>
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
                <v-skeleton-loader type="table-row@3"/>
            </template>
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { formattedDate } from '../../js/common';
import { CARD_DETAILS_INQUIRY } from '../../js/api/bank_business';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();
const pageSizeOptions = computed(() => userStore.tablePageSize);
const actionTypes = ref(['上分', '下分', '转入', '转出', '办公费', '办公费', '手续费', '借款', '还款']);
const cardTypes = ref(['上分卡', '下分卡', '存储卡', '中转卡', '财务卡', '第三方']);
const fromDateMenu = ref(false);
const toDateMenu = ref(false);

const loading = ref(false);
const records = ref([]);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const headers = ref([
    { title: '列', value: 'index', fixed: 'start', width: 60 },
    { title: '卡类型', value: 'card_type', fixed: 'start', width: 100 },
    { title: '卡姓名', value: 'card_name', fixed: 'start', minWidth: 120 },
    { title: '卡号', value: 'card_code', minWidth: 150 },
    { title: '操作类型', value: 'option_type', minWidth: 120 },
    { title: '操作金额', value: 'option_amount', minWidth: 120 },
    { title: '操作前金额', value: 'before_option_amount', minWidth: 150 },
    { title: '操作人', value: 'optioner', minWidth: 120 },
    { title: '操作时间', value: 'option_time', minWidth: 170 },
    { title: '台号', value: 'group_nickname', minWidth: 120 },
    { title: '备注', value: 'remark', minWidth: 200 },
]);

const filters = ref({
    card_type: null,
    optioner: null,
    card_name: null,
    option_type: null,
    startTime: null,
    endTime: null,
})

const getRecords = async () => {
    try {
        loading.value = true;
        const res = await CARD_DETAILS_INQUIRY(
            filters.value.card_type,
            filters.value.optioner,
            filters.value.card_name,
            filters.value.option_type,
            filters.value.startTime,
            filters.value.endTime,
            page.value,
            perPage.value,
        );
        if (res && res.code == 200) {
            records.value = res.data.rows.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.count;
        }
    } catch (error) {
        console.error('查询失败:', error);
    } finally {
        loading.value = false;
    }
}
</script>