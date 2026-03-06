<template>
    <div class="pa-4">
        <div class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row dense>
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
                    <v-text-field
                        v-model="filters.card_name"
                        label="银行卡姓名"
                        density="compact"
                        variant="outlined"
                        hide-details
                        clearable
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
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="filters.endTime"
                            @update:model-value="toDateMenu = false"
                        />
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-btn class="mr-2" color="primary" block :loading="loading" @click="getRecords"><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                </v-col>
            </v-row>
        </div>

        <div class="d-flex align-center justify-space-between mb-4">
            <v-btn color="primary" class="mr-2" @click="dialog = true"><v-icon>mdi-plus</v-icon> 添加</v-btn>
            <v-btn color="success"><v-icon>mdi-file-excel</v-icon> 导出表格</v-btn>
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
            <template #item.option_amount="{ item }">
                <span class="text-primary font-weight-bold">{{item.option_amount}}</span>
            </template>
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
            <template #item.working_day="{ item }">
                {{ $filters.formatDate(item.working_day) }}
            </template>
            <template #item.actions="{ item }">
                <v-btn size="small" color="success" variant="tonal" @click="editRecord(item)" class="mr-2"><v-icon>mdi-pencil</v-icon> 编辑</v-btn>
                <v-btn size="small" color="error" variant="tonal" @click="deleteDialog = true; selectedRecordId = item.Id"><v-icon>mdi-delete</v-icon> 删除</v-btn>
            </template>
        </v-data-table-server>

        <v-dialog
            v-model="dialog"
            max-width="400"
            persistent
        >
            <v-card>
                <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                    <div>{{ selectedRecordId ? '编辑' : '新增' }}</div>
                    <v-btn icon="mdi-close" @click="closeDialog" variant="text" density="compact"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-autocomplete
                        v-model="obj.transfer_out_card_name"
                        :items="cards"
                        item-title="card_name"
                        item-value="card_name"
                        label="转出卡姓名" 
                        density="compact"
                        variant="outlined"
                        class="mb-2"
                        color="primary"
                        :error-messages="v$.transfer_out_card_name.$errors.map(e => e.$message)"
                        @input="v$.transfer_out_card_name.$touch"
                        @blur="v$.transfer_out_card_name.$touch"
                    >
                        <template #item="{ props, item }">
                            <v-list-item v-bind="props" density="compact">
                                <v-list-item-title class="text-grey text-caption">{{ item.raw.card_type }}: {{ item.raw.card_no }}</v-list-item-title>
                                <template v-slot:append>
                                    <v-list-item-title class="text-primary text-caption">{{ item.raw.balance }}元</v-list-item-title>
                                </template>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                    <v-autocomplete 
                        v-model="obj.transfer_in_card_name"
                        :items="cards"
                        item-title="card_name"
                        item-value="card_name"
                        label="转入卡姓名"
                        density="compact"
                        variant="outlined"
                        class="mb-2"
                        :error-messages="v$.transfer_in_card_name.$errors.map(e => e.$message)"
                        @input="v$.transfer_in_card_name.$touch"
                        @blur="v$.transfer_in_card_name.$touch"
                    >
                        <template #item="{ props, item }">
                            <v-list-item v-bind="props" density="compact">
                                <v-list-item-title class="text-grey text-caption">{{ item.raw.card_type }}:{{ item.raw.card_no }}</v-list-item-title>
                                <template v-slot:append>
                                    <v-list-item-title class="text-primary text-caption">{{ item.raw.balance }}元</v-list-item-title>
                                </template>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                    <v-text-field 
                        v-model="obj.amount"
                        label="转账金额" 
                        density="compact" 
                        variant="outlined" 
                        class="mb-2"
                        :error-messages="v$.amount.$errors.map(e => e.$message)"
                        @input="v$.amount.$touch"
                        @blur="v$.amount.$touch"
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
                                :model-value="formattedDate(obj.working_day)"
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="obj.working_day"
                            @update:model-value="workdayMenu = false"
                            :min="obj.working_day"
                        />
                    </v-menu>

                    <div class="d-flex justify-end">
                        <v-btn color="primary" :disabled="v$.$invalid" :loading="isSaving" @click="saveRecord"><v-icon>mdi-content-save</v-icon> 保存</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="deleteDialog"
            max-width="400"
            persistent
        >
                <v-card title="删除转账记录">
                    <v-card-text>
                        <div class="mb-4">确定要删除这条转账记录吗？</div>
                        <div class="d-flex justify-end">
                            <v-btn variant="tonal" color="primary" class="mr-2" :disabled="isDeleting" @click="deleteDialog = false">取消</v-btn>
                            <v-btn variant="tonal" color="error" :loading="isDeleting" @click="deleteRecord">确定</v-btn>
                        </div>
                    </v-card-text>
                </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { formattedDate } from '../../js/common';
import { useUserStore } from '../../stores/user';
import { DELETE_INTER_BANK_TRANSFER, EDIT_INTER_BANK_TRANSFER, GET_BANK_CARD, GET_INTERBANK_TRANSFER, INTER_BANK_TRANSFER } from '../../js/api/bank_business';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useToast } from 'vue-toastification';

const toast = useToast();
const userStore = useUserStore();
const pageSizeOptions = computed(() => userStore.tablePageSize);
const cardTypes = ref(['上分卡', '下分卡', '存储卡', '中转卡', '财务卡', '第三方']);
const fromDateMenu = ref(false);
const toDateMenu = ref(false);
const dialog = ref(false);
const deleteDialog = ref(false);
const workdayMenu = ref(false);

