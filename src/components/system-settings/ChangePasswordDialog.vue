<template>
    <v-dialog
        v-model="dialog"
        max-width="400"
        persistent
    >
      <v-card title="修改密码">
            <v-card-text>
                <v-text-field 
                    v-model="obj.account"
                    label="账号" 
                    type="text"
                    readonly
                    variant="outlined"
                    density="compact"
                    class="mb-1"
                />
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
                    v-model="obj.old_password"
                    label="旧密码" 
                    :type="viewOldPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-key"
                    :append-inner-icon="!viewOldPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="viewOldPassword = !viewOldPassword"
                    variant="outlined"
                    density="compact"
                    class="mb-1"
                    :error-messages="v$.old_password.$errors.map(e => e.$message)"
                    @input="v$.old_password.$touch"
                    @blur="v$.old_password.$touch"
                />
                <v-text-field 
                    v-model="obj.new_password"
                    label="新密码" 
                    :type="viewNewPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-key"
                    :append-inner-icon="!viewNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    variant="outlined"
                    density="compact"
                    class="mb-1"
                    @click:append-inner="viewNewPassword = !viewNewPassword"
                    :error-messages="v$.new_password.$errors.map(e => e.$message)"
                    @input="v$.new_password.$touch"
                    @blur="v$.new_password.$touch"
                />
                <v-text-field 
                    v-model="obj.confirm_password"
                    label="再次输入新密码" 
                    :type="viewConfirmPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-key"
                    :append-inner-icon="!viewConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    variant="outlined"
                    density="compact"
                    class="mb-1"
                    @click:append-inner="viewConfirmPassword = !viewConfirmPassword"
                    :error-messages="v$.confirm_password.$errors.map(e => e.$message)"
                    @input="v$.confirm_password.$touch"
                    @blur="v$.confirm_password.$touch"
                />
                <div class="d-flex justify-end">
                    <v-btn text="取消" variant="tonal" :disabled="isLoading" @click="closeDialog" color="red" class="mr-2"></v-btn>
                    <v-btn text="保存" variant="tonal" :disabled="isLoading" :loading="isLoading" @click="changePassword" color="primary"></v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref,watch } from 'vue';
import { EDIT_PASSWORD } from '../../js/api/system_setup';
import { useUserStore } from '../../stores/user';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useToast } from "vue-toastification";

const toast = useToast();
const userStore = useUserStore();
const group_nickname = computed(() => userStore.group_nickname);
const profile = computed(() => userStore.profile);
const dialog = ref(false);
const groups = computed(() => userStore.groups);
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});

const viewOldPassword = ref(false);
const viewNewPassword = ref(false);
const viewConfirmPassword = ref(false);
const obj = ref({
    account: '',
    old_password: '',
    new_password: '',
    confirm_password: '',
});
const rules = ref({
    group_nickname: { required: helpers.withMessage('请输入群昵称', required)},
    old_password: { required: helpers.withMessage('请输入旧密码', required) },
    new_password: { required: helpers.withMessage('请输入新密码', required)},
    // check that confirm_password is the same as new_password
    confirm_password: { 
        required: helpers.withMessage('请再次输入新密码', required),
        sameAsNewPassword: helpers.withMessage('两次输入的密码不一致', (value, vm) => value === vm.new_password)
    },
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
watch(profile, (newVal) => {
    obj.value.account = newVal?.account;
}, { immediate: true })

const closeDialog = () => {
    dialog.value = false;
    obj.value.old_password = '';
    obj.value.new_password = '';
    obj.value.confirm_password = '';
    v$.value.$reset();
}

const changePassword = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) return;  
    isLoading.value = true;
    try {
        const res = await EDIT_PASSWORD(profile.value.account, obj.value.old_password, obj.value.new_password, obj.value.confirm_password, group_nickname.value);
        if (res.code == 200) {
            toast.success(res.msg);
            dialog.value = false;
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