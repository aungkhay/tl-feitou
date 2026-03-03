<template>
    <v-dialog
        v-model="dialog"
        max-width="1000"
        persistent
    >
        <v-card>
            <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                <div>设置个人参数</div>
                <v-btn icon="mdi-close" :disabled="isSaving" @click="closeDialog" variant="text" density="compact"></v-btn>
            </v-card-title>
            <v-card-text>
                <v-row class="pa-0">
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
                        >
                            <template #item="{ props }">
                                <v-list-item v-bind="props" density="compact" />
                            </template>
                        </v-select>
                    </v-col>
                </v-row>
                <div class="mt-4 font-weight-bold text-red">没有<v-icon size="20">mdi-star-outline</v-icon>号为隐藏选择</div>
                <v-row class="pa-0">
                    <v-col cols="12" sm="3">
                        <div class="border rounded px-1 bg-grey-lighten-4" style="height: 300px; overflow-y: auto;">
                            <v-list density="compact" class="bg-grey-lighten-4">
                                <v-list-item v-for="player in players" :key="player.id" :active="obj.player_name == player.playername" active-class="bg-red-lighten-4 text-red rounded" @click="obj.player_name = player.playername">
                                    <v-list-item-title>
                                        <v-icon class="mr-3" :class="player.is_hide ? 'text-grey-lighten-2' : 'text-red'">mdi-star-outline</v-icon>
                                        <span>{{ player.playername }}</span>
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </div>
                        <div class="mt-2">
                            <div class="text-right text-primary font-weight-bold">周润发 <span>[代理]</span></div>
                            <div class="d-flex justify-space-between">
                                <div>剩余分: <span class="text-primary">20100</span></div>
                                <div>初始分: <span class="text-primary">20100</span></div>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="9">
                        <div class="mb-5">个人占成设置</div>
                        <v-row>
                            <v-col cols="12" sm="3">
                                <div>闲庄个人占成比率</div>
                                <v-text-field
                                    v-model="obj.bp_personal_share"
                                    density="compact"
                                    hide-details
                                    variant="outlined"
                                    type="number"
                                    :error-messages="v$.bp_personal_share.$errors.map(e => e.$message)"
                                    @input="v$.bp_personal_share.$touch"
                                    @blur="v$.bp_personal_share.$touch"
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div>闲庄个人占成上限</div>
                                <v-text-field
                                    v-model="obj.bp_personal_share_upperlimit"
                                    density="compact"
                                    hide-details
                                    variant="outlined"
                                    type="number"
                                    :error-messages="v$.bp_personal_share_upperlimit.$errors.map(e => e.$message)"
                                    @input="v$.bp_personal_share_upperlimit.$touch"
                                    @blur="v$.bp_personal_share_upperlimit.$touch"
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div>三宝个人占成比率</div>
                                <v-text-field
                                    v-model="obj.sb_personal_share"
                                    density="compact"
                                    hide-details
                                    variant="outlined"
                                    type="number"
                                    :error-messages="v$.sb_personal_share.$errors.map(e => e.$message)"
                                    @input="v$.sb_personal_share.$touch"
                                    @blur="v$.sb_personal_share.$touch"
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <v-btn color="primary" class="mt-6">设置全部个人占成</v-btn>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" sm="3">
                                <div>兑换类型</div>
                                <v-select
                                    v-model="obj.redemption_type"
                                    :items="[{ title: '积分' }, { title: '庄闲洗码' }, { title: '庄闲+三宝洗码' }]"
                                    item-title="title"
                                    item-value="title"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    :error-messages="v$.redemption_type.$errors.map(e => e.$message)"
                                    @input="v$.redemption_type.$touch"
                                    @blur="v$.redemption_type.$touch"
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div>个人积分兑换比率</div>
                                <v-text-field
                                    v-model="obj.personal_points_redemption_ratio"
                                    density="compact"
                                    hide-details
                                    variant="outlined"
                                    type="number"
                                    :error-messages="v$.personal_points_redemption_ratio.$errors.map(e => e.$message)"
                                    @input="v$.personal_points_redemption_ratio.$touch"
                                    @blur="v$.personal_points_redemption_ratio.$touch"
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div>兑换开始计算时间</div>
                                <v-menu
                                    v-model="exchangeStartDateMenu"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                >
                                    <template #activator="{ props }">
                                        <v-text-field
                                            v-bind="props"
                                            :model-value="formattedDate(obj.redemption_start_time)"
                                            readonly
                                            variant="outlined"
                                            density="compact"
                                            hide-details
                                            :error-messages="v$.redemption_start_time.$errors.map(e => e.$message)"
                                            @input="v$.redemption_start_time.$touch"
                                            @blur="v$.redemption_start_time.$touch"
                                        />
                                    </template>

                                    <v-date-picker v-model="obj.redemption_start_time" @update:model-value="exchangeStartDateMenu = false"/>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <v-btn color="primary" class="mt-6">设置全部个人占成</v-btn>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" sm="3">
                                <div>反水类型</div>
                                <v-select
                                    v-model="obj.rebate_type"
                                    :items="[{ title: '庄闲输赢' }, { title: '庄闲+三宝输赢' }]"
                                    item-title="title"
                                    item-value="title"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    :error-messages="v$.rebate_type.$errors.map(e => e.$message)"
                                    @input="v$.rebate_type.$touch"
                                    @blur="v$.rebate_type.$touch"
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div>反水比率</div>
                                <v-text-field
                                    v-model="obj.rebate_ratio"
                                    density="compact"
                                    hide-details
                                    variant="outlined"
                                    type="number"
                                    :error-messages="v$.rebate_ratio.$errors.map(e => e.$message)"
                                    @input="v$.rebate_ratio.$touch"
                                    @blur="v$.rebate_ratio.$touch"
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div>反水开始计算时间</div>
                                <v-menu
                                    v-model="fanshuiStartDateMenu"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                >
                                    <template #activator="{ props }">
                                        <v-text-field
                                            v-bind="props"
                                            :model-value="formattedDate(obj.rebate_pair_start_time)"
                                            readonly
                                            variant="outlined"
                                            density="compact"
                                            hide-details
                                            :error-messages="v$.rebate_pair_start_time.$errors.map(e => e.$message)"
                                            @input="v$.rebate_pair_start_time.$touch"
                                            @blur="v$.rebate_pair_start_time.$touch"
                                        />
                                    </template>
                                    <v-date-picker v-model="obj.rebate_pair_start_time" @update:model-value="fanshuiStartDateMenu = false"/>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" sm="3">
                                <div>是否启动兑换</div>
                                <v-select
                                    v-model="obj.start_exchange"
                                    :items="[{ id: 1, title: '启动' }, { id: 0, title: '不启动' }]"
                                    item-title="title"
                                    item-value="id"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                    :error-messages="v$.start_exchange.$errors.map(e => e.$message)"
                                    @input="v$.start_exchange.$touch"
                                    @blur="v$.start_exchange.$touch"
                                />
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-center my-3">
                <v-btn color="grey" variant="elevated">历史记录</v-btn>
                <v-btn color="primary" variant="elevated" :disabled="isSaving || v$.$invalid" :loading="isSaving" @click="save">保存设置</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useUserStore } from '../../stores/user';
