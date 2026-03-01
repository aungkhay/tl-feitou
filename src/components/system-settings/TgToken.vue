<template>
    <v-dialog
        v-model="dialog"
        max-width="400"
        persistent
    >
      <v-card title="设置飞机Token">
            <v-card-text>
                <v-select
                    v-model="obj.group_nickname"
                    :items="groups"
                    item-title="group_nickname"
                    item-value="group_nickname"
                    label="群昵称" 
                    type="text"
                    variant="outlined"
                    density="compact"
                    class="mb-1"
                    :error-messages="v$.group_nickname.$errors.map(e => e.$message)"
                    @input="v$.group_nickname.$touch"
                    @blur="v$.group_nickname.$touch"
                >
                    <template #item="{ props }">
                        <v-list-item v-bind="props" density="compact" />
                    </template>
                </v-select>
                <v-text-field 
                    v-model="obj.token"
                    label="机器人Token" 
                    type="text"
                    variant="outlined"
                    density="compact"
                    class="mb-1"
                    :error-messages="v$.token.$errors.map(e => e.$message)"
                    @input="v$.token.$touch"
                    @blur="v$.token.$touch"
                />
                <div class="d-flex justify-end">
                    <v-btn text="取消" variant="tonal" :disabled="isLoading" @click="closeDialog" color="red" class="mr-2"></v-btn>
                    <v-btn text="保存设置" variant="tonal" :disabled="isLoading" :loading="isLoading" @click="save" color="primary"></v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref,watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useToast } from "vue-toastification";
import { TELEGRAM_TOKEN_SETUP } from '../../js/api/system_setup';
import { useUserStore } from '../../stores/user';

const toast = useToast();
const userStore = useUserStore();
const dialog = ref(false);
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});
const groups = computed(() => userStore.groups);

const obj = ref({
    token: '',
    group_nickname: '',
});
const rules = ref({
    token: { required: helpers.withMessage('请输入机器人Token', required) },
    group_nickname: { required: helpers.withMessage('请输入群昵称', required)},
})
const v$ = useVuelidate(rules.value, obj.value);
const isLoading = ref(false);

const emit = defineEmits(['update:modelValue']);
watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
});
watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
});

const closeDialog = () => {
    dialog.value = false;
    obj.value.token = '';
    obj.value.group_nickname = '';
    v$.value.$reset();
}

const save = async () => {  
    v$.value.$touch();
    if (v$.value.$invalid) return;  
    isLoading.value = true;

    try {
        const res = await TELEGRAM_TOKEN_SETUP(obj.value.token, obj.value.group_nickname);
        if (res.code == 200) {
            toast.success(res.msg);
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
        toast.error('操作失败，请稍后再试');
    } finally {
        isLoading.value = false;
        closeDialog();
    }
}
</script>