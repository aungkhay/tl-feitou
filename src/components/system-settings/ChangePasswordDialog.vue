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
                />
                <v-text-field 
                    v-model="obj.old_password"
                    label="旧密码" 
                    :type="viewOldPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-key"
                    :append-inner-icon="!viewOldPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="viewOldPassword = !viewOldPassword"
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
                    @click:append-inner="viewConfirmPassword = !viewConfirmPassword"
                    :error-messages="v$.confirm_password.$errors.map(e => e.$message)"
                    @input="v$.confirm_password.$touch"
                    @blur="v$.confirm_password.$touch"
                />
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text="取消"
                    variant="tonal"
                    @click="dialog = false"
                    color="red"
                ></v-btn>
                <v-btn
                    text="保存"
                    variant="tonal"
                    @click="changePassword"
                    color="primary"
                ></v-btn>
            </v-card-actions>
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
    old_password: { required: helpers.withMessage('请输入旧密码', required) },
    new_password: { required: helpers.withMessage('请输入新密码', required)},
    confirm_password: { required: helpers.withMessage('请再次输入新密码', required) },
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
watch(profile, () => {
    obj.value.account = profile.value.account;
}, { immediate: true })

const changePassword = async () => {  
    isLoading.value = true;
    const res = await EDIT_PASSWORD(profile.value.account, obj.value.old_password, obj.value.new_password, obj.value.confirm_password, group_nickname.value);
    if (res.code == 200) {
        toast.success(res.msg);
        dialog.value = false;
    } else {
        toast.error(res.msg);
    }

    isLoading.value = false;
}
</script>