<template>
    <v-dialog
        v-model="dialog"
        max-width="350"
        persistent
    >
      <v-card title="退出">
            <v-card-text>您确定要退出吗？</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text="取消"
                    variant="tonal"
                    @click="dialog = false"
                    color="red"
                ></v-btn>
                <v-btn
                    text="确定"
                    variant="tonal"
                    @click="logout()"
                    color="primary"
                ></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import router from '../../router';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});
const emit = defineEmits(['update:modelValue']);
const dialog = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  dialog.value = newVal;
});

watch(dialog, (newVal) => {
  emit('update:modelValue', newVal);
});

const logout = () => {
    userStore.logout();
    router.push('/login');
    dialog.value = false;
};
</script>