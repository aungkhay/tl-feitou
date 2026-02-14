<template>
    <div class="pa-4">
        <div class="text-h6">费用登记</div>
        <div class="mb-4 border rounded-lg pa-4 bg-grey-lighten-4">
            <v-row>
                <v-col cols="12" sm="2">
                    <v-select
                        :items="expenseTypes"
                        item-title="title"
                        item-value="value"
                        label="项目名称"
                        density="compact"
                        variant="outlined"
                        hide-details
                    />
                </v-col>
                <v-col cols="12" sm="2">
                    <v-select
                        :items="[]"
                        item-title="title"
                        item-value="value"
                        label="操作人"
                        density="compact"
                        variant="outlined"
                        hide-details
                    />
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
        <div class="d-flex mb-2">
            <v-btn color="primary" class="mr-2" @click="dialog = true"><v-icon>mdi-plus</v-icon> 新增</v-btn>
            <v-btn color="primary"><v-icon>mdi-file-excel</v-icon> 导出表格</v-btn>
        </div>
        <v-table density="compact" hover>
            <thead>
                <tr>
                    <th>序列</th>
                    <th>项目名称</th>
                    <th>操作金额</th>
                    <th>经手人</th>
                    <th>操作时间</th>
                    <th>操作人</th>
                    <th>银行卡姓名</th>
                    <th>卡类型</th>
                    <th>操作前金额</th>
                    <th>剩余金额</th>
                    <th>工作1</th>
                    <th>备注</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, index) in 10" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>转账手续费</td>
                    <td>300</td>
                    <td>李四</td>
                    <td>2024-06-01 14:30:00</td>
                    <td>张三</td>
                    <td>张三的储蓄卡</td>
                    <td>储蓄卡</td>
                    <td>5000</td>
                    <td>4700</td>
                    <td>2024-06-01</td>
                    <td>购买打印纸和墨盒</td>
                    <td>
                        <v-btn size="small" color="primary" class="mr-2"><v-icon>mdi-pencil</v-icon> 编辑</v-btn>
                        <v-btn size="small" color="red"><v-icon>mdi-delete</v-icon> 删除</v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-pagination 
            :length="4"
            density="compact"
            color="primary"
            class="mt-4"
        />

        <v-dialog
            v-model="dialog"
            max-width="400"
            persistent
        >
            <v-card>
                <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                    <div>添加办公费用</div>
                    <v-btn icon="mdi-close" @click="dialog = false" variant="text" density="compact"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-select
                        label="项目名称"
                        :items="expenseTypes"
                        density="compact"
                        variant="outlined"
                    />
                    <v-select
                        label="收付卡"
                        :items="[]"
                        density="compact"
                        variant="outlined"
                    />
                    <v-text-field
                        label="金额"
                        density="compact"
                        variant="outlined"
                    />
                    <v-select
                        label="经手人"
                        :items="[]"
                        density="compact"
                        variant="outlined"
                    />
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
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="workday"
                            @update:model-value="workdayMenu = false"
                        />
                    </v-menu>
                    <v-textarea
                        label="备注"
                        density="compact"
                        variant="outlined"
                        rows="3"
                    ></v-textarea>

                    <div class="d-flex justify-end">
                        <v-btn color="primary">新增保存</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { formattedDate } from '../js/common';

const dialog = ref(false);
const expenseTypes = ref([
    { title: '全部', value: 'all' },
    { title: '转账手续费', value: 'transfer_fee' },
    { title: '服务器费', value: 'server_cost' },
    { title: '办公用品费', value: 'office_supplies' },
    { title: '团队拓展费', value: 'team_building' },
    { title: '生活费用', value: 'living_expenses' },
    { title: '返点费用', value: 'rebate' },
    { title: '其它费用', value: 'other_expense' },
    { title: '其它收入', value: 'other_income' },
]);
const workdayMenu = ref(false);
const workday = ref(new Date());
const fromDateMenu = ref(false);
const fromDate = ref(new Date());
const toDateMenu = ref(false);
const toDate = ref(new Date());
</script>