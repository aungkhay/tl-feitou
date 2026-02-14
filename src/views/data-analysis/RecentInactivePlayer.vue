<template>
    <div class="pa-4">
        <div class="text-h6">最近没有玩过玩家</div>
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
                    <th>台名称</th>
                    <th>玩家昵称</th>
                    <th>金额</th>
                    <th>总充值</th>
                    <th>总提款</th>
                    <th>庄闲/龙虎洗码</th>
                    <th>N宝洗码</th>
                    <th>庄闲/龙虎赢亏</th>
                    <th>N宝赢亏</th>
                    <th>有效流</th>
                    <th>注册时间</th>
                    <th>最近上线时间</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, index) in 10" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>辉煌一台</td>
                    <td>玩家{{ index + 1 }}</td>
                    <td>1000</td>
                    <td>5000</td>
                    <td>3000</td>
                    <td>1500</td>
                    <td>800</td>
                    <td>200</td>
                    <td>-100</td>
                    <td>2300</td>
                    <td>2024-05-01 10:00:00</td>
                    <td>2024-05-15 15:30:00</td>
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
</script>