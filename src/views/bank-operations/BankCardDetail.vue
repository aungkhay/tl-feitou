<template>
    <div class="pa-4">
        <div class="text-h6">银行卡明细查询</div>
        <div class="mb-4 border rounded-lg pa-4 bg-grey-lighten-4">
            <v-row>
                <v-col cols="12" sm="3" class="d-flex">
                    <v-select
                        :items="actionTypes"
                        item-title="title"
                        item-value="value"
                        label="操作类型"
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="mr-2"
                    ></v-select>
                    <v-select
                        v-model="selectCardType"
                        :items="cardTypes"
                        item-title="title"
                        item-value="value"
                        label="卡类型"
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="ml-2"
                    ></v-select>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-text-field
                        label="银行卡姓名"
                        density="compact"
                        variant="outlined"
                        clearable
                        hide-details
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-text-field
                        label="操作人"
                        density="compact"
                        variant="outlined"
                        clearable
                        hide-details
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="3" class="d-flex">
                    <v-menu
                        v-model="fromDateMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                    >
                        <template #activator="{ props }">
                            <v-text-field
                                v-bind="props"
                                label="从"
                                variant="outlined"
                                density="compact"
                                readonly
                                :model-value="formattedDate(fromDate)"
                                hide-details
                                class="mr-2"
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="fromDate"
                            @update:model-value="fromDateMenu = false"
                        />
                    </v-menu>
                    <v-menu
                        v-model="toDateMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                    >
                        <template #activator="{ props }">
                            <v-text-field
                                v-bind="props"
                                label="到"
                                variant="outlined"
                                density="compact"
                                readonly
                                :model-value="formattedDate(toDate)"
                                hide-details
                                class="ml-2"
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="toDate"
                            @update:model-value="toDateMenu = false"
                        />
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="2">
                    <div class="d-flex">
                        <v-btn class="mr-2" color="primary"><v-icon>mdi-magnify</v-icon> 查询</v-btn>
                        <v-btn color="primary"><v-icon>mdi-refresh</v-icon> 重置</v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div class="d-flex mb-2">
            <v-btn color="primary"><v-icon>mdi-file-excel</v-icon> 导出表格</v-btn>
        </div>
        <v-table density="compact" hover>
            <thead>
                <tr>
                    <th>列</th>
                    <th>操作人</th>
                    <th>操作时间</th>
                    <th>操作金额</th>
                    <th>转出卡姓名</th>
                    <th>转出卡类型</th>
                    <th>转出前金额</th>
                    <th>转出卡当前金额</th>
                    <th>转入卡姓名</th>
                    <th>转入卡类型</th>
                    <th>转入前金额</th>
                    <th>转入卡当前金额</th>
                    <th>工作日</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(card, index) in 10" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>张三</td>
                    <td>2024-06-01 10:00:00</td>
                    <td>500</td>
                    <td>李四</td>
                    <td>储蓄卡</td>
                    <td>2000</td>
                    <td>1500</td>
                    <td>王五</td>
                    <td>信用卡</td>
                    <td>3000</td>
                    <td>3500</td>
                    <td>2024-06-01</td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { formattedDate } from '../../js/common';

const actionTypes = ref([
    { title: '全部', value: 'all' },
    { title: '上分', value: 'top-up' },
    { title: '下分', value: 'withdrawal' },
    { title: '转入', value: 'in' },
    { title: '转出', value: 'out' },
    { title: '办公费', value: 'office-expense' },
]);
const selectActionType = ref('all');

const cardTypes = ref([
    { title: '全部', value: 'all' },
    { title: '上分卡', value: 'top-up' },
    { title: '下分卡', value: 'withdrawal' },
    { title: '存储卡', value: 'storage' },
    { title: '中转卡', value: 'transfer' },
    { title: '财务卡', value: 'finance' },
    { title: '第三方', value: 'third-party' },
]);
const selectCardType = ref('all');
const fromDateMenu = ref(false);
const fromDate = ref(new Date());
const toDateMenu = ref(false);
const toDate = ref(new Date());
</script>