<template>
    <v-dialog
        v-model="dialog"
        max-width="1000"
        persistent
    >
        <v-card>
            <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                <div>设置个人参数</div>
                <v-btn icon="mdi-close" @click="dialog = false" variant="text" density="compact"></v-btn>
            </v-card-title>
            <v-card-text>
                <v-row class="pa-0">
                    <v-col cols="12" sm="3">
                        <v-select
                            v-model="selectedDesk"
                            :items="desks"
                            label="选择操作台"
                            density="compact"
                            hide-details
                            variant="outlined"
                            color="primary"
                        />
                    </v-col>
                </v-row>
                <div class="mt-4 font-weight-bold text-red">没有<v-icon size="20">mdi-star-outline</v-icon>号为隐藏选择</div>
                <v-row class="pa-0">
                    <v-col cols="12" sm="3">
                        <div class="d-flex my-2">
                            <v-text-field
                                label="搜索用户"
                                density="compact"
                                hide-details
                                variant="outlined"
                                type="text"
                            ></v-text-field>
                            <v-btn class="ml-1" variant="tonal">搜索</v-btn>
                        </div>
                        <div class="border rounded pa-1 bg-grey-lighten-4" style="height: 270px; overflow-y: auto;">
                            <v-list density="compact" class="bg-grey-lighten-4">
                                <v-list-item @click="{}" class="text-red">
                                    <v-list-item-title><v-icon class="mr-3">mdi-star-outline</v-icon>小小</v-list-item-title>
                                </v-list-item>
                                <v-list-item  @click="{}" class="">
                                    <v-list-item-title><v-icon class="mr-3">mdi-star-outline</v-icon>周润发</v-list-item-title>
                                </v-list-item>
                                <v-list-item  @click="{}" class="">
                                    <v-list-item-title><v-icon class="mr-3">mdi-star-outline</v-icon>永不变</v-list-item-title>
                                </v-list-item>
                                <v-list-item  @click="{}" class="">
                                    <v-list-item-title><v-icon class="mr-3">mdi-star-outline</v-icon>左右为难</v-list-item-title>
                                </v-list-item>
                                <v-list-item  @click="{}" class="">
                                    <v-list-item-title><v-icon class="mr-3">mdi-star-outline</v-icon>有力</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </div>
                        <div class="mt-2">
                            <div class="text-right text-primary font-weight-bold">周润发 <span>[代理]</span></div>
                            <div class="d-flex justify-space-between">
                                <div>剩余分: <span class="text-primary">20100</span></div>
                                <div>初始分: <span class="text-primary">20100</span></div>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="9">
                        <div class="mb-5">个人占成设置</div>
                        <v-row>
                            <v-col cols="12" sm="3">
                                <div>闲庄个人占成比率</div>
                                <v-text-field
                                    density="compact"
                                    hide-details
                                    variant="outlined"
                                    type="number"
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div>闲庄个人占成上限</div>
                                <v-text-field
                                    density="compact"
                                    hide-details
                                    variant="outlined"
                                    type="number"
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div>三宝个人占成比率</div>
                                <v-text-field
                                    density="compact"
                                    hide-details
                                    variant="outlined"
                                    type="number"
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <v-btn color="primary" class="mt-6">设置全部个人占成</v-btn>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" sm="3">
                                <div>兑换类型</div>
                                <v-select
                                    :items="exchangeTypes"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div>个人积分兑换比率</div>
                                <v-text-field
                                    density="compact"
                                    hide-details
                                    variant="outlined"
                                    type="number"
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div>兑换开始计算时间</div>
                                <v-menu
                                    v-model="exchangeStartDateMenu"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                >
                                    <template #activator="{ props }">
                                        <v-text-field
                                            v-bind="props"
                                            :model-value="formattedDate(exchangeStartDate)"
                                            readonly
                                            variant="outlined"
                                            density="compact"
                                            hide-details
                                        />
                                    </template>

                                    <v-date-picker
                                        v-model="exchangeStartDate"
                                        @update:model-value="exchangeStartDateMenu = false"
                                    />
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <v-btn color="primary" class="mt-6">设置全部个人占成</v-btn>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" sm="3">
                                <div>反水类型</div>
                                <v-select
                                    :items="fanshuiTypes"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div>反水比率</div>
                                <v-text-field
                                    density="compact"
                                    hide-details
                                    variant="outlined"
                                    type="number"
                                />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div>反水开始计算时间</div>
                                <v-menu
                                    v-model="fanshuiStartDateMenu"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                >
                                    <template #activator="{ props }">
                                        <v-text-field
                                            v-bind="props"
                                            :model-value="formattedDate(fanshuiDate)"
                                            readonly
                                            variant="outlined"
                                            density="compact"
                                            hide-details
                                        />
                                    </template>
                                    <v-date-picker
                                        v-model="fanshuiDate"
                                        @update:model-value="fanshuiStartDateMenu = false"
                                    />
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" sm="3">
                                <div>是否启动兑换</div>
                                <v-select
                                    :items="startStopOptions"
                                    density="compact"
                                    variant="outlined"
                                    hide-details
                                />
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-center my-3">
                <v-btn color="grey-darken-4" variant="tonal">历史记录</v-btn>
                <v-btn color="primary" variant="tonal">保存设置</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { formattedDate } from '../../js/common';

const dialog = ref(false);
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});
const desks = ref([
    { title: '辉煌一台' }
]);
const selectedDesk = ref(null);
const exchangeTypes = ref([
    { title: '积分' },
    { title: '庄闲洗码' },
    { title: '庄闲+三宝洗码' },
]);
const exchangeStartDateMenu = ref(false);
const exchangeStartDate = ref(null);
const fanshuiTypes = ref([
    { title: '庄闲输赢' },
    { title: '庄闲+三宝输赢' },
]);
const startStopOptions = ref([
    { title: '启动' },
    { title: '不启动' },
]);
const fanshuiStartDateMenu = ref(false);
const fanshuiDate = ref(null);

const emit = defineEmits(['update:modelValue']);
watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
});
watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
});

</script>