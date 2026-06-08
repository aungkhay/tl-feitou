<template>
    <div class="px-2 py-3">

        <div class="mb-2 text-h6">代理列表</div>
        <div class="mb-2 border px-2 pt-3 pb-2 rounded">
            <v-row dense>
                <v-col cols="12" sm="2">
                    <v-btn color="primary" @click="dialog1 = true"><v-icon>mdi-plus</v-icon> 新增代理</v-btn>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-text-field
                        v-model="filters.agent_name"
                        label="代理商名称"
                        variant="outlined"
                        clearable
                        @click:clear="filters.agent_name = null; getAgents()"
                        density="compact"
                        hide-details
                    />
                </v-col>
                <v-col cols="12" sm="1">
                    <v-btn color="primary" @click="getAgents" block :disabled="!filters.agent_name"><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                </v-col>
            </v-row>
        </div>
        
        <v-data-table-server
            v-model:page="page1"
            v-model:items-per-page="perPage1"
            :headers="headers1"
            :items="agents"
            :items-length="total1"
            :loading="loading1"
            density="compact"
            class="table1"
            :items-per-page-options="pageSizeOptions"
            @update:options="getAgents"
            hover
        >
            <template #loading>
                <v-skeleton-loader type="table-row@3"/>
            </template>
            <template #item.Settlement="{ item }">
                {{ $filters.formatFullDate(item.Settlement) }}
            </template>
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
            <template #item.actions="{ item }">
                <v-btn size="small" color="error" variant="tonal" @click.stop="getSubOrdinates(item)" class="mr-1"><v-icon>mdi-account-multiple</v-icon> 下级</v-btn>
                <v-btn size="small" color="primary" variant="tonal" @click.stop="memberObj.agent_name = item.username; dialog2 = true"><v-icon>mdi-plus</v-icon> 新增会员</v-btn>
            </template>
            <template #body.append>
                <tr class="font-weight-bold bg-grey-lighten-2">
                    <td colspan="2">合计</td>
                    <td>{{ summary1.total_agent }}</td>
                    <td>{{ summary1.total_points }}</td>
                    <td>{{ summary1.total_yl }}</td>
                    <td>{{ summary1.total_fyje }}</td>
                    <td>{{ summary1.total_score }}</td>
                    <td>{{ summary1.total_raw_score }}</td>
                    <td colspan="4"></td>
                </tr>
            </template>
        </v-data-table-server>

        <v-divider class="my-4"></v-divider>
        <div class="mb-2 text-h6">会员列表 <span v-if="selectedAgent" class="text-error">代理：{{ selectedAgent.username }}</span></div>
        <v-data-table-server
            v-model:page="page2"
            v-model:items-per-page="perPage2"
            :headers="headers2"
            :items="members"
            :items-length="total2"
            :loading="loading2"
            density="compact"
            class="table1"
            :items-per-page-options="pageSizeOptions"
            @update:options="getMembers"
            hover
        >
            <template #loading>
                <v-skeleton-loader type="table-row@3"/>
            </template>
            <template #item.option_time="{ item }">
                {{ $filters.formatFullDate(item.option_time) }}
            </template>
            <template #body.append>
                <tr class="font-weight-bold bg-grey-lighten-2">
                    <td colspan="3">合计</td>
                    <td>{{ summary2.sum_fyje }}</td>
                    <td>{{ summary2.sum_points }}</td>
                    <td>{{ summary2.sum_yl }}</td>
                    <td></td>
                </tr>
            </template>
        </v-data-table-server>

        <v-dialog v-model="dialog1" max-width="450" persistent>
            <v-card title="新增代理">
                <v-card-text>
                    <v-text-field
                        v-model="agentObj.player_name"
                        label="代理名称"
                        variant="outlined"
                        class="mb-2"
                        :error-messages="v1$.player_name.$errors.map(e => e.$message)"
                        @input="v1$.player_name.$touch"
                        @blur="v1$.player_name.$touch"
                    />

                    <div class="d-flex justify-end">
                        <v-btn text="取消" variant="tonal" :disabled="savingAgent" @click="closeAgentDialog" color="red" class="mr-2"></v-btn>
                        <v-btn color="primary" :loading="savingAgent" :disabled="v1$.$invalid || savingAgent" @click="addAgent"><v-icon class="mr-1">mdi-content-save</v-icon> 保存</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog2" max-width="450" persistent>
            <v-card title="新增会员">
                <v-card-text>
                    <v-text-field
                        v-model="memberObj.agent_name"
                        label="代理名称"
                        variant="outlined"
                        class="mb-2"
                        :error-messages="v2$.agent_name.$errors.map(e => e.$message)"
                        @input="v2$.agent_name.$touch"
                        @blur="v2$.agent_name.$touch"
                        readonly
                    />

                    <v-autocomplete
                        v-model="memberObj.player_name"
                        v-model:search="searchPlayer"
                        :items="players"
                        label="会员名称"
                        item-title="playername"
                        item-value="playername"
                        variant="outlined"
                        class="mb-2"
                        color="primary"
                        autocomplete="off"
                        :error-messages="v2$.player_name.$errors.map(e => e.$message)"
                        @input="v2$.player_name.$touch"
                        @blur="v2$.player_name.$touch"
                    >
                        <template #item="{ props, item }">
                            <v-list-item v-bind="props" density="compact" />
                        </template>
                    </v-autocomplete>

                    <div class="d-flex justify-end">
                        <v-btn text="取消" variant="tonal" :disabled="savingMember" @click="closeMemberDialog" color="red" class="mr-2"></v-btn>
                        <v-btn color="primary" :loading="savingMember" :disabled="v2$.$invalid || savingMember" @click="addMember"><v-icon class="mr-1">mdi-content-save</v-icon> 保存</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useToast } from 'vue-toastification';
