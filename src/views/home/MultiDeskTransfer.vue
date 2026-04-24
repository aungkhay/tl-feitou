<template>
    <div class="px-2 py-3">
        
        <v-card elevation="0" class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row dense>
                <v-col cols="12" sm="6" md="2">
                    <v-select
                        v-model="filters.group_nickname"
                        :items="groups"
                        label="群昵称"
                        density="compact"
                        item-title="group_nickname"
                        item-value="group_nickname"
                        variant="outlined"
                        color="primary"
                        hide-details
                        clearable
                        @click:clear="filters.group_nickname = null"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>
                    </v-select>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                    <v-select
                        v-model="filters.action_type"
                        :items="[
                            { label: '充值', value: 'recharge' },
                            { label: '提款', value: 'withdrawal' },
                            { label: '返水充值', value: 'rebate_recharge' },
                            { label: '积分充值', value: 'point_recharge' },
                        ]"
                        item-title="label"
                        item-value="value"
                        label="操作类型"
                        density="compact"
                        variant="outlined"
                        color="primary"
                        hide-details
                        clearable
                        @click:clear="filters.action_type = null"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>
                    </v-select>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                    <v-text-field
                        v-model="filters.optioner"
                        label="操作员"
                        density="compact"
                        variant="outlined"
                        hide-details
                        color="primary"
                        clearable
                        @click:clear="filters.optioner = null"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                    <v-text-field
                        v-model="filters.player_name"
                        label="选手昵称"
                        density="compact"
                        variant="outlined"
                        hide-details
                        color="primary"
                        clearable
                        @click:clear="filters.player_name = null"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                    <v-menu v-model="startDateMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                        <template #activator="{ props }">
                            <v-text-field
                                v-bind="props"
                                :model-value="formattedDate(filters.start_time)"
                                label="开始时间"
                                readonly
                                density="compact"
                                variant="outlined"
                                color="primary"
                                hide-details
                                clearable
                                @click:clear="filters.start_time = null"
                            />
                        </template>
                        <v-date-picker v-model="filters.start_time" @input="startDateMenu = false" :max="filters.end_time" />
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                    <v-menu v-model="endDateMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                        <template #activator="{ props }">
                            <v-text-field
                                v-bind="props"
                                :model-value="formattedDate(filters.end_time)"
                                label="结束时间"
                                readonly
                                density="compact"
                                variant="outlined"
                                color="primary"
                                hide-details
                                clearable
                                @click:clear="filters.end_time = null"
                            />
                        </template>
                        <v-date-picker v-model="filters.end_time" @input="endDateMenu = false" :min="filters.start_time" />
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-checkbox v-model="filters.is_virtual" color="primary" label="是否包含虚拟" hide-details density="compact"></v-checkbox>
                </v-col>
                <v-col cols="12" sm="6" md="2" class="d-flex align-center">
                    <v-btn text color="primary" block @click="getRecords"><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                </v-col>
            </v-row>
        </v-card>

        <div class="mb-2">
            <v-btn color="primary" @click="dialog = true"><v-icon>mdi-swap-horizontal</v-icon> 转分</v-btn>
            <v-btn color="primary" class="mx-2" @click="isTransAll = true; dialog = true"><v-icon>mdi-swap-horizontal</v-icon> 积分全转</v-btn>
            <v-btn text color="success" :loading="isExporting" @click="exportTable"><v-icon>mdi-file-excel</v-icon> 导出表格</v-btn>
        </div>

        <v-data-table-server
            v-model:page="page"
            v-model:items-per-page="perPage"
            :headers="headers"
            :items="records"
            :items-length="total"
            :loading="loading"
            density="compact"
            class="table1"
            :items-per-page-options="pageSizeOptions"
            @update:options="getRecords"
            hover
        >
            <template #loading>
                <v-skeleton-loader type="table-row@8"/>
            </template>
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
            <template #item.working_date="{ item }">
                {{ $filters.formatDate(item.working_date) }}
            </template>
            <template #item.actions="{ item }">
                <v-btn color="error" size="small" variant="tonal" :disabled="item.is_revoke == 1" @click="selectedRecord = item; revokeDialog = true"><v-icon>mdi-undo</v-icon> 撤销{{ item.is_revoke }}</v-btn>
            </template>
        </v-data-table-server>

        <v-dialog v-model="dialog" max-width="400" persistent>
            <v-card :title="isTransAll ? '积分全转' : '转分'">
                <v-card-text>
                    <v-select
                        v-model="obj.source_desk"
                        :items="groups"
                        item-title="group_nickname"
                        item-value="group_nickname"
                        label="源台"
                        variant="outlined"
                        density="comfortable"
                        class="mb-1"
                        :error-messages="v$.source_desk.$errors.map(e => e.$message)"
                        @input="v$.source_desk.$touch"
                        @blur="v$.source_desk.$touch"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="comfortable" />
                        </template>
                    </v-select>
                    <v-select
                        v-model="obj.source_player_name"
                        :items="players[obj.source_desk] || []"
                        item-title="playername"
                        item-value="playername"
                        label="源玩家昵称"
                        variant="outlined"
                        density="comfortable"
                        class="mb-1"
                        :error-messages="v$.source_player_name.$errors.map(e => e.$message)"
                        @input="v$.source_player_name.$touch"
                        @blur="v$.source_player_name.$touch"
                    />
                    <v-select
                        v-model="obj.target_desk"
                        :items="groups"
                        item-title="group_nickname"
                        item-value="group_nickname"
                        label="目的台"
                        variant="outlined"
                        density="comfortable"
                        class="mb-1"
                        :error-messages="v$.target_desk.$errors.map(e => e.$message)"
                        @input="v$.target_desk.$touch"
                        @blur="v$.target_desk.$touch"
                    >
                        <template #item="{ props }">
                            <v-list-item v-bind="props" density="comfortable" />
                        </template>
                    </v-select>
                    <v-select
                        v-model="obj.target_player_name"
                        :items="players[obj.target_desk] || []"
                        item-title="playername"
                        item-value="playername"
                        label="目标玩家昵称"
                        variant="outlined"
                        density="comfortable"
                        class="mb-1"
                        :error-messages="v$.target_player_name.$errors.map(e => e.$message)"
                        @input="v$.target_player_name.$touch"
                        @blur="v$.target_player_name.$touch"
                    />
                    <v-text-field
                        v-if="!isTransAll"
                        v-model="obj.source_score"
                        label="转分数量"
                        variant="outlined"
                        density="comfortable"
                        class="mb-1"
                        :error-messages="v$.source_score.$errors.map(e => e.$message)"
                        @input="v$.source_score.$touch"
                        @blur="v$.source_score.$touch"
                    />
                    <div class="d-flex justify-end">
                        <v-btn text="取消" variant="tonal" :disabled="isSaving" @click="closeDialog" color="red" class="mr-2"></v-btn>
                        <v-btn text="确定" variant="tonal" :disabled="isSaving" :loading="isSaving" @click="transferScore" color="primary"></v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="revokeDialog"
            max-width="350"
            persistent
        >
            <v-card title="撤销操作">
                <v-card-text>您确定要撤销该操作吗？</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="取消" variant="tonal" :disabled="isSaving" @click="revokeDialog = false" color="red"></v-btn>
                    <v-btn text="确定" variant="tonal" @click="revokeConfirm" color="primary"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useUserStore } from '../../stores/user';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { GET_GROUP_PLAYERS, GET_SCORE_OPTION_RECORD } from '../../js/api/player_option';
