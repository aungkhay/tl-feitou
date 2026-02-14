<template>
    <v-dialog
        v-model="dialog"
        max-width="400"
        persistent
    >
      <v-card title="修改密码">
            <v-card-text>
                <v-text-field 
                    label="账号" 
                    type="text"
                />
                <v-text-field 
                    v-model="obj.old_password"
                    label="旧密码" 
                    :type="viewOldPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-key"
                    :append-inner-icon="!viewOldPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="viewOldPassword = !viewOldPassword"
                />
                <v-text-field 
                    v-model="obj.new_password"
                    label="新密码" 
                    :type="viewNewPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-key"
                    :append-inner-icon="!viewNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="viewNewPassword = !viewNewPassword"
                />
                <v-text-field 
                    v-model="obj.confirm_password"
                    label="再次输入新密码" 
                    :type="viewConfirmPassword ? 'text' : 'password'"
                    prepend-inner-icon="mdi-key"
                    :append-inner-icon="!viewConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="viewConfirmPassword = !viewConfirmPassword"
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
import { ref,watch } from 'vue';
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
    old_password: '',
    new_password: '',
    confirm_password: '',
});

const emit = defineEmits(['update:modelValue']);
watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
});
watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
});

const changePassword = () => {  
}
</script>