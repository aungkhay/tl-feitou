<template>
    <v-dialog
        v-model="dialog"
        max-width="500"
        persistent
    >
        <v-card>
            <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                <div>设置银行卡快捷方式</div>
                <v-btn icon="mdi-close" @click="dialog = false" variant="text" density="compact"></v-btn>
            </v-card-title>
            <v-card-text class="pa-3">
                <v-table>
                    <thead>
                        <tr>
                            <th>卡类型</th>
                            <th>姓名</th>
                            <th>状态</th>
                            <th>银行卡快捷方式</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="n in 5" :key="n">
                            <td>下分</td>
                            <td>小小</td>
                            <td class="text-green">正常</td>
                            <td>
                                <v-switch
                                    inset
                                    color="primary"
                                    density="compact"
                                    hide-details
                                ></v-switch>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref,watch } from 'vue';
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
</script>