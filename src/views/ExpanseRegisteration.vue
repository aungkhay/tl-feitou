<template>
    <div class="px-2 py-3">
        <div class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row dense>
                <v-col cols="12" sm="2">
                    <v-select
                        v-model="filters.expense_type"
                        :items="expenseTypes"
                        label="项目名称"
                        density="compact"
                        variant="outlined"
                        hide-details
                        clearable
                        @click:clear="filters.expense_type = null"
                    />
                </v-col>
                <v-col cols="12" sm="2">
                    <v-text-field
                        v-model="filters.optioner"
                        label="操作人"
                        density="compact"
                        variant="outlined"
                        hide-details
                        clearable
                        @click:clear="filters.optioner = null"
                    />
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
                <v-skeleton-loader type="table-row@3"/>
            </template>
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
            <template #item.working_date="{ item }">
                {{ $filters.formatDate(item.working_date) }}
            </template>
            <template #item.actions="{ item }">
                <v-btn size="small" color="success" variant="tonal" class="mr-2" @click="editRecord(item)"><v-icon>mdi-pencil</v-icon> 编辑</v-btn>
                <v-btn size="small" color="error" variant="tonal" @click="deleteDialog = true; selectedRecord = item;"><v-icon>mdi-delete</v-icon> 删除</v-btn>
            </template>
        </v-data-table-server>

        <v-dialog
            v-model="dialog"
            max-width="450"
            persistent
        >
            <v-card>
                <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                    <div>{{ selectedRecord ? '编辑' : '添加' }}办公费用</div>
                    <v-btn icon="mdi-close" :disabled="isSaving" @click="dialog = false; resetExpenseObj();" variant="text" density="compact"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-select
                        v-model="expenseObj.project_name"
                        label="项目名称"
                        :items="expenseTypes"
                        density="compact"
                        variant="outlined"
                        class="mb-2"
                        :error-messages="v$.project_name.$errors.map(e => e.$message)"
                        @input="v$.project_name.$touch"
                        @blur="v$.project_name.$touch"
                    />
                    <v-text-field
                        v-model="expenseObj.card_name"
                        label="收付卡"
                        density="compact"
                        variant="outlined"
                        class="mb-2"
                        :error-messages="v$.card_name.$errors.map(e => e.$message)"
                        @input="v$.card_name.$touch"
                        @blur="v$.card_name.$touch"
                    />
                    <v-text-field
                        v-model="expenseObj.amount"
                        label="金额"
                        density="compact"
                        variant="outlined"
                        class="mb-2"
                        :error-messages="v$.amount.$errors.map(e => e.$message)"
                        @input="v$.amount.$touch"
                        @blur="v$.amount.$touch"
                    />
                    <v-text-field
                        v-model="expenseObj.optioner"
                        label="经手人"
                        density="compact"
                        variant="outlined"
                        class="mb-2"
                        :error-messages="v$.optioner.$errors.map(e => e.$message)"
                        @input="v$.optioner.$touch"
                        @blur="v$.optioner.$touch"
                    />
                    <v-menu
                        v-model="workdayMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                    >
                        <template #activator="{ props }">
                            <v-text-field
                                v-bind="props"
                                label="工作日"
                                variant="outlined"
                                density="compact"
                                readonly
                                :model-value="formattedDate(expenseObj.workday)"
                                :error-messages="v$.workday.$errors.map(e => e.$message)"
                                @input="v$.workday.$touch"
                                @blur="v$.workday.$touch"
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="expenseObj.workday"
                            @update:model-value="workdayMenu = false"
                        />
                    </v-menu>

                    <v-checkbox v-if="selectedRecord == null" v-model="expenseObj.is_initial_card" label="是否初始卡" hide-details color="primary"></v-checkbox>

                    <v-textarea
                        v-model="expenseObj.remark"
                        label="备注"
                        density="compact"
                        variant="outlined"
                        rows="3"
                    ></v-textarea>

                    <div class="d-flex justify-end">
                        <v-btn color="primary" :disabled="isSaving" :loading="isSaving" @click="saveRecord">保存</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="deleteDialog" persistent max-width="400px">
            <v-card>
                <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                    <div>删除确认</div>
                    <v-btn icon="mdi-close" :disabled="isSaving" @click="deleteDialog = false; resetExpenseObj();" variant="text" density="compact"></v-btn>
                </v-card-title>
                <v-card-text>
                    <div class="mb-4">确定要删除这条记录吗？</div>
                    <div class="d-flex justify-end">
                        <v-btn text :disabled="isSaving" @click="deleteDialog = false; resetExpenseObj();" class="mr-2" variant="outlined">取消</v-btn>
                        <v-btn color="error" :disabled="isSaving" :loading="isSaving" @click="deleteRecord" variant="flat">删除</v-btn>
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
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { ADD_OFFICE_EXPENSE, DELETE_OFFICE_EXPENSE, EDIT_OFFICE_EXPENSE, GET_OFFICE_EXPENSES } from '../js/api/office_business';
import { useToast } from 'vue-toastification';
import { getCurrentInstance } from 'vue'
import moment from 'moment';