import { useUserStore } from '../../stores/user';
import { GET_AGENT, GET_MEMBER, ADD_AGENT, ADD_MEMBER } from '../../js/api/agent_business';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { PLAYER_FUZZY_QUERY } from "../../js/api/player_option";

const toast = useToast();
const userStore = useUserStore();
const pageSizeOptions = computed(() => userStore.tablePageSize);

const filters = ref({
    agent_name: null
});

const dialog1 = ref(false);
const page1 = ref(1);
const perPage1 = ref(10);
const total1 = ref(0);
const loading1 = ref(false);
const agents = ref([]);
const selectedAgent = ref(null);
const headers1 = [
    { title: '序列', value: 'index', minWidth: 100 },
    { title: '用户名', value: 'username', fixed: 'start', minWidth: 120 },
    { title: '代理人数', value: 'member_count', minWidth: 100 },
    { title: '总积分', value: 'total_points', minWidth: 100 },
    { title: '总盈亏', value: 'total_yl', minWidth: 100 },
    { title: '返佣金额', value: 'fyje', minWidth: 100 },
    { title: '当前积分', value: 'score', minWidth: 100 },
    { title: '初始积分', value: 'raw_score', minWidth: 100 },
    { title: '结算时间', value: 'Settlement', minWidth: 170 },
    { title: '操作人', value: 'optioner', minWidth: 100 },
    { title: '操作时间', value: 'option_time', minWidth: 170 },
    { title: '操作', value: 'actions', minWidth: 200, fixed: 'end' },
];
const summary1 = ref({
    total_agent: 0,
    total_fyje: 0,
    total_points: 0,
    total_raw_score: 0,
    total_score: 0,
    total_yl: 0,
});
const savingAgent = ref(false);
const agentObj = ref({
    player_name: null,
});
const rules1 = ref({
    player_name: { required: helpers.withMessage('代理昵称不能为空', required) },
})
const v1$ = useVuelidate(rules1.value, agentObj.value);

const dialog2 = ref(false);
const page2 = ref(1);
const perPage2 = ref(10);
const total2 = ref(0);
const loading2 = ref(false);
const members = ref([]);
const players = ref([]);
const searchPlayer = ref('');
const headers2 = [
    { title: '序列', value: 'index' },
    { title: '代理名称', value: 'reference_name' },
    { title: '会员名称', value: 'username' },
    { title: '返佣金额', value: 'fyje' },
    { title: '总积分', value: 'total_points' },
    { title: '总盈亏', value: 'total_yl' },
    { title: '操作时间', value: 'option_time' },
];
const summary2 = ref({
    sum_fyje: 0,
    sum_points: 0,
    sum_yl: 0,
});
const savingMember = ref(false);
const memberObj = ref({
    agent_name: null,
    player_name: null,
});
const rules2 = ref({
    agent_name: { required: helpers.withMessage('代理名称不能为空', required) },
    player_name: { required: helpers.withMessage('会员名称不能为空', required) },
})
const v2$ = useVuelidate(rules2.value, memberObj.value);

const closeAgentDialog = () => {
    dialog1.value = false;
    agentObj.value.player_name = null;
    v1$.value.$reset();
}

const closeMemberDialog = () => {
    dialog2.value = false;
    memberObj.value.agent_name = null;
    memberObj.value.player_name = null;
    v2$.value.$reset();
}

const getAgents = async () => {
    loading1.value = true;
    try {
        const res = await GET_AGENT(filters.value.agent_name, page1.value, perPage1.value);
        if (res.code == 200) {
            agents.value = res.data.list.map((item, index) => ({ ...item, index: (page1.value - 1) * perPage1.value + index + 1 }));
            total1.value = res.data.total;
            summary1.value = res.data.summary;
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
        toast.error('获取用户列表失败');
    } finally {
        loading1.value = false;
    }
}

const handleRowClick = (event, raw) => {
    console.log('点击了代理行：', raw.item);
    selectedAgent.value = raw.item;
    getMembers();
}

const getSubOrdinates = async (agent) => {
    if (!agent) return;
    selectedAgent.value = agent;
    getMembers();
}

const getMembers = async () => {
    if (!selectedAgent.value) return;
    loading2.value = true;
    try {
        const res = await GET_MEMBER(selectedAgent.value.username, page2.value, perPage2.value);
        if (res.code == 200) {
            members.value = res.data.list.map((item, index) => ({ ...item, index: (page2.value - 1) * perPage2.value + index + 1 }));
            total2.value = res.data.total;
            summary2.value = res.data.summary;
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
        toast.error('获取用户列表失败');
    } finally {
        loading2.value = false;
    }
}

const addAgent = async () => {
    if(v1$.value.$invalid || savingAgent.value) return;
    savingAgent.value = true;
    try {
        const res = await ADD_AGENT(agentObj.value.player_name);
        if (res.code == 200) {
            toast.success('新增代理成功');
            dialog1.value = false;
            agentObj.value.player_name = null;
            getAgents();
            closeAgentDialog();
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
        toast.error('新增代理失败');
    } finally {
        savingAgent.value = false;
    }
}

const addMember = async () => {
    if(v2$.value.$invalid || savingMember.value) return;
    savingMember.value = true;
    try {
        const res = await ADD_MEMBER(memberObj.value.agent_name, memberObj.value.player_name);
        if (res.code == 200) {
            toast.success('新增会员成功');
            dialog2.value = false;
            memberObj.value.agent_name = null;
            memberObj.value.player_name = null;
            await getMembers();
            closeMemberDialog();
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
        toast.error('新增会员失败');
    } finally {
        savingMember.value = false;
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
</script>