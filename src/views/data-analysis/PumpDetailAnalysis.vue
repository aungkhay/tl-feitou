<template>
    <div class="pa-4">
        <div class="text-h6">抽水明细分析</div>
        <div class="mb-4 border rounded-lg pa-4 bg-grey-lighten-4">
            <v-row>
                <v-col cols="12" sm="2">
                    <v-select
                        :items="[]"
                        item-title="title"
                        item-value="value"
                        label="选择操作台"
                        density="compact"
                        variant="outlined"
                        hide-details
                    ></v-select>
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
        <div>
            <v-btn color="primary" class="mb-4"><v-icon>mdi-file-excel</v-icon> 导出报表</v-btn>
        </div>
        <v-table density="compact" hover>
            <thead>
                <tr>
                    <th>序列</th>
                    <th>台号</th>
                    <th>工作日</th>
                    <th>局</th>
                    <th>正常对冲赢亏</th>
                    <th>正常零钱赢亏</th>
                    <th>幸运对冲赢亏</th>
                    <th>幸运零钱赢亏</th>
                    <th>幸运上盘赢亏</th>
                    <th>庄闲对冲</th>
                    <th>零头</th>
                    <th>上盘</th>
                    <th>上盘买</th>
                    <th>结果</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, index) in 10" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>台号 {{ index + 1 }}</td>
                    <td>2024-06-01</td>
                    <td>100</td>
                    <td>+500</td>
                    <td>-200</td>
                    <td>+300</td>
                    <td>-100</td>
                    <td>+150</td>
                    <td>+400</td>
                    <td>-50</td>
                    <td>+600</td>
                    <td>买A</td>
                    <td>赢</td>
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
</script>