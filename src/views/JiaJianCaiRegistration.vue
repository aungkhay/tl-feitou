<template>
    <div class="px-2 py-3">

        <div class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row>
                <v-col cols="12" sm="2">
                    <v-autocomplete
                        v-model="filters.group_nickname"
                        :items="groups"
                        item-title="group_nickname"
                        item-value="group_nickname"
                        label="拉取端"
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
                <v-col cols="12" sm="2">
                    <v-select
                        v-model="filters.option_type"
                        :items="['加彩', '减彩']" 
                        label="操作类型" 
                        density="compact" 
                        variant="outlined" 
                        hide-details
                        clearable
                        @click:clear="filters.option_type = null"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>   
                    </v-select>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-text-field
                        v-model="filters.optioner"
                        item-title="title" 
                        item-value="value" 
                        label="操作人" 
                        density="compact" 
                        variant="outlined" 
                        hide-details
                        clearable
                        @click:clear="filters.optioner = null"
                    />
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
                    <v-btn class="mr-2" color="primary" block @click="getRecords"><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                </v-col>
            </v-row>
        </div>
        <div class="d-flex justify-space-between mb-2">
            <v-btn color="primary" class="mr-2" @click="dialog = true"><v-icon>mdi-plus</v-icon> 新增</v-btn>
            <v-btn color="success" :disabled="isExporting" :loading="isExporting" @click="exportTable"><v-icon>mdi-file-excel</v-icon> 导出表格</v-btn>
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
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
            <template #item.actions="{ item }">
                <v-btn color="success" variant="tonal" size="small" @click="editRecord(item)" class="mr-2"><v-icon>mdi-pencil</v-icon> 编辑</v-btn>
                <v-btn color="error" variant="tonal" size="small" @click="deleteRecord(item)"><v-icon>mdi-delete</v-icon> 删除</v-btn>
            </template>
            <template #body.append>
                <tr class="font-weight-bold bg-grey-lighten-2">
                    <td colspan="2">总计：{{ summary.net_total }}</td>
                    <td colspan="2">总加：{{ summary.total_add }}</td>
                    <td colspan="2">总减：{{ summary.total_subtract }}</td>
                    <td colspan="4"></td>
                </tr>
            </template>
        </v-data-table-server>

        <v-dialog
            v-model="dialog"
            max-width="400"
            persistent
        >
            <v-card>
                <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                    <div>{{ selectedRecord ? '编辑' : '添加' }}登记</div>
                    <v-btn icon="mdi-close" :disabled="isSaving" @click="resetForm()" variant="text" density="compact"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-select
                        v-model="obj.group_nickname"
                        :items="groups"
                        item-title="group_nickname"
                        item-value="group_nickname"
                        label="拉取端"
                        density="compact"
                        variant="outlined"
                        :error-messages="v$.group_nickname.$errors.map(e => e.$message)"
                        @input="v$.group_nickname.$touch"
                        @blur="v$.group_nickname.$touch"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>                    
                    </v-select>
                    <v-select
                        v-model="obj.option_type"
                        :items="['加彩', '减彩']" 
                        label="操作类型" 
                        density="compact" 
                        variant="outlined" 
                        :error-messages="v$.option_type.$errors.map(e => e.$message)"
                        @input="v$.option_type.$touch"
                        @blur="v$.option_type.$touch"
                    />
                    <v-text-field
                        v-model="obj.amount"
                        label="金额"
                        density="compact"
                        variant="outlined"
                        :error-messages="v$.amount.$errors.map(e => e.$message)"
                        @input="v$.amount.$touch"
                        @blur="v$.amount.$touch"
                    />
                    <v-textarea
                        v-model="obj.memo"
                        label="备注"
                        density="compact"
                        variant="outlined"
                        rows="3"
                        :error-messages="v$.memo.$errors.map(e => e.$message)"
                        @input="v$.memo.$touch"
                        @blur="v$.memo.$touch"
                    />
                    <div class="d-flex justify-end">
                        <v-btn color="primary" :disabled="v$.$invalid" :loading="isSaving" @click="saveRecord">{{ selectedRecord ? '更新' : '保存' }}</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="deleteDialog"
            max-width="400"
            persistent
        >
            <v-card title="删除记录">
                <v-card-text>
                    <div class="mb-4">确定要删除记录吗？</div>
                    <div class="d-flex justify-end">
                        <v-btn variant="tonal" color="primary" class="mr-2" :disabled="isDeleting" @click="resetForm">取消</v-btn>
                        <v-btn variant="tonal" color="error" :loading="isDeleting" @click="confirmDelete">确定</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formattedDate, exportExcel } from '../js/common';
import { useUserStore } from '../stores/user';
import { GET_POINTS_RECORD, ADD_POINTS, EDIT_POINTS, DELETE_POINTS } from '../js/api/points_business'
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useToast } from 'vue-toastification';
import moment from 'moment';