import { formattedDate } from '../../js/common';
import { GET_GROUP_PLAYERS } from '../../js/api/player_option';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useToast } from 'vue-toastification';
import { PERSONAL_EXCHANGE_RATIO, GET_PERSONAL_EXCHANGE_RATIO } from '../../js/api/business_settings';

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
const players = ref([]);
const exchangeStartDateMenu = ref(false);
const fanshuiStartDateMenu = ref(false);
const obj = ref({
    player_name: null,
    group_nickname: null,
    bp_personal_share: null,
    bp_personal_share_upperlimit: null,
    sb_personal_share: null,
    redemption_type: null,
    rebate_ratio: null,
    personal_points_redemption_ratio: null,
    redemption_start_time: new Date(),
    rebate_type: null,
    rebate_pair_start_time: new Date(),
    start_exchange: null,
})
const isSaving = ref(false);
const rules = ref({
    player_name: { required: helpers.withMessage('玩家昵称不能为空', required) },
    group_nickname: { required: helpers.withMessage('操作台不能为空', required) },
    bp_personal_share: { required: helpers.withMessage('闲庄个人占成比率不能为空', required) },
    bp_personal_share_upperlimit: { required: helpers.withMessage('闲庄个人占成上限不能为空', required) },
    sb_personal_share: { required: helpers.withMessage('三宝个人占成比率不能为空', required) },
    redemption_type: { required: helpers.withMessage('兑换类型不能为空', required) },
    rebate_ratio: { required: helpers.withMessage('反水比率不能为空', required) },
    personal_points_redemption_ratio: { required: helpers.withMessage('个人积分兑换比率不能为空', required) },
    redemption_start_time: { required: helpers.withMessage('兑换开始计算时间不能为空', required) },
    rebate_type: { required: helpers.withMessage('反水类型不能为空', required) },
    rebate_pair_start_time: { required: helpers.withMessage('反水开始计算时间不能为空', required) },
    start_exchange: { required: helpers.withMessage('是否启动兑换不能为空', required) },
})
const v$ = useVuelidate(rules.value, obj.value);

