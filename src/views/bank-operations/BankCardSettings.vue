<template>
    <div class="pa-4">
        <div class="text-h6">银行卡设置</div>
        <div class="mb-4 border rounded-lg pa-4 bg-grey-lighten-4">
            <v-row>
                <v-col cols="12" sm="2">
                    <v-select
                        :items="[]"
                        item-title="title"
                        item-value="value"
                        label="操作人"
                        density="compact"
                        variant="outlined"
                        hide-details
                    ></v-select>
                </v-col>
                <v-col cols="12" sm="2">
                    <v-select
                        v-model="selectedType"
                        :items="cardTypes"
                        item-title="title"
                        item-value="value"
                        label="卡类型"
                        density="compact"
                        variant="outlined"
                        hide-details
                    ></v-select>
                </v-col>
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
                        v-model="obj.cardHolder"
                        label="银行卡姓名"
                        density="compact"
                        variant="outlined"
                        clearable
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
        <div class="d-flex align-center mb-4">
            <v-btn color="primary" @click="dialog = true" class="mr-2"><v-icon>mdi-plus</v-icon> 添加</v-btn>
            <v-btn color="primary"><v-icon>mdi-file-excel-outline</v-icon> 导出表格</v-btn>
        </div>
        <v-table density="compact" hover>
            <thead>
                <tr>
                    <th>列</th>
                    <th>卡类型</th>
                    <th>姓名</th>
                    <th>卡号</th>
                    <th>初始金额</th>
                    <th>上分金额</th>
                    <th>下分金额</th>
                    <th>转入金额</th>
                    <th>输出金额</th>
                    <th>手续费</th>
                    <th>剩余金额</th>
                    <th>办公金额</th>
                    <th>卡状态</th>
                    <th>操作人</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(card, index) in 10" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>储蓄卡</td>
                    <td>张三</td>
                    <td>6222020202020202020</td>
                    <td>10000</td>
                    <td>5000</td>
                    <td>2000</td>
                    <td>3000</td>
                    <td>1000</td>
                    <td>50</td>
                    <td>12000</td>
                    <td>8000</td>
                    <td>正常</td>
                    <td>管理员</td>
                    <td>
                        <v-btn size="small" color="primary" class="mr-1" @click="{}"><v-icon>mdi-pencil</v-icon> 编辑</v-btn>
                        <v-btn size="small" color="red" @click="{}"><v-icon>mdi-delete</v-icon> 删除</v-btn>
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
                    <div>添加银行卡</div>
                    <v-btn icon="mdi-close" @click="dialog = false" variant="text" density="compact"></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-select
                            v-model="selectedType"
                            :items="cardTypes"
                            item-title="title"
                            item-value="value"
                            label="卡类型"
                            density="compact"
                            variant="outlined"
                        ></v-select>
                        <v-text-field
                            v-model="obj.cardHolder"
                            label="姓名"
                            density="compact"
                            variant="outlined"
                        ></v-text-field>
                        <v-text-field
                            v-model="obj.cardNumber"
                            label="卡号"
                            density="compact"
                            variant="outlined"
                        ></v-text-field>
                        <v-text-field
                            v-model="obj.initialAmount"
                            label="初始金额"
                            density="compact"
                            variant="outlined"
                        ></v-text-field>
                        <v-select
                            v-model="selectedStatus"
                            :items="cardStatuses"
                            item-title="title"
                            item-value="value"
                            label="卡状态"
                            density="compact"
                            variant="outlined"
                        ></v-select>
                    </v-form>
                    <div class="d-flex justify-end">
                        <v-btn color="primary" @click="{}">保存</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref,watch } from 'vue';
const dialog = ref(false);

const cardTypes = ref([
    { title: '全部', value: 'all' },
    { title: '上分卡', value: 'top-up' },
    { title: '下分卡', value: 'withdrawal' },
    { title: '存储卡', value: 'storage' },
    { title: '中转卡', value: 'transfer' },
    { title: '财务卡', value: 'finance' },
    { title: '第三方', value: 'third-party' },
]);
const selectedType = ref('all');
const cardStatuses = ref([
    { title: '全部', value: 'all' },
    { title: '正常', value: 'normal' },
    { title: '冻结', value: 'frozen' },
    { title: '隐藏', value: 'hidden' },
]);
const selectedStatus = ref('all');
const obj = ref({
    cardNumber: '',
    cardHolder: '',
    initialAmount: '',
});
</script>