const { appContext } = getCurrentInstance()

const dialog = ref(false);
const deleteDialog = ref(false);
const expenseTypes = ref(['转账手续费','服务器费','办公用品费','团队拓展费','生活费用','返点费用','其它费用','其它收入']);
const fromDateMenu = ref(false);
const toDateMenu = ref(false);

const toast = useToast();
const userStore = useUserStore();
const pageSizeOptions = computed(() => userStore.tablePageSize);
const records = ref([]);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const loading = ref(false);
const headers = ref([
    { title: '序列', value: 'index', fixed: 'start', width: 60 },
    { title: '项目名称', value: 'project_name', fixed: 'start', width: 120 },
    { title: '经手人', value: 'optioner', fixed: 'start', minWidth: 120 },
    { title: '操作金额', value: 'option_money', minWidth: 100 },
    { title: '操作时间', value: 'option_time', minWidth: 180 },
    { title: '操作人', value: 'optioner', minWidth: 100 },
    { title: '银行卡姓名', value: 'card_name', minWidth: 120 },
    { title: '卡类型', value: 'card_type', minWidth: 100 },
    { title: '操作前金额', value: 'befor_opton_money', minWidth: 120 },
    { title: '剩余金额', value: 'left_money', minWidth: 120 },
    { title: '工作日', value: 'working_date', minWidth: 120 },
    { title: '备注', value: 'remark', minWidth: 150 },
    { title: '操作', value: 'actions', fixed: 'end', minWidth: 180 },
]);
const isExporting = ref(false);
const filters = ref({
    expense_type: null,
    optioner: null,
    card_name: null,
    startTime: moment().startOf('day').toDate(),
    endTime: moment().add(1, 'day').startOf('day').toDate(),
});

const workdayMenu = ref(false);
const selectedRecord = ref(null);
const isSaving = ref(false);
const expenseObj = ref({
    project_name: null,
    card_name: null,
    amount: null,
    is_initial_card: 0,
    optioner: null,
    amount: null,
    workday: new Date(),
})

const rules = ref({
    project_name: { required: helpers.withMessage('项目名称不能为空', required) },
    card_name: { required: helpers.withMessage('银行卡姓名不能为空', required) },
    amount: { required: helpers.withMessage('金额不能为空', required) },
    optioner: { required: helpers.withMessage('经手人不能为空', required) },
    workday: { required: helpers.withMessage('工作日不能为空', required) },
})
const v$ = useVuelidate(rules.value, expenseObj.value);

