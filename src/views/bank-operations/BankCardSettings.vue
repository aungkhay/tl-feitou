<template>
    <div class="pa-4">
        <div class="text-h5 font-weight-bold">银行卡设置</div>

        <div class="my-2 border px-2 pt-3 pb-2 rounded">
            <v-row>
                <v-col cols="12" sm="2">
                    <v-text-field
                        v-model="filters.optioner"
                        label="操作人"
                        density="compact"
                        variant="outlined"
                        hide-details
                        clearable
                        @click:clear="filters.optioner = null"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-select
                        v-model="filters.card_type"
                        :items="cardTypes"
                        label="卡类型"
                        density="compact"
                        variant="outlined"
                        hide-details
                        clearable
                        @click:clear="filters.card_type = null"
                    ></v-select>
                </v-col>
                <v-col cols="12" sm="2">
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
                        v-model="filters.sort_name"
                        label="排序字段"
                        density="compact"
                        variant="outlined"
                        clearable
                        hide-details
                        @click:clear="filters.sort_name = null"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-btn class="mr-2" color="primary" block @click="getCards"><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                </v-col>
            </v-row>
        </div>

        <div class="d-flex align-center justify-space-between mb-2">
            <v-btn color="primary" @click="dialog = true"><v-icon>mdi-plus</v-icon> 添加</v-btn>
            <v-btn color="success" :loading="isExporting" :disabled="isExporting" @click="exportTable"><v-icon>mdi-file-excel</v-icon> 导出表格</v-btn>
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
            <template #item.optioner="{ item }">
                {{ item.optioner ? item.optioner : '-' }}
            </template>
            <template #item.card_status="{ item }">
                <!-- 卡状态（1正常 2冻结 3隐藏） -->
                <v-chip v-if="item.card_status == '正常'" color="primary">{{ item.card_status }}</v-chip>
                <v-chip v-else-if="item.card_status == '冻结'" color="orange">{{ item.card_status }}</v-chip>
                <v-chip v-else-if="item.card_status == '隐藏'" color="grey">{{ item.card_status }}</v-chip>
                <span v-else>-</span>
            </template>
            <template #item.actions="{ item }">
                <v-btn size="small" color="primary" @click="{}"><v-icon>mdi-pencil</v-icon> 编辑</v-btn>
            </template>
        </v-data-table-server>

        <v-dialog
            v-model="dialog"
            max-width="400"
            persistent
        >
            <v-card>
                <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                    <div>添加银行卡</div>
                    <v-btn icon="mdi-close" :disabled="isSaving" @click="closeDialog" variant="text" density="compact"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-select
                            v-model="obj.card_type"
                            :items="cardTypes"
                            item-title="title"
                            item-value="value"
                            label="卡类型"
                            density="compact"
                            variant="outlined"
                            :error-messages="v$.card_type.$errors.map(e => e.$message)"
                            @input="v$.card_type.$touch"
                            @blur="v$.card_type.$touch"
                        ></v-select>
                        <v-text-field
                            v-model="obj.card_name"
                            label="姓名"
                            density="compact"
                            variant="outlined"
                            :error-messages="v$.card_name.$errors.map(e => e.$message)"
                            @input="v$.card_name.$touch"
                            @blur="v$.card_name.$touch"
                        ></v-text-field>
                        <v-text-field
                            v-model="obj.card_code"
                            label="卡号"
                            density="compact"
                            variant="outlined"
                            :error-messages="v$.card_code.$errors.map(e => e.$message)"
                            @input="v$.card_code.$touch"
                            @blur="v$.card_code.$touch"
                        ></v-text-field>
                        <v-text-field
                            v-model="obj.Initial_amount"
                            label="初始金额"
                            density="compact"
                            variant="outlined"
                            :error-messages="v$.Initial_amount.$errors.map(e => e.$message)"
                            @input="v$.Initial_amount.$touch"
                            @blur="v$.Initial_amount.$touch"
                        ></v-text-field>
                        <v-select
                            v-model="obj.card_status"
                            :items="cardStatuses"
                            item-title="title"
                            item-value="value"
                            label="卡状态"
                            density="compact"
                            variant="outlined"
                            :error-messages="v$.card_status.$errors.map(e => e.$message)"
                            @input="v$.card_status.$touch"
                            @blur="v$.card_status.$touch"
                        ></v-select>
                    </v-form>
                    <div class="d-flex justify-end">
                        <v-btn color="primary" :disabled="isSaving || v$.$invalid" :loading="isSaving" @click="saveCard"><v-icon>mdi-content-save</v-icon> 保存</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { computed, ref,watch } from 'vue';
