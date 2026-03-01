<template>
    <v-dialog
        v-model="dialog"
        max-width="400"
        persistent
    >
      <v-card title="多台转分">
            <v-card-text>
                <v-text-field
                    v-model="obj.source_desk"
                    label="源桌昵称"
                    variant="outlined"
                    density="comfortable"
                    class="mb-1"
                    :error-messages="v$.source_desk.$errors.map(e => e.$message)"
                    @input="v$.source_desk.$touch"
                    @blur="v$.source_desk.$touch"
                />
                <v-text-field
                    v-model="obj.source_score"
                    label="转分数量"
                    variant="outlined"
                    density="comfortable"
                    class="mb-1"
                    :error-messages="v$.source_score.$errors.map(e => e.$message)"
                    @input="v$.source_score.$touch"
                    @blur="v$.source_score.$touch"
                />
                <v-text-field
                    v-model="obj.source_player_name"
                    label="源玩家昵称"
                    variant="outlined"
                    density="comfortable"
                    class="mb-1"
                    :error-messages="v$.source_player_name.$errors.map(e => e.$message)"
                    @input="v$.source_player_name.$touch"
                    @blur="v$.source_player_name.$touch"
                />
                <v-text-field
                    v-model="obj.target_desk"
                    label="目标桌昵称"
                    variant="outlined"
                    density="comfortable"
                    class="mb-1"
                    :error-messages="v$.target_desk.$errors.map(e => e.$message)"
                    @input="v$.target_desk.$touch"
                    @blur="v$.target_desk.$touch"
                />
                <v-text-field
                    v-model="obj.target_player_name"
                    label="目标玩家昵称"
                    variant="outlined"
                    density="comfortable"
                    class="mb-1"
                    :error-messages="v$.target_player_name.$errors.map(e => e.$message)"
                    @input="v$.target_player_name.$touch"
                    @blur="v$.target_player_name.$touch"
                />
                <div class="d-flex justify-end">
                    <v-btn text="取消" variant="tonal" :disabled="isSaving" @click="closeDialog" color="red" class="mr-2"></v-btn>
                    <v-btn text="确定" variant="tonal" :disabled="isSaving" :loading="isSaving" @click="save" color="primary"></v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { TRANS_SCORE } from '../../js/api/desk_option';
import { useToast } from "vue-toastification";

const toast = useToast();
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});
const emit = defineEmits(['update:modelValue']);
const dialog = ref(props.modelValue);
const isSaving = ref(false);

const obj = ref({
    source_desk: '',
    source_score: '',
    source_player_name: '',
    target_desk: '',
    target_player_name: ''
});

const rules = ref({
    source_desk: { required: helpers.withMessage('源桌昵称不能为空', required) },
    source_score: { required: helpers.withMessage('转分数量不能为空', required) },
    source_player_name: { required: helpers.withMessage('源玩家昵称不能为空', required) },
    target_desk: { required: helpers.withMessage('目标桌昵称不能为空', required) },
    target_player_name: { required: helpers.withMessage('目标玩家昵称不能为空', required) },
})
const v$ = useVuelidate(rules.value, obj.value);

watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal;
});

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal);
});

const closeDialog = () => {
    dialog.value = false;
    obj.value.source_desk = '';
    obj.value.source_score = '';
    obj.value.source_player_name = '';
    obj.value.target_desk = '';
    obj.value.target_player_name = '';
    v$.value.$reset();
}

const save = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) return;
    isSaving.value = true;

    try {
        const res = await TRANS_SCORE(obj.value.source_desk, obj.value.source_score, obj.value.source_player_name, obj.value.target_desk, obj.value.target_player_name);
        if (res.code == 200) {
            toast.success(res.msg);
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
        toast.error('操作失败，请稍后再试');
    }  finally {
        isSaving.value = false;
        closeDialog();
    }
}
</script>