const getRecords = async () => {
    loading.value = true;
    try {
        const res = await GET_OFFICE_EXPENSES(
            filters.value.expense_type,
            filters.value.optioner,
            filters.value.card_name,
            filters.value.startTime,
            filters.value.endTime,
            perPage.value,
            page.value,
        );
        if (res.code == 200) {
            records.value = res.data.rows.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.count;
        }
    } catch (error) {
        console.error('获取记录失败:', error);
    } finally {
        loading.value = false;
    }
}

const resetExpenseObj = () => {
    expenseObj.value = {
        project_name: null,
        card_name: null,
        amount: null,
        is_initial_card: null,
        optioner: null,
        amount: null,
        workday: new Date(),
    }
    selectedRecord.value = null;
    v$.value.$reset();
}

const editRecord = (record) => {
    selectedRecord.value = record;
    expenseObj.value.project_name = record.project_name;
    expenseObj.value.card_name = record.card_name;
    expenseObj.value.amount = record.option_money;
    expenseObj.value.optioner = record.optioner;
    expenseObj.value.amount = record.option_money;
    expenseObj.value.workday = record.working_date ? new Date(record.working_date) : null;
    expenseObj.value.remark = record.remark;
    v$.value.$reset();
    dialog.value = true;
}

const saveRecord = async () => {
    isSaving.value = true;
    try {
        let res;
        if (selectedRecord.value) {
            // 编辑记录
            res = await EDIT_OFFICE_EXPENSE(
                selectedRecord.value.Id,
                expenseObj.value.project_name,
                expenseObj.value.card_name,
                expenseObj.value.amount,
                expenseObj.value.optioner,
                expenseObj.value.remark
            );
        } else {
            // 新增记录
            res = await ADD_OFFICE_EXPENSE(
                expenseObj.value.project_name,
                expenseObj.value.card_name,
                expenseObj.value.amount,
                expenseObj.value.is_initial_card,
                expenseObj.value.optioner,
                expenseObj.value.remark
            );
        }

        if (res.code === 200) {
            dialog.value = false;
            resetExpenseObj();
            getRecords();
            toast.success(res.msg || '保存记录成功');
        } else {
            toast.error(res.msg || '保存记录失败');
        }
    } catch (error) {
        console.error('保存记录失败:', error);
    } finally {
        isSaving.value = false;
    }
}

const deleteRecord = async () => {
    isSaving.value = true;
    try {
        const res = await DELETE_OFFICE_EXPENSE(selectedRecord.value.Id);
        if (res.code === 200) {
            deleteDialog.value = false;
            resetExpenseObj();
            getRecords();
            toast.success(res.msg || '删除记录成功');
        } else {
            toast.error(res.msg || '删除记录失败');
        }
    } catch (error) {
        console.error('删除记录失败:', error);
    } finally {
        isSaving.value = false;
    }
}

const exportTable = async () => {
    isExporting.value = true;
    try {
        const res = await GET_OFFICE_EXPENSES(
            filters.value.expense_type,
            filters.value.optioner,
            filters.value.card_name,
            filters.value.startTime,
            filters.value.endTime,
            total.value,
            1,
        );
        if (res.code === 200) {
            const data = res.data.rows.map((item, index) => ({
                '序列': index + 1,
                '项目名称': item.project_name,
                '经手人': item.optioner,
                '操作金额': item.option_money,
                '操作时间': appContext.config.globalProperties.$filters.formatFullDate(item.option_time),
                '操作人': item.optioner,
                '银行卡姓名': item.card_name,
                '卡类型': item.card_type,
                '操作前金额': item.befor_opton_money,
                '剩余金额': item.left_money,
                '工作日': appContext.config.globalProperties.$filters.formatDate(item.working_date),
                '备注': item.remark,
            }));
            exportExcel(data, `办公业务-${formattedDate(new Date())}`);
        } else {
            toast.error(res.msg || '获取数据失败，无法导出表格');
        }
    } catch (error) {
        console.error('导出表格失败:', error);
        toast.error('导出失败，请稍后再试');
    } finally {
        isExporting.value = false;
    }
}
</script>