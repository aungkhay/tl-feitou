<template>
    <div class="pa-4">
        <div class="text-h6">手工录入注码日志</div>
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
                        v-model="workdayMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                    >
                        <template #activator="{ props }">
                            <v-text-field
                                v-bind="props"
                                label="工作日"
                                variant="outlined"
                                density="compact"
                                readonly
                                :model-value="formattedDate(workday)"
                                hide-details
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="workday"
                            @update:model-value="workdayMenu = false"
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
                    <th>靴局</th>
                    <th>源始数据</th>
                    <th>处理数据</th>
                    <th>保存时间</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, index) in 10">
                    <td>{{ index + 1 }}</td>
                    <td>辉煌一台</td>
                    <td>2024-06-01</td>
                    <td>5-10</td>
                    <td>庄: 1000, 闲: 500</td>
                    <td>庄: 900, 闲: 600</td>
                    <td>2024-06-01</td>
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

const workdayMenu = ref(false);
const workday = ref(new Date());
</script>