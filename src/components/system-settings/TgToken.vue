<template>
    <v-dialog
        v-model="dialog"
        max-width="400"
        persistent
    >
      <v-card title="设置飞机Token">
            <v-card-text>
                <v-text-field 
                    v-model="obj.token"
                    label="机器人Token" 
                    type="text"
                />
                <v-text-field 
                    v-model="obj.group_id"
                    label="群驵ID" 
                    type="text"
                />
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text="取消"
                    variant="tonal"
                    @click="dialog = false"
                    color="red"
                ></v-btn>
                <v-btn
                    text="保存设置"
                    variant="tonal"
                    @click="save"
                    color="primary"
                ></v-btn>
            </v-card-actions>
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

const obj = ref({
    token: '',
    group_id: '',
});

const emit = defineEmits(['update:modelValue']);
watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
});
watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
});

const save = () => {  
}
</script>