import { useToast } from 'vue-toastification';
import { TRANS_SCORE, REVOKE_TRANS_SCORE, TRANS_ALL_SCORE } from '../../js/api/desk_option';
import { formattedDate } from '../../js/common';

const toast = useToast();
const userStore = useUserStore();

const groups = computed(() => userStore.groups);
const players = ref({});
const headers = ref([
    { title: '序列', key: 'index', sortable: false, fixed: 'start', width: 60 },
    { title: '台号', key: 'group_nickname', sortable: false, fixed: 'start', width: 100 },
    { title: '会员昵称', key: 'playername', sortable: false, fixed: 'start', minWidth: 100 },
    { title: '操作金额', key: 'score', sortable: false, minWidth: 120 },
    { title: '操作前余额', key: 'before_option_score', sortable: false, minWidth: 120 },
    { title: '操作类型', key: 'option_type', sortable: false, minWidth: 120 },
    { title: '工作日', key: 'working_date', sortable: false, minWidth: 140 },
    { title: '操作时间', key: 'option_time', sortable: false, minWidth: 170 },
    { title: '操作员', key: 'optioner', sortable: false, minWidth: 120 },
    { title: '备注', key: 'memo', sortable: false, minWidth: 200 },
    { title: '操作', key: 'actions', sortable: false, minWidth: 150 },
]);
const records = ref([]);
const total = ref(0);
const page = ref(1);
const perPage = ref(10);
const pageSizeOptions = computed(() => userStore.tablePageSize);
const loading = ref(false);
const isExporting = ref(false);
const dialog = ref(false);
const revokeDialog = ref(false);
const selectedRecord = ref(null);
const isTransAll = ref(false);

