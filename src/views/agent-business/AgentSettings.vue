<template>
    <div class="pa-4">
        <div class="text-h6">代理设置</div>
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
                    <v-text-field
                        item-title="title"
                        item-value="value"
                        label="代理名称"
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
                    <th>代理名称</th>
                    <th>代理人数</th>
                    <th>总积分</th>
                    <th>总输分</th>
                    <th>返佣金额</th>
                    <th>结算日期</th>
                    <th>操作人</th>
                    <th>当前积分</th>
                    <th>初始积分</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in 10" :key="i">
                    <td>{{ i }}</td>
                    <td>代理A</td>
                    <td>50</td>
                    <td>100000</td>
                    <td>5000</td>
                    <td>2000</td>
                    <td>2024-06-15</td>
                    <td>管理员</td>
                    <td>95000</td>
                    <td>100000</td>
                    <td><v-btn small color="primary" size="small">编辑</v-btn></td>
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