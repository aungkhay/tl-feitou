<template>
    <v-dialog
        v-model="dialog"
        max-width="450"
        persistent
    >
        <v-card>
            <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                <div>删除数据</div>
                <v-btn icon="mdi-close" @click="dialog = false" variant="text" density="compact"></v-btn>
            </v-card-title>
            <v-card-text>
                <div class="text-red">注意：删除数据后不能恢复， 建议导出表格后再操作。</div>
                <div class="mt-5">可删除数据的时间</div>
                <div class="d-flex align-center mt-3">
                    <div class="text-red">删除</div>
                    <div class="mx-3">
                        <v-menu
                            v-model="dateMenu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                        >
                            <template #activator="{ props }">
                                <v-btn
                                    v-bind="props"
                                    variant="outlined"
                                    block
                                    color="primary"
                                >
                                    {{ formattedDate(date) }}
                                </v-btn>
                            </template>

                            <v-date-picker
                                v-model="date"
                                @update:model-value="dateMenu = false"
                            />
                        </v-menu>
                    </div>
                    <div class="text-red">前的数据</div>
                </div>
                <v-divider class="my-5"></v-divider>
                <div class="d-flex justify-end">
                    <v-btn color="red">确认删除</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref,watch } from 'vue';
import { formattedDate } from '../../js/common';

const dialog = ref(false);
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});
const emit = defineEmits(['update:modelValue']);
watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
});
watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
});

const dateMenu = ref(false);
const date = ref(new Date());
</script>