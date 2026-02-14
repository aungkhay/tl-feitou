<template>
    <div class="pa-4">
        <div class="text-h6">上下分</div>
        <v-table density="compact" hover>
            <thead>
                <tr>
                    <th>序列</th>
                    <th>台号</th>
                    <th>会员昵称</th>
                    <th>剩余积分</th>
                    <th>冻结积分</th>
                    <th>初始积分</th>
                    <th>庄闲洗码</th>
                    <th>三宝洗码</th>
                    <th>庄闲赢亏</th>
                    <th>三宝赢亏</th>
                    <th>有效流水</th>
                    <th>代理商</th>
                    <th>日积分</th>
                    <th>总积分</th>
                    <th>注册时间</th>
                    <th>存款</th>
                    <th>欠积分</th>
                    <th>显示/隐藏</th>
                    <th>操作时间</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(record, index) in 10" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>辉煌一台</td>
                    <td>玩家一</td>
                    <td>5000</td>
                    <td>0</td>
                    <td>10000</td>
                    <td>300</td>
                    <td>200</td>
                    <td>-150</td>
                    <td>100</td>
                    <td>5000</td>
                    <td>代理商A</td>
                    <td>50</td>
                    <td>1500</td>
                    <td>2024-05-20 10:00:00</td>
                    <td>2000</td>
                    <td>0</td>
                    <td>显示</td>
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
</script>