const toast = useToast();
const userStore = useUserStore();
const dialog = ref(false);
const deleteDialog = ref(false);
const records = ref([]);
const total = ref(0);
const page = ref(1);
const perPage = ref(15);
const loading = ref(false);
const pageSizeOptions = computed(() => userStore.tablePageSize);
const headers = ref([
    { title: '序列', value: 'index', fixed: 'start', width: 70 },
    { title: '拉取端', value: 'pull_end', fixed: 'start', minWidth: 120 },
    { title: '当前金额', value: 'money', minWidth: 120 },
    { title: '操作金额', value: 'option_money', minWidth: 120 },
    { title: '操作前金额', value: 'befor_opton_money', minWidth: 150 },
    { title: '操作类型', value: 'option_type', minWidth: 120 },
    { title: '操作时间', value: 'option_time', minWidth: 170 },
    { title: '操作人', value: 'optioner', minWidth: 120 },
    { title: '备注', value: 'memo', minWidth: 200 },
    { title: '操作', value: 'actions', fixed: 'end', minWidth: 180 }
]);
const summary = ref({
    net_total: 0,
    total_add: 0,
    total_subtract: 0
});

const groups = computed(() => userStore.groups);
const fromDateMenu = ref(false);
const toDateMenu = ref(false);
const filters = ref({
    start_date: moment().startOf('day').toDate(),
    start_time: '00:00:00',
    end_date: moment().startOf('day').toDate(),
    end_time: '23:59:59',
    group_nickname: null,
    optioner: null,
    option_type: null
});

const selectedRecord = ref(null);
const isSaving = ref(false);
const isDeleting = ref(false);
const isExporting = ref(false);
const obj = ref({
    group_nickname: null,
    option_type: null,
    amount: null,
    memo: null
})

const rules = ref({
    group_nickname: { required: helpers.withMessage('拉取端不能为空', required) },
    option_type: { required: helpers.withMessage('操作类型不能为空', required) },
    amount: { required: helpers.withMessage('金额不能为空', required), },
    memo: { required: helpers.withMessage('备注不能为空', required) },
})

const v$ = useVuelidate(rules.value, obj.value);

const getRecords = async () => {
    loading.value = true;
    try {
        const res = await GET_POINTS_RECORD(
            filters.value.group_nickname,
            filters.value.optioner,
            filters.value.option_type,
            filters.value.start_date && filters.value.start_time ? moment(filters.value.start_date).format('YYYY-MM-DD') + ' ' + filters.value.start_time : null,
            filters.value.end_date && filters.value.end_time ? moment(filters.value.end_date).format('YYYY-MM-DD') + ' ' + filters.value.end_time : null,
            page.value,
            perPage.value
        );
        if (res.code == 200) {
            records.value = res.data.list.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.total;
            summary.value = res.data.summary;
        }
    } catch (error) {
        console.error('Error fetching records:', error);
    } finally {
        loading.value = false;
    }
};

const resetForm = () => {
    obj.value.group_nickname = null;
    obj.value.option_type = null;
    obj.value.amount = null;
    obj.value.memo = null;
    v$.value.$reset();
    selectedRecord.value = null;
    deleteDialog.value = false;
    dialog.value = false;
};

const saveRecord = async () => {
    if(v$.value.$invalid) return;

    isSaving.value = true;
    try {
        let res;
        if (selectedRecord.value) {
            res = await EDIT_POINTS(selectedRecord.value.Id, obj.value.group_nickname, obj.value.option_type, obj.value.amount, obj.value.memo);
        } else {
            res = await ADD_POINTS(obj.value.group_nickname, obj.value.option_type, obj.value.amount, obj.value.memo);
        }
        if (res.code == 200) {
            resetForm();
            getRecords();
        }
        toast.success(res.msg);
    } catch (error) {
        console.error('Error saving record:', error);
        toast.error('保存记录时出错');
    } finally {
        isSaving.value = false;
    }
};

const editRecord = (record) => {
    selectedRecord.value = record;
    obj.value.group_nickname = record.pull_end;
    obj.value.option_type = record.option_type;
    obj.value.amount = record.option_money;
    obj.value.memo = record.memo;
    dialog.value = true;
};

const deleteRecord = (record) => {
    selectedRecord.value = record;
    deleteDialog.value = true;
};

const confirmDelete = async () => {
    isDeleting.value = true;
    try {
        const res = await DELETE_POINTS(selectedRecord.value.Id);
        if (res.code == 200) {
            resetForm();
            getRecords();
        }
        toast.success(res.msg);
    } catch (error) {
        console.error('Error deleting record:', error);
        toast.error('删除记录时出错');
    } finally {
        isDeleting.value = false;
    }
};

const exportTable = async () => {
    isExporting.value = true;
    try {
        const res = await GET_POINTS_RECORD(
            filters.value.group_nickname,
            filters.value.optioner,
            filters.value.option_type,
            filters.value.start_date && filters.value.start_time ? moment(filters.value.start_date).format('YYYY-MM-DD') + ' ' + filters.value.start_time : null,
            filters.value.end_date && filters.value.end_time ? moment(filters.value.end_date).format('YYYY-MM-DD') + ' ' + filters.value.end_time : null,
            1,
            total.value || 1000
        );
        if (res.code == 200) {
            const data = res.data.list.map(item => ({
                '序列': item.index,
                '拉取端': item.pull_end,
                '当前金额': item.money,
                '操作类型': item.option_type,
                '操作金额': item.option_money,
                '操作前金额': item.befor_opton_money,
                '操作时间': item.option_time,
                '操作人': item.optioner,
                '备注': item.memo,
            }));
            exportExcel(data, `加减彩业务-${formattedDate(new Date())}`);
        }
    } catch (error) {
        console.error('Error exporting records:', error);
        toast.error('导出表格时出错');
    } finally {
        isExporting.value = false;
    }
}
</script>