const filters = ref({
    card_type: null,
    optioner: null,
    card_name: null,
    startTime: null,
    endTime: null,
})
const cards = ref([]);
const loading = ref(false);
const records = ref([]);
const selectedRecordId = ref(0);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const headers = ref([
    { title: '列', value: 'index', fixed: 'start', width: 60 },
    { title: '操作人', value: 'optioner', fixed: 'start', minWidth: 100 },
    { title: '操作时间', value: 'option_time', minWidth: 170 },
    { title: '操作金额', value: 'option_amount', minWidth: 120 },
    { title: '转出卡姓名', value: 'transfer_out_card_name', minWidth: 120 },
    { title: '转出卡类型', value: 'transfer_out_card_type', minWidth: 120 },
    { title: '转出前金额', value: 'before_transfer_out_amount', minWidth: 120 },
    { title: '转出卡当前金额', value: 'transfer_out_card_current_amount', minWidth: 150 },
    { title: '转入卡姓名', value: 'transfer_in_card_name', minWidth: 120 },
    { title: '转入卡类型', value: 'transfer_in_card_type', minWidth: 120 },
    { title: '转入前金额', value: 'transfer_in_amount', minWidth: 120 },
    { title: '转入卡当前金额', value: 'transfer_in_card_current_amount', minWidth: 150 },
    { title: '工作日', value: 'working_day', minWidth: 120 },
    { title: '操作', value: 'actions', fixed: 'end', minWidth: 180 },
]);

const isSaving = ref(false);
const isDeleting = ref(false);
const obj = ref({
    transfer_out_card_name: null,
    transfer_in_card_name: null,
    amount: null,
    working_day: new Date(),
});
const rules = ref({
    transfer_out_card_name: { required: helpers.withMessage('转出卡姓名不能为空', required) },
    transfer_in_card_name: { 
        required: helpers.withMessage('转入卡姓名不能为空', required),
        notSameAsOutCard: helpers.withMessage('转入卡姓名不能与转出卡姓名相同', value => {
            if (!value || !obj.value.transfer_out_card_name) return true;
            return value !== obj.value.transfer_out_card_name;
        })
    },
    amount: { required: helpers.withMessage('转账金额不能为空', required) },
    working_day: { required: helpers.withMessage('日期不能为空', required) },
})
const v$ = useVuelidate(rules.value, obj.value);

const getCards = async () => {
    const res = await GET_BANK_CARD(null, '正常 ', null, null, null, 1, 100);
    if (res.code === 200) {
        cards.value = res.data.rows.map((item) => ({ 
            card_type: item.card_type,
            card_name: item.card_name,
            card_no: item.card_code,
            card_type: item.card_type,
            balance: item.remaining_amount
        }));
    }
}

const getRecords = async () => {
    loading.value = true;
    try {
       const res = await GET_INTERBANK_TRANSFER(
            filters.value.card_type,
            filters.value.optioner,
            filters.value.card_name,
            filters.value.startTime,
            filters.value.endTime,
            page.value,
            perPage.value
       );

       if (res && res.code == 200) {
            records.value = res.data.rows.map((record, index) => ({
                ...record,
                index: (page.value - 1) * perPage.value + index + 1
            }));
            total.value = res.data.count;
       }
    } catch (error) {
        console.error('获取转账记录失败:', error);
        loading.value = false;
    } finally {
        loading.value = false;
    }
}

const closeDialog = () => {
    dialog.value = false;
    selectedRecordId.value = null;
    obj.value.transfer_out_card_name = null;
    obj.value.transfer_in_card_name = null;
    obj.value.amount = null;
    obj.value.working_day = new Date();
    v$.value.$reset();
}

const saveRecord = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) {
        return;
    }
    isSaving.value = true;
    try {
        let res = null;
        if (selectedRecordId.value) {
            res = await EDIT_INTER_BANK_TRANSFER(
                selectedRecordId.value,
                obj.value.transfer_out_card_name,
                obj.value.transfer_in_card_name,
                obj.value.amount,
                obj.value.working_day
            )
        } else {
            res = await INTER_BANK_TRANSFER(
                obj.value.transfer_out_card_name,
                obj.value.transfer_in_card_name,
                obj.value.amount,
                obj.value.working_day
            )
        }

        if (res && res.code === 200) {
            toast.success(res.msg || (selectedRecordId.value ? '转账记录编辑成功' : '转账记录添加成功'));
            await getRecords();
            getCards();
        } else {
            toast.error(res.msg || (selectedRecordId.value ? '转账记录编辑失败' : '转账记录添加失败'));
        }
    } catch (error) {
        console.error('保存转账记录失败:', error);
    } finally {
        isSaving.value = false;
        closeDialog();
    }
}

const editRecord = (record) => {
    selectedRecordId.value = record.Id;
    obj.value.transfer_out_card_name = record.transfer_out_card_name;
    obj.value.transfer_in_card_name = record.transfer_in_card_name;
    obj.value.amount = record.option_amount;
    obj.value.working_day = new Date(record.working_day);
    dialog.value = true;
}

const deleteRecord = async () => {
    isDeleting.value = true;
    try {
        const res = await DELETE_INTER_BANK_TRANSFER(selectedRecordId.value);
        if (res && res.code === 200) {
            toast.success(res.msg || '转账记录删除成功');
            await getRecords();
            getCards();
        } else {
            toast.error(res.msg || '转账记录删除失败');
        }
    } catch (error) {
        console.error('删除转账记录失败:', error);
    } finally {
        selectedRecordId.value = 0;
        isDeleting.value = false;
        deleteDialog.value = false;
    }
}

onMounted(() => {
    getCards();
})
</script>