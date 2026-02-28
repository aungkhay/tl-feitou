<template>
    <v-dialog
        v-model="dialog"
        max-width="400"
        persistent
    >
        <v-card>
            <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                <div>{{ mode === 'add' ? '上分' : '下分' }}</div>
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
                    color="primary"
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
                    color="primary"
                    :error-messages="v$.player_name.$errors.map(e => e.$message)"
                    @input="v$.player_name.$touch"
                    @blur="v$.player_name.$touch"
                >  
                    <template #item="{ props }">
                        <v-list-item v-bind="props" density="compact" />
                    </template>
                </v-select>
                <v-text-field
                    v-model="obj.option_score"
                    label="操作分数"
                    variant="outlined"
                    density="comfortable"
                    class="mb-1"
                    :error-messages="v$.option_score.$errors.map(e => e.$message)"
                    @input="v$.option_score.$touch"
                    @blur="v$.option_score.$touch"
                />
                <v-select
                    v-model="obj.option_type"
                    :items="scoreOptionType"
                    item-title="name"
                    item-value="name"
                    label="操作类型"
                    variant="outlined"
                    density="comfortable"
                    class="mb-1"    
                    color="primary"
                    :error-messages="v$.option_type.$errors.map(e => e.$message)"
                    @input="v$.option_type.$touch"
                    @blur="v$.option_type.$touch"
                >
                    <template #item="{ props }">
                        <v-list-item v-bind="props" density="compact" />
                    </template>
                </v-select>
                <v-select
                    v-model="obj.bank_card"
                    :items="bankCards"
                    item-title="card_code"
                    item-value="card_code"
                    label="银行卡号"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    :error-messages="v$.bank_card.$errors.map(e => e.$message)"
                    @input="v$.bank_card.$touch"
                    @blur="v$.bank_card.$touch"
                >
                    <template #item="{ props, item }">
                        <v-list-item v-bind="props" density="compact">
                            <v-list-item-subtitle class="text-caption">
                                {{ item.raw.card_name }}
                            </v-list-item-subtitle>
                        </v-list-item>
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
import { useUserStore } from '../../stores/user';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { ADD_SCORE, GET_BANKCARD, GET_GROUP_PLAYERS, SUBSTRACT_SCORE } from '../../js/api/player_option';
import { useToast } from 'vue-toastification';

const userStore = useUserStore();
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    mode: {
        type: String,
        required: false,
        default: 'add',
    },
    groups: {
        type: Array,
        required: true,
    },
});
const emit = defineEmits(['update:modelValue', 'complete']);
const dialog = ref(props.modelValue);
const toast = useToast();
const scoreOptionType = computed(() => userStore.operation_type);

const isSaving = ref(false);
const players = ref([]);
const bankCards = ref([]);
const obj = ref({
    group_nickname: '',
    player_name: '',
    option_score: '',
    option_type: '',
    bank_card: '',
});
const rules = ref({
    group_nickname: { required: helpers.withMessage('群昵称不能为空', required) },
    player_name: { required: helpers.withMessage('玩家昵称不能为空', required) },
    option_score: { required: helpers.withMessage('操作分数不能为空', required) },
    option_type: { required: helpers.withMessage('操作类型不能为空', required) },
    bank_card: { required: helpers.withMessage('银行卡号不能为空', required) },
})
const v$ = useVuelidate(rules.value, obj.value);

watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
});

watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
});

const closeDialog = () => {
    if (isSaving.value) return;
    dialog.value = false;
    obj.value.group_nickname = props.groups.length > 0 ? props.groups[0].group_nickname : '';
    obj.value.player_name = '';
    obj.value.option_score = '';
    obj.value.option_type = '';
    obj.value.bank_card = '';
    v$.value.$reset();
}

const save = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) return;
    isSaving.value = true;
    try {
        let res;
        if (props.mode === 'add') {
            res = await ADD_SCORE(
                obj.value.group_nickname,
                obj.value.player_name,
                obj.value.option_score,
                obj.value.option_type,
                obj.value.bank_card
            );
        } else {
            res = await SUBSTRACT_SCORE(
                obj.value.group_nickname,
                obj.value.player_name,
                obj.value.option_score,
                obj.value.option_type,
                obj.value.bank_card
            );
        }   
        if (res.code == 200) {
            toast.success(res.msg);
            emit('complete');
        } else {
            toast.error(res.msg);
        }
    }catch (error) {
        toast.error('操作失败，请稍后再试');
    }  finally {
        isSaving.value = false;
        closeDialog();
    }
}

const getPlayers = async () => {
    const res = await GET_GROUP_PLAYERS(obj.value.group_nickname);
    if (res.code == 200) {
        players.value = res.data;
    }
}

const getBankCards = async () => {
    const res = await GET_BANKCARD(obj.value.group_nickname);
    if (res && res.code == 200) {
        bankCards.value = res.data;
    }
}

watch(() => props.groups, (newVal) => {
    if (newVal) {
        obj.value.group_nickname = props.groups.length > 0 ? props.groups[0].group_nickname : '';
        getPlayers();
        getBankCards();
    }
});

watch(() => obj.value.group_nickname, (newVal) => {
    if (newVal) {
        obj.value.player_name = '';
        obj.value.bank_card = '';
        v$.value.$reset();
        players.value = [];
        bankCards.value = [];
        if (props.modelValue) {
            getPlayers();
            getBankCards();
        }
    }
});
</script>