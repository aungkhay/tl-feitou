<template>
    <v-dialog
        v-model="dialog"
        max-width="750"
        persistent
    >
        <v-card>
            <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                <div>积分兑换比率设置</div>
                <v-btn icon="mdi-close" @click="dialog = false" variant="text" density="compact"></v-btn>
            </v-card-title>
            <v-card-text class="pa-3">
                <v-row class="mb-4 mt-1 bg-grey-lighten-3 border rounded-lg mx-1">
                    <v-col cols="12" sm="3">
                        <v-select
                            v-model="selectedDesk"
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
                    <v-col cols="12" sm="3">
                        <v-text-field
                            label="积分按"
                            density="compact"
                            hide-details
                            variant="outlined"
                            type="number"
                        />
                    </v-col>
                    <v-col cols="12" sm="3">
                        <v-text-field
                            label="返"
                            density="compact"
                            hide-details
                            variant="outlined"
                            type="number"
                        />
                    </v-col>
                    <v-col cols="12" sm="3">
                        <v-btn block color="primary">新增</v-btn>
                    </v-col>
                </v-row>
                <div class="border rounded-lg pa-3">
                    <div>兑换比率列表</div>
                    <v-table hover density="compact">
                        <thead>
                            <tr>
                                <th>积分</th>
                                <th>兑换价</th>
                                <th class="text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i in 5" :key="i">
                                <td>1000</td>
                                <td>1元</td>
                                <td class="text-center">
                                    <v-btn text="删除" variant="text" color="red">删除</v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, onMounted, ref,watch } from 'vue';
import { useUserStore } from '../../stores/user';
import { DELETE_DATA, GET_PERSONAL_EXCHANGE_RATIO, GET_POINTS_EXCHANGE_RATIO, PERSONAL_EXCHANGE_RATIO, PLAYER_COPY, POINTS_EXCHANGE_RATIO } from '../../js/api/business_settings';

const userStore = useUserStore();
const dialog = ref(false);
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});

const desks = ref([
    { title: '辉煌一台' }
]);
const groups = computed(() => userStore.groups);
const selectedDesk = ref(null);

const emit = defineEmits(['update:modelValue']);
watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
});
watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
});

onMounted(() => {
    // GET_POINTS_EXCHANGE_RATIO();
    // POINTS_EXCHANGE_RATIO();
    // GET_PERSONAL_EXCHANGE_RATIO();
    // PERSONAL_EXCHANGE_RATIO(); 200
    // PLAYER_COPY();
    // DELETE_DATA();
})
</script>