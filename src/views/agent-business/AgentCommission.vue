<template>
    <div class="pa-4">
        <div class="text-h6">代理返佣</div>
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
                    <v-text-field
                        item-title="title"
                        item-value="value"
                        label="代理商昵称"
                        density="compact"
                        variant="outlined"
                        hide-details
                    ></v-text-field>
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
                    <th>会员昵称</th>
                    <th>兑换积分/庄闲/洗码/返水</th>
                    <th>兑换/返水金额</th>
                    <th>操作时间</th>
                    <th>备注</th>
                    <th>兑换/返水类型</th>
                    <th>庄闲洗码/返水兑换日期</th>
                    <th>操作员</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in 10" :key="i">
                    <td>{{ i }}</td>
                    <td>张三</td>
                    <td>1000</td>
                    <td>100元</td>
                    <td>2024-01-01 12:00:00</td>
                    <td>无</td>
                    <td>兑换</td>
                    <td>2023-12-31</td>
                    <td>管理员</td>
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