const getPlayers = async () => {
    const res = await GET_GROUP_PLAYERS(obj.value.group_nickname);
    if (res.code == 200) {
        players.value = res.data;
    }
}

const getPersonalExchangeRatio = async () => {
    try {
        const res = await GET_PERSONAL_EXCHANGE_RATIO(obj.value.group_nickname, obj.value.player_name);
        if (res && res.code === 200) {
            obj.value.bp_personal_share = res.data.bp_personal_share;
            obj.value.bp_personal_share_upperlimit = res.data.bp_personal_share_upperlimit;
            obj.value.sb_personal_share = res.data.sb_personal_share;
            obj.value.redemption_type = res.data.redemption_type;
            obj.value.rebate_ratio = res.data.rebate_ratio;
            obj.value.personal_points_redemption_ratio = res.data.personal_points_redemption_ratio;
            obj.value.redemption_start_time = new Date(res.data.redemption_start_time);
            obj.value.rebate_type = res.data.rebate_type;
            obj.value.rebate_pair_start_time = new Date(res.data.rebate_pair_start_time);
            obj.value.start_exchange = res.data.start_exchange;
        }
    } catch (error) {
        toast.error('获取个人兑换比例失败');
    }
}

const resetForm = () => {
    obj.value.player_name = null;
    obj.value.group_nickname = null;
    obj.value.bp_personal_share = null;
    obj.value.bp_personal_share_upperlimit = null;
    obj.value.sb_personal_share = null;
    obj.value.redemption_type = null;
    obj.value.rebate_ratio = null;
    obj.value.personal_points_redemption_ratio = null;
    obj.value.redemption_start_time = new Date();
    obj.value.rebate_type = null;
    obj.value.rebate_pair_start_time = new Date();
    obj.value.start_exchange = null;
    v$.value.$reset();
}

const closeDialog = () => {
    if (isSaving.value) return;
    resetForm();
    dialog.value = false;
};

const save = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) return;

    isSaving.value = true;
    try {
        const res = await PERSONAL_EXCHANGE_RATIO(
            obj.value.player_name,
            obj.value.group_nickname,
            obj.value.bp_personal_share,
            obj.value.bp_personal_share_upperlimit,
            obj.value.sb_personal_share,
            obj.value.redemption_type,
            obj.value.rebate_ratio,
            obj.value.personal_points_redemption_ratio,
            obj.value.redemption_start_time,
            obj.value.rebate_type,
            obj.value.rebate_pair_start_time,
            obj.value.start_exchange
        );
        if (res && res.code === 200) {
            toast.success('设置保存成功');
        } else {
            toast.error(res.msg || '设置保存失败');
        }
    } catch (error) {
        toast.error('设置保存失败');
    } finally {
        isSaving.value = false;
        resetForm();
    }
};

const emit = defineEmits(['update:modelValue']);
watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
});
watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
});
watch(() => obj.value.group_nickname, (newVal) => {
    if (newVal) {
        players.value = [];
        obj.value.player_name = null;
        getPlayers();
    }
});
watch(() => obj.value.player_name, (newVal) => {
    if (newVal) {
        getPersonalExchangeRatio();
    }
});
</script>