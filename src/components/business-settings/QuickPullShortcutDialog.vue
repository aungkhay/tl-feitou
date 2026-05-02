<template>
    <v-dialog
        v-model="dialog"
        max-width="350"
        persistent
    >
        <v-card>
            <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                <div>设置拉取端快捷方式</div>
                <v-btn icon="mdi-close" @click="dialog = false" variant="text" density="compact"></v-btn>
            </v-card-title>
            <v-card-text>
                <v-autocomplete
                    :items="groups"
                    label="选择操作台"
                    item-title="group_nickname"
                    item-value="group_nickname"
                    density="compact"
                    variant="outlined"
                    hide-details
                    color="primary"
                    autocomplete="off"
                >
                </v-autocomplete>
            </v-card-text>
            <v-card-actions class="d-flex justify-center mb-3">
                <v-btn color="primary" variant="tonal">确认</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref,watch, computed } from 'vue';
import { useUserStore } from '../../stores/user';
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

const userStore = useUserStore();
const groups = computed(() => userStore.groups);

const emit = defineEmits(['update:modelValue']);
watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
});
watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
});
</script>