const filters = ref({
    group_nickname: null,
    start_time: null,
    end_time: null,
    is_virtual: 1,
    action_type: null,
    optioner: null,
    player_name: null
});
const startDateMenu = ref(false);
const endDateMenu = ref(false);

const isSaving = ref(false);
const obj = ref({
    source_desk: '',
    source_score: '',
    source_player_name: '',
    target_desk: '',
    target_player_name: ''
});
const rules = ref({
    source_desk: { required: helpers.withMessage('源台不能为空', required) },
    source_score: { required: helpers.withMessage('转分数量不能为空', required) },
    source_player_name: { required: helpers.withMessage('源玩家昵称不能为空', required) },
    // target_desk cannot be the same as source_desk
    target_desk: { 
        required: helpers.withMessage('目的台不能为空', required),
        // notSameAsSource: helpers.withMessage('目的台不能与源台相同', value => value !== obj.value.source_desk) 
    },
    target_player_name: { required: helpers.withMessage('目的玩家昵称不能为空', required) },
})
const v$ = useVuelidate(rules.value, obj.value);

const exportTable = async () => {

}

const getRecords = async () => {
    loading.value = true;
    try {
        const res = await GET_SCORE_OPTION_RECORD(
            filters.value.group_nickname,
            filters.value.action_type,
            filters.value.optioner,
            filters.value.start_time,
            filters.value.end_time,
            filters.value.player_name,
            filters.value.is_virtual,
            page.value,
            perPage.value
        );
        if (res && res.code == 200) {
            records.value = res.data.record.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.count;
        }
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false;
    }
}

const getPlayers = async (groupNickname) => {
    const res = await GET_GROUP_PLAYERS(groupNickname);
    if (res && res.code == 200) {
        players.value[groupNickname] = res.data;
    }
}

const closeDialog = () => {
    dialog.value = false;
    obj.value.source_desk = '';
    obj.value.source_score = '';
    obj.value.source_player_name = '';
    obj.value.target_desk = '';
    obj.value.target_player_name = '';
    isTransAll.value = false;
    selectedRecord.value = null;
    v$.value.$reset();
}

const transferScore = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) return;
    isSaving.value = true;

    try {
        let res;        
        if (isTransAll.value) {
            res = await TRANS_ALL_SCORE(obj.value.source_desk, obj.value.source_player_name, obj.value.target_desk, obj.value.target_player_name);
        } else {
            res = await TRANS_SCORE(obj.value.source_desk, obj.value.source_score, obj.value.source_player_name, obj.value.target_desk, obj.value.target_player_name);
        }
        if (res.code == 200) {
            toast.success(res.msg);
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

const revokeConfirm = async () => {
    if (!selectedRecord.value) return;
    isSaving.value = true;

    try {
        const res = await REVOKE_TRANS_SCORE(selectedRecord.value.trans_id);
        if (res.code == 200) {
            toast.success(res.msg);
            getRecords();
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
        toast.error('操作失败，请稍后再试');
    } finally {
        isSaving.value = false;
        revokeDialog.value = false;
        selectedRecord.value = null;
    }
}

watch(groups, (newVal) => {
    if (newVal.length > 0) {
        // filters.value.group_nickname = newVal[0].group_nickname;
        userStore.setGroupNickname(newVal[0].group_nickname);

        newVal.forEach(group => {
            players.value[group.group_nickname] = [];
        });
    }
});

watch(() => obj.value.source_desk, async (newVal) => {
    if (newVal) {
        if (!players.value[newVal] || players.value[newVal].length == 0) {
            await getPlayers(newVal);
        }
        obj.value.target_desk = '';
        obj.value.target_player_name = '';
    }
});

watch(() => obj.value.target_desk, async (newVal) => {
    if (newVal) {
        if (!players.value[newVal] || players.value[newVal].length == 0) {
            await getPlayers(newVal);
        }
        obj.value.target_player_name = '';
    }
});
</script>