<template>
    <v-dialog
        v-model="dialog"
        max-width="400"
        persistent
    >
        <v-card>
            <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                <div>积分全下</div>
                <v-btn icon="mdi-close" @click="closeDialog" variant="text" density="compact"></v-btn>
            </v-card-title>
            <v-card-text>
                <v-select
                    v-model="obj.group_nickname"
                    :items="groups"
                    item-title="group_nickname"
                    item-value="group_nickname"
                    label="台号(群昵称）"
                    variant="outlined"
                    density="comfortable"
                    class="mb-1"
                    :error-messages="v$.group_nickname.$errors.map(e => e.$message)"
                    @input="v$.group_nickname.$touch"
                    @blur="v$.group_nickname.$touch"
                >
                    <template #item="{ props }">
                        <v-list-item v-bind="props" density="compact" />
                    </template>
                </v-select>
                <v-select
                    v-model="obj.player_name"
                    :items="players"
                    item-title="playername"
                    item-value="playername"
                    label="玩家昵称"
                    variant="outlined"
                    density="comfortable"
                    class="mb-1"
                    :error-messages="v$.player_name.$errors.map(e => e.$message)"
                    @input="v$.player_name.$touch"
                    @blur="v$.player_name.$touch"
                >
                    <template #item="{ props }">
                        <v-list-item v-bind="props" density="compact" />
                    </template>
                </v-select>
                <div class="d-flex justify-end">
                    <v-btn color="primary" variant="tonal" :disabled="isSaving || v$.$invalid" :loading="isSaving" @click="save">确定</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { GET_GROUP_PLAYERS, SCORE_ALL_DOWN } from '../../js/api/player_option';
import { useToast } from 'vue-toastification';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    groups: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'complete']);
const dialog = ref(props.modelValue);
const toast = useToast();

const isSaving = ref(false);
const players = ref([]);
const obj = ref({
    group_nickname: '',
    player_name: '',
});
const rules = ref({
    group_nickname: { required: helpers.withMessage('群昵称不能为空', required) },
    player_name: { required: helpers.withMessage('玩家昵称不能为空', required) },
})
const v$ = useVuelidate(rules.value, obj.value);

watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
});

watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
});

const getPlayers = async () => {
    const res = await GET_GROUP_PLAYERS(obj.value.group_nickname);
    if (res.code == 200) {
        players.value = res.data;
    }
}

const closeDialog = () => {
    if (isSaving.value) return;
    dialog.value = false;
    obj.value.group_nickname = props.groups.length > 0 ? props.groups[0].group_nickname : '';
    obj.value.player_name = '';
    v$.value.$reset();
}

const save = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) return;
    isSaving.value = true;
    try {
        const res = await SCORE_ALL_DOWN(
            obj.value.group_nickname,
            obj.value.player_name,
        );
        if (res.code == 200) {
            toast.success(res.msg);
            emit('complete');
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
        toast.error('操作失败，请稍后再试');
    } finally {
        isSaving.value = false;
        closeDialog();
    }
}

watch(() => props.groups, (newVal) => {
    if (newVal) {
        obj.value.group_nickname = props.groups.length > 0 ? props.groups[0].group_nickname : '';
    }
});

watch(() => obj.value.group_nickname, (newVal) => {
    if (newVal) {
        obj.value.player_name = '';
        v$.value.$reset();
        players.value = [];
        if (props.modelValue) {
            getPlayers();
        }
    }
});
</script>