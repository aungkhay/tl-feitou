<template>
    <div class="pa-4">
        <div class="text-h6">银行现金统计</div>
        <div class="mb-4 border rounded-lg pa-4 bg-grey-lighten-4">
            <v-row>
                <v-col cols="12" sm="2">
                    <v-select
                        v-model="selectedStatus"
                        :items="cardStatuses"
                        item-title="title"
                        item-value="value"
                        label="卡状态"
                        density="compact"
                        variant="outlined"
                        hide-details
                    ></v-select>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-text-field
                        label="卡姓名"
                        density="compact"
                        variant="outlined"
                        clearable
                        hide-details
                    ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2">
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
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="fromDate"
                            @update:model-value="fromDateMenu = false"
                        />
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="2">
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
        <div class="mb-4">
            <v-btn color="primary"><v-icon>mdi-file-excel</v-icon> 导出表格</v-btn>
        </div>
        <v-table density="compact" hover>
            <thead>
                <tr>
                    <th>列</th>
                    <th>上分</th>
                    <th>下分</th>
                    <th>转入</th>
                    <th>转出</th>
                    <th>手续费</th>
                    <th>办公费用</th>
                    <th>小计</th>
                    <th>时间</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, index) in 10" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>10000</td>
                    <td>5000</td>
                    <td>3000</td>
                    <td>2000</td>
                    <td>150</td>
                    <td>800</td>
                    <td>15750</td>
                    <td>2024-06-01 12:00:00</td>
                </tr>
            </tbody>
        </v-table>
        <v-pagination 
            :length="4"
            density="compact"
            color="primary"
            class="mt-4"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { formattedDate } from '../../js/common';

const fromDateMenu = ref(false);
const fromDate = ref(new Date());
const toDateMenu = ref(false);
const toDate = ref(new Date());
const cardStatuses = ref([
    { title: '全部', value: 'all' },
    { title: '正常', value: 'normal' },
    { title: '冻结', value: 'frozen' },
    { title: '隐藏', value: 'hidden' },
]);
const selectedStatus = ref('all');
</script>