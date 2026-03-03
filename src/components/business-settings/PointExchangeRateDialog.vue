<template>
    <v-dialog
        v-model="dialog"
        max-width="750"
        persistent
    >
        <v-card>
            <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                <div>积分兑换比率设置</div>
                <v-btn icon="mdi-close" :disabled="isSaving" @click="dialog = false" variant="text" density="compact"></v-btn>
            </v-card-title>
            <v-card-text class="pa-3">
                <v-row class="mb-4 mt-1 bg-grey-lighten-3 border rounded-lg mx-1">
                    <v-col cols="12" sm="3">
                        <v-select
                            v-model="obj.group_nickname"
                            :items="groups"
                            item-title="group_nickname"
                            item-value="group_nickname"
                            label="选择操作台"
                            density="compact"
                            hide-details
                            variant="outlined"
                            color="primary"
                            :error-messages="v$.group_nickname.$errors.map(e => e.$message)"
                            @input="v$.group_nickname.$touch"
                            @blur="v$.group_nickname.$touch"
                        >
                            <template #item="{ props }">
                                <v-list-item v-bind="props" density="compact" />
                            </template>
                        </v-select>
                    </v-col>
                    <v-col cols="12" sm="3">
                        <v-text-field
                            v-model="obj.points_reached"
                            label="积分按"
                            density="compact"
                            hide-details
                            variant="outlined"
                            type="number"
                            :error-messages="v$.points_reached.$errors.map(e => e.$message)"
                            @input="v$.points_reached.$touch"
                            @blur="v$.points_reached.$touch"
                        />
                    </v-col>
                    <v-col cols="12" sm="3">
                        <v-text-field
                            v-model="obj.points_exchange"
                            label="返"
                            density="compact"
                            hide-details
                            variant="outlined"
                            type="number"
                            :error-messages="v$.points_exchange.$errors.map(e => e.$message)"
                            @input="v$.points_exchange.$touch"
                            @blur="v$.points_exchange.$touch"
                        />
                    </v-col>
                    <v-col cols="12" sm="3">
                        <v-btn block color="primary" :disabled="isSaving || v$.$invalid" @click="addPointExchangeRate">新增</v-btn>
                    </v-col>
                </v-row>
                <div class="border rounded-lg pa-3">
                    <div>兑换比率列表</div>
                    <v-progress-linear v-if="loading" indeterminate color="primary" stream />
                    <v-table hover density="compact">
                        <thead>
                            <tr>
                                <th>操作台</th>
                                <th>积分</th>
                                <th>兑换价</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(record, index) in records" :key="index">
                                <td>{{ record.group_nickname }}</td>
                                <td>{{ record.points_reached }}</td>
                                <td>{{ record.points_exchange }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref,watch } from 'vue';
import { useUserStore } from '../../stores/user';
import { GET_POINTS_EXCHANGE_RATIO, POINTS_EXCHANGE_RATIO } from '../../js/api/business_settings';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useToast } from 'vue-toastification';

const toast = useToast();
const userStore = useUserStore();
const dialog = ref(false);
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});

const records = ref([]);
const loading = ref(false);
const isSaving = ref(false);
const groups = computed(() => userStore.groups);
const obj = ref({
    group_nickname: '',
    points_reached: '',
    points_exchange: ''
})
const rules = ref({
    group_nickname: { required: helpers.withMessage('操作台不能为空', required) },
    points_reached: { required: helpers.withMessage('积分不能为空', required) },
    points_exchange: { required: helpers.withMessage('兑换价不能为空', required) },
})
const v$ = useVuelidate(rules.value, obj.value);

const getPointExchangeRates = async (group_nickname) => {
    try {
        loading.value = true;
        const res = await GET_POINTS_EXCHANGE_RATIO(group_nickname);
        if (res && res.code === 200) {
            records.value = res.data;
        }
    } catch (error) {
        console.error('Error fetching points exchange ratios:', error);
    } finally {
        loading.value = false;
    }
};

const addPointExchangeRate = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) return;
    isSaving.value = true;

    try {
        const res = await POINTS_EXCHANGE_RATIO(obj.value.group_nickname, obj.value.points_reached, obj.value.points_exchange);
        if (res && res.code === 200) {
            getPointExchangeRates(obj.value.group_nickname);
            obj.value.points_reached = '';
            obj.value.points_exchange = '';
            v$.value.$reset();
        }
    } catch (error) {
        toast.error('添加兑换比率失败');
    } finally {
        isSaving.value = false;
    }
}

const emit = defineEmits(['update:modelValue']);
watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
});
watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
});
watch(() => obj.value.group_nickname, (newVal) => {
    if (newVal) {
        records.value = [];
        getPointExchangeRates(newVal);
    }
});
</script>