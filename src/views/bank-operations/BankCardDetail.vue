<template>
    <div class="px-2 py-3">
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
                                :model-value="formattedDate(filters.start_date, filters.start_time)"
                                hide-details
                                class="mr-2"
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
                                class="ml-2"
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
                <v-col cols="12" sm="1" class="d-flex">
                    <v-btn class="mr-2" color="primary" block @click="getRecords"><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                    <v-btn color="success" block :loading="isExporting" @click="exportTable"><v-icon>mdi-file-excel</v-icon> 导出表格</v-btn>
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
            <template #item.create_at="{ item }">
                {{ $filters.formatFullDate(item.create_at) }}
            </template>
            <template #body.append>
                <tr class="font-weight-bold bg-grey-lighten-2">
                    <td colspan="5">{{ summary.card_type }}</td>
                    <td>{{ summary.option_amount }}</td>
                    <td colspan="4"></td>
                </tr>
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { formattedDate, exportExcel } from '../../js/common';
import { CARD_DETAILS_INQUIRY } from '../../js/api/bank_business';
import { useUserStore } from '../../stores/user';
import { useToast } from 'vue-toastification';
import moment from 'moment';

const toast = useToast();
const userStore = useUserStore();
const pageSizeOptions = computed(() => userStore.tablePageSize);
const actionTypes = ref(['上分', '下分', '转入', '转出', '办公费', '办公费', '手续费', '借款', '还款']);
const cardTypes = ref(['上分卡', '下分卡', '存储卡', '中转卡', '财务卡', '第三方']);
const fromDateMenu = ref(false);
const toDateMenu = ref(false);
const isExporting = ref(false);

const loading = ref(false);
const records = ref([]);
const page = ref(1);
const perPage = ref(15);
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
    { title: '操作时间', value: 'create_at', minWidth: 170 },
    { title: '台号', value: 'desk_number', minWidth: 120 },
    // { title: '备注', value: 'remark', minWidth: 200 },
]);
const summary = ref({
    card_type: '合计',
    option_amount: 0
});

const filters = ref({
    card_type: null,
    optioner: null,
    card_name: null,
    option_type: null,
    start_date: moment().startOf('day').format('YYYY-MM-DD'),
    start_time: '00:00:00',
    end_date: moment().startOf('day').format('YYYY-MM-DD'),
    end_time: '23:59:59',
})

const getRecords = async () => {
    try {
        loading.value = true;
        const res = await CARD_DETAILS_INQUIRY(
            filters.value.card_type,
            filters.value.optioner,
            filters.value.card_name,
            filters.value.option_type,
            filters.value.start_date && filters.value.start_time ? moment(filters.value.start_date).format('YYYY-MM-DD') + ' ' + filters.value.start_time : null,
            filters.value.end_date && filters.value.end_time ? moment(filters.value.end_date).format('YYYY-MM-DD') + ' ' + filters.value.end_time : null,
            page.value,
            perPage.value,
        );
        if (res && res.code == 200) {
            records.value = res.data.rows.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.count || 0;
            summary.value = res.data.summary;
        }
    } catch (error) {
        console.error('查询失败:', error);
    } finally {
        loading.value = false;
    }
}

const exportTable = async () => {
    isExporting.value = true;
    try {
        const res = await CARD_DETAILS_INQUIRY(
            filters.value.card_type,
            filters.value.optioner,
            filters.value.card_name,
            filters.value.option_type,
            filters.value.start_date && filters.value.start_time ? moment(filters.value.start_date).format('YYYY-MM-DD') + ' ' + filters.value.start_time : null,
            filters.value.end_date && filters.value.end_time ? moment(filters.value.end_date).format('YYYY-MM-DD') + ' ' + filters.value.end_time : null,
            1,
            total.value || 1000
        );
        if (res && res.code == 200) {
            const data = res.data.rows.map((item) => ({
                '操作人': item.optioner || '-',
                '操作时间': formattedDate(item.create_at) || '-',
                '操作金额': item.option_amount || '-',
                '转出卡姓名': item.transfer_out_card_name || '-',
                '转出卡类型': item.transfer_out_card_type || '-',
                '转出前金额': item.before_transfer_out_amount || '-',
                '转出卡当前金额': item.transfer_out_card_current_amount || '-',
                '转入卡姓名': item.transfer_in_card_name || '-',
                '转入卡类型': item.transfer_in_card_type || '-',
                '转入前金额': item.transfer_in_amount || '-',
                '转入卡当前金额': item.transfer_in_card_current_amount || '-',
                '工作日': formattedDate(item.working_day) || '-',
            }));
            exportExcel(data, `转账登记-${formattedDate(new Date())}`);
        } else {
            toast.error(res.msg || '获取数据失败，无法导出表格');
        }
    } catch (error) {
        toast.error(error.message || '获取数据失败，无法导出表格');
    } finally {
        isExporting.value = false;
    }
}
</script>