import { GET_BANK_CARD, ADD_BANK_CARD } from '../../js/api/bank_business';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useToast } from 'vue-toastification';
import { exportExcel } from '../../js/common';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();
const toast = useToast();
const dialog = ref(false);
const cardTypes = ref(['上分卡', '下分卡', '存储卡', '中转卡', '财务卡', '第三方']);
const cardStatuses = ref(['正常', '冻结', '隐藏']);
const page = ref(1);
const perPage = ref(10);
const pageSizeOptions = computed(() => userStore.tablePageSize);
const total = ref(0);
const loading = ref(false);
const cards = ref([]);
const headers = ref([
    { title: '列', value: 'index', fixed: 'start', width: 60 },
    { title: '卡类型', value: 'card_type', fixed: 'start', width: 100 },
    { title: '姓名', value: 'card_name', fixed: 'start', minWidth: 100 },
    { title: '卡号', value: 'card_code', minWidth: 150 },
    { title: '初始金额', value: 'initial_amount', minWidth: 120 },
    { title: '上分金额', value: 'bonus_amount', minWidth: 120 },
    { title: '下分金额', value: 'deduction_amount', minWidth: 120 },
    { title: '转入金额', value: 'transfer_in_amount', minWidth: 120 },
    { title: '转出金额', value: 'transfer_out_amount', minWidth: 120 },
    { title: '手续费', value: 'handling_fee', minWidth: 120 },
    { title: '剩余金额', value: 'remaining_amount', minWidth: 120 },
    { title: '办公金额', value: 'office_amount', minWidth: 120 },
    { title: '卡状态', value: 'card_status', minWidth: 100 },
    { title: '操作人', value: 'optioner', minWidth: 100 },
    { title: '操作', value: 'actions', sortable: false, minWidth: 100 },
]);

const filters = ref({
    card_type: null,
    card_status: null,
    optioner: null,
    card_name: null,
    sort_name: null,
})

const isSaving = ref(false);
const isExporting = ref(false);
const obj = ref({
    card_type: null,
    card_name: null,
    card_code: null,
    Initial_amount: null,
    card_status: null,
});
const rules = ref({
    card_type: { required: helpers.withMessage('卡类型不能为空', required) },
    card_name: { required: helpers.withMessage('姓名不能为空', required) },
    card_code: { required: helpers.withMessage('卡号不能为空', required) },
    Initial_amount: { required: helpers.withMessage('初始金额不能为空', required) },
    card_status: { required: helpers.withMessage('卡状态不能为空', required) },
})
const v$ = useVuelidate(rules.value, obj.value);

const getCards = async () => {
    loading.value = true;

    try {
        const res = await GET_BANK_CARD(
            filters.value.card_type,
            filters.value.card_status,
            filters.value.optioner,
            filters.value.card_name,
            filters.value.sort_name,
            page.value,
            perPage.value
        );
        if (res.code === 200) {
            cards.value = res.data.rows;
            total.value = res.data.count;
        }
    } finally {
        loading.value = false;
    }
}

const closeDialog = () => {
    dialog.value = false;
    obj.value.card_type = null;
    obj.value.card_name = null;
    obj.value.card_code = null;
    obj.value.Initial_amount = null;
    obj.value.card_status = null;
    v$.value.$reset();
}

const saveCard = async () => {
    v$.value.$touch();
    if (v$.value.$invalid || isSaving.value) return;

    isSaving.value = true;
    try {
        const res = await ADD_BANK_CARD(
            obj.value.card_type,
            obj.value.card_name,
            obj.value.card_code,
            obj.value.Initial_amount,
            obj.value.card_status
        );
        if (res.code === 200) {
            await getCards();
            toast.success('银行卡添加成功');
        } else {
            toast.error(res.message || '银行卡添加失败');
        }
    } finally {
        isSaving.value = false;
        closeDialog();
    }
}

const exportTable = () => {
    isExporting.value = true;
    const data = cards.value.map(item => ({
        '卡类型': item.card_type,
        '姓名': item.card_name,
        '卡号': item.card_code,
        '初始金额': item.initial_amount,
        '上分金额': item.bonus_amount,
        '下分金额': item.deduction_amount,
        '转入金额': item.transfer_in_amount,
        '转出金额': item.transfer_out_amount,
        '手续费': item.handling_fee,
        '剩余金额': item.remaining_amount,
        '办公金额': item.office_amount,
        '卡状态': item.card_status,
        '操作人': item.optioner ? item.optioner : '-',
        })
    );
    exportExcel(data, `${filters.value.group_nickname}_操作记录_${new Date().toLocaleDateString()}`);
    isExporting.value = false;
}
</script>

<style scoped>
.table1 :deep(.v-data-table__thead th) {
    background-color: #d4d4d4 !important;
}
.table1 :deep(.v-data-table__thead th:first-child) {
    border-radius: 5px 0 0 0 !important;
}
.table1 :deep(.v-data-table__thead th:last-child) {
    border-radius: 0 5px 0 0 !important;
}
.table1 :deep(td:first-child) {
    border-left: 1px solid #e0e0e0;
}
.table1 :deep(td:last-child) {
    border-right: 1px solid #e0e0e0;
}
</style>