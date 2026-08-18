<template>
    <v-dialog v-model="dialog" persistent>
        <div class="d-flex justify-center">
            <v-card class="rounded-lg" max-width="1500px">
                <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                    <div>
                        <span class="text-success">{{ data.shoe }}-{{ data.round }} </span>
                        <span class="text-primary mx-3">{{ data.group_nickname }} </span>
                        <span class="text-secondary">{{ moment(data.date).format('YYYY-MM-DD') }}</span>
                    </div>
                    <v-btn icon="mdi-close" @click="closeDialog" variant="text" density="compact"></v-btn>
                </v-card-title>
                <v-card-text class="pa-0">
                    <v-row no-gutters>
                        <v-col cols="7">
                            <v-progress-linear v-if="loadingBet" indeterminate color="primary"/>
                            <v-table density="compact" :loading="loadingBet" class="text-center" style="max-height: 80vh; overflow-y: auto;">
                                <thead style="position: sticky; top: 0; background-color: #f5f5f5; z-index: 1;">
                                    <tr>
                                        <th>名称</th>
                                        <th>闲</th>
                                        <th>庄</th>
                                        <th style="min-width: 70px;">闲对</th>
                                        <th style="min-width: 70px;">庄对</th>
                                        <th>和</th>
                                        <th style="min-width: 80px;">小龙虎</th>
                                        <th style="min-width: 80px;">大龙虎</th>
                                        <th style="min-width: 80px;">幸运7</th>
                                        <th style="min-width: 70px;">完美</th>
                                    </tr>
                                </thead>
                                <thead>
                                    <tr v-for="(item, index) in betData" :key="index" class="compact-row">
                                        <td style="max-width: 100px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">{{ item.name }}</td>
                                        <td>{{ item.bet_detail.x }}</td>
                                        <td>{{ item.bet_detail.z }}</td>
                                        <td>{{ item.bet_detail.xd }}</td>
                                        <td>{{ item.bet_detail.zd }}</td>
                                        <td>{{ item.bet_detail.h }}</td>
                                        <td>{{ item.bet_detail.l }}</td>
                                        <td>{{ item.bet_detail.k }}</td>
                                        <td>{{ item.bet_detail.q }}</td>
                                        <td>{{ item.bet_detail.m }}</td>
                                    </tr>
                                </thead>
                            </v-table>
                        </v-col>
                        <v-col cols="5">
                            <v-progress-linear v-if="loadingScore" indeterminate color="primary"/>
                            <v-table density="compact" :loading="loadingScore" class="text-center" style="max-height: 80vh; width: 1000px; overflow-y: auto;">
                                <thead style="position: sticky; top: 0; background-color: #f5f5f5; z-index: 1;">
                                    <tr>
                                        <th>名称</th>
                                        <th style="min-width: 80px;">本局得分</th>
                                        <th style="min-width: 80px;">剩余分</th>
                                        <th style="min-width: 80px;">初始分</th>
                                        <th style="min-width: 80px;">日积分</th>
                                        <th style="min-width: 80px;">总积分</th>
                                    </tr>
                                </thead>
                                <thead>
                                    <tr v-for="(item, index) in scoreData" :key="index" class="compact-row">
                                        <td style="max-width: 100px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">{{ item.userName }}</td>
                                        <td>{{ item.yl }}</td>
                                        <td>{{ item.score }}</td>
                                        <td>{{ item.raw_score }}</td>
                                        <td>{{ item.daily_points }}</td>
                                        <td>{{ item.total_points }}</td>
                                    </tr>
                                </thead>
                            </v-table>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </div>
    </v-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { GET_BET_DATA, GET_SCORE_DATA } from '../js/api/financial_inquiries';
import moment from 'moment';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'close']);

const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const closeDialog = () => {
    emit('update:modelValue', false);
    emit('close');
};

const loadingBet = ref(false);
const loadingScore = ref(false);
const betData = ref(null);
const scoreData = ref(null);

const getBetData = async () => {
    loadingBet.value = true;
    try {
        console.log(props.data);
        const res = await GET_BET_DATA(props.data.shoe, props.data.round, props.data.group_nickname, props.data.date);
        if (res.code == 200) {
            betData.value = res.data;
        } else {
            console.error('Error fetching bet data:', res.message);
        }
    } catch (error) {
        console.error('Error fetching bet data:', error);
    } finally {
        loadingBet.value = false;
    }
};

const getScoreData = async () => {
    loadingScore.value = true;
    try {
        const res = await GET_SCORE_DATA(props.data.shoe, props.data.round, props.data.group_nickname, props.data.date);
        if (res.code == 200) {
            scoreData.value = res.data;
        } else {
            console.error('Error fetching score data:', res.message);
        }
    } catch (error) {
        console.error('Error fetching score data:', error);
    } finally {
        loadingScore.value = false;
    }
};

onMounted(() => {
    getBetData();
    getScoreData();
});
</script>

<style scoped>
.compact-row td {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    height: 28px !important;
    line-height: 28px;
    font-size: 12px;
    border-bottom: 1px solid #e0e0e0;
    text-align: left;
}
</style>