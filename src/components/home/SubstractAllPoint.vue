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
                <!-- <v-select
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
                </v-select> -->
                <v-autocomplete
                    v-model="obj.player_name"
                    v-model:search="searchPlayer"
                    :items="players"
                    label="选手昵称"
                    item-title="playername"
                    item-value="playername"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    autocomplete="off"
                    class="mb-1"
                    :error-messages="v$.player_name.$errors.map(e => e.$message)"
                    @input="v$.player_name.$touch"
                    @blur="v$.player_name.$touch"
                >
                    <template #item="{ props, item }">
                        <v-list-item v-bind="props" density="compact">
                            <template #append>
                                <span class="text-caption" :class="item.raw.is_hide ? 'text-red' : 'text-green'">
                                    {{ item.raw.is_hide ? '隐藏' : '显示' }}
                                </span>
                            </template>
                        </v-list-item>
                    </template>
                </v-autocomplete>
                <v-select
                    v-model="obj.option_type"
                    :items="options"
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
                <v-autocomplete
                    v-if="obj.option_type === '现金'"
                    v-model="obj.bank_card"
                    :items="bankCards"
                    item-title="card_name"
                    item-value="card_name"
                    label="银行卡号"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    :error-messages="v$.bank_card.$errors.map(e => e.$message)"
                    @input="v$.bank_card.$touch"
                    @blur="v$.bank_card.$touch"
                    autocomplete="off"
                >
                    <template #item="{ props, item }">
                        <v-list-item v-bind="props" density="compact">
                            <v-list-item-subtitle class="text-caption">
                                {{ item.raw.card_type }}: {{ item.raw.card_code }}
                            </v-list-item-subtitle>
                            <template v-slot:append>
                                <v-list-item-title class="text-primary text-caption">{{ item.raw.remaining_amount }}元</v-list-item-title>
                            </template>
                        </v-list-item>
                    </template>
                </v-autocomplete>
                <div class="d-flex justify-end">
                    <v-btn color="primary" variant="tonal" :disabled="isSaving || (obj.option_type === '现金' && !obj.bank_card) || v$.$invalid" :loading="isSaving" @click="save">确定</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { GET_GROUP_PLAYERS, SCORE_ALL_DOWN, PLAYER_FUZZY_QUERY } from '../../js/api/player_option';
import { useToast } from 'vue-toastification';
import { useUserStore } from '../../stores/user';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    groups: {
        type: Array,
        required: true,
    },
    bankCards: {
        type: Array,
        required: false,
        default: () => [],
    },
});

const emit = defineEmits(['update:modelValue', 'complete']);
const dialog = ref(props.modelValue);
const toast = useToast();
const userStore = useUserStore();
const options = computed(() => userStore.option1);

const isSaving = ref(false);
const players = ref([]);
const searchPlayer = ref('');
const obj = ref({
    // group_nickname: '',
    player_name: null,
    option_type: '',
    bank_card: '',
});
const rules = ref({
    // group_nickname: { required: helpers.withMessage('群昵称不能为空', required) },
    player_name: { required: helpers.withMessage('玩家昵称不能为空', required) },
    option_type: { required: helpers.withMessage('操作类型不能为空', required) },
    // bank_card: { required: helpers.withMessage('银行卡号不能为空', required) },
    bank_card: { },
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
    obj.value.option_type = '';
    obj.value.bank_card = '';
    v$.value.$reset();
}

const save = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) return;
    isSaving.value = true;
    try {
        const card = props.bankCards.find(card => card.card_name === obj.value.bank_card);
        const res = await SCORE_ALL_DOWN(
            obj.value.group_nickname,
            obj.value.player_name,
            obj.value.option_type,
            card ? card.card_code : '',
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

const fuzzyPlayer = async () => {
    if (!searchPlayer.value) {
        return;
    }
    const res = await PLAYER_FUZZY_QUERY(searchPlayer.value);
    if (res && res.code == 200) {
        players.value = res.data.list;
    }
}

watch(() => props.groups, (newVal) => {
    if (newVal) {
        obj.value.group_nickname = props.groups.length > 0 ? props.groups[0].group_nickname : '';
    }
});

watch(
    () => searchPlayer.value,
    (newVal) => {
        if (newVal) {
            fuzzyPlayer();
        } else {
            players.value = [];
        }
    }
)

// watch(() => obj.value.group_nickname, (newVal) => {
//     if (newVal) {
//         obj.value.player_name = '';
//         v$.value.$reset();
//         players.value = [];
//         if (props.modelValue) {
//             getPlayers();
//         }
//     }
// });
</script>