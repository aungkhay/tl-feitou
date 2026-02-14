<template>
    <div class="pa-4">
        <div class="text-h6">洗手下注明细</div>
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
                        v-model="dateMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                    >
                        <template #activator="{ props }">
                            <v-text-field
                                v-bind="props"
                                label="日期"
                                variant="outlined"
                                density="compact"
                                readonly
                                :model-value="formattedDate(date)"
                                hide-details
                            ></v-text-field>
                        </template>

                        <v-date-picker
                            v-model="date"
                            @update:model-value="dateMenu = false"
                        />
                    </v-menu>
                </v-col>
                <v-col cols="12" sm="2">
                    <div class="d-flex">
                        <v-btn class="mr-2" color="primary"><v-icon>mdi-magnify</v-icon> 按天查询靴</v-btn>
                        <v-btn color="primary"><v-icon>mdi-refresh</v-icon> 重置</v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>
        <div>
            <v-btn color="primary" class="mb-4 mr-2">查看截图</v-btn>
            <v-btn color="primary" class="mb-4"><v-icon>mdi-file-excel</v-icon> 导出报表</v-btn>
        </div>

        <v-table density="compact" hover>
            <thead>
                <tr>
                    <th>序列</th>
                    <th>台号</th>
                    <th>局</th>
                    <th>闲</th>
                    <th>庄</th>
                    <th>闲对</th>
                    <th>庄对</th>
                    <th>幸运6</th>
                    <th>完美</th>
                    <th>个人完美</th>
                    <th>个闲</th>
                    <th>个庄</th>
                    <th>个闲对</th>
                    <th>个庄对</th>
                    <th>个和</th>
                    <th>任意</th>
                    <th>个人任意</th>
                    <th>庄闲对冲</th>
                    <th>个人幸运6</th>
                    <th>台庄闲</th>
                    <th>台三宝+幸运6</th>
                    <th>零头</th>
                    <th>上盘</th>
                    <th>上盘买</th>
                    <th>结果</th>
                    <th>开奖时间</th>
                    <th>总赢亏</th>
                    <th>庄闲赢亏</th>
                    <th>个赢亏</th>
                    <th>对冲赢亏</th>
                    <th>闲庄台赢亏</th>
                    <th>三宝+幸运6台赢亏</th>
                    <th>三宝+幸运6上盘赢亏</th>
                    <th>闲庄上盘赢亏</th>
                    <th>零头赢亏</th>
                    <th>飞牌金额</th>
                    <th>飞牌闲庄</th>
                    <th>飞牌输赢</th>
                    <th>上盘抽水赢亏</th>
                </tr>
            </thead>
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

const dateMenu = ref(false);
const date = ref(new Date());
</script>