<template>
    <v-dialog
        v-model="dialog"
        max-width="800"
        persistent
    >
        <v-card>
            <v-card-title class="text-h6 d-flex justify-space-between bg-grey-lighten-3 pa-3">
                <div>玩家复制</div>
                <v-btn icon="mdi-close" @click="dialog = false" variant="text" density="compact"></v-btn>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6" >
                        <div class="border rounded-lg pa-3">
                            <div>源台</div>
                            <v-select
                                v-model="obj.source_desk"
                                :items="groups"
                                item-title="group_nickname"
                                item-value="group_nickname"
                                density="compact"
                                variant="outlined"
                                color="primary"
                                :error-messages="v$.source_desk.$errors.map(e => e.$message)"
                                @input="v$.source_desk.$touch"
                                @blur="v$.source_desk.$touch"
                            >
                                <template #item="{ props }">
                                    <v-list-item v-bind="props" density="comfortable" />
                                </template>
                            </v-select>
                            <div class="mt-3">没有<v-icon size="18" color="red">mdi-star-outline</v-icon>号为隐藏选择【数量:{{ originDeskUserList.length }}】</div>
                            <div 
                                class="border rounded-lg py-1 mt-3 overflow-y-auto" 
                                style="height: 350px;"
                                @dragover.prevent
                                @drop="handleDrop('origin')"
                            >
                                <v-list>
                                    <v-list-item
                                        v-for="(user, index) in originDeskUserList"
                                        :key="index"
                                        density="compact"
                                        class="user-drag-item"
                                        @mousedown="startDrag($event, user, index, 'origin')"
                                    >
                                        <template v-slot:prepend>
                                            <v-icon size="small" class="drag-handle">mdi-drag</v-icon>
                                        </template>
                                        <v-list-item-title class="pa-0"><v-icon size="18" :color="user.is_hide ? 'grey-lighten-2' : 'red'" class="mr-2">mdi-star-outline</v-icon>{{ user.playername }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <div class="border rounded-lg pa-3">
                            <div>目的台</div>
                            <v-select
                                v-model="obj.target_desk"
                                :items="groups"
                                item-title="group_nickname"
                                item-value="group_nickname"
                                density="compact"
                                variant="outlined"
                                color="primary"
                                :error-messages="v$.target_desk.$errors.map(e => e.$message)"
                                @input="v$.target_desk.$touch"
                                @blur="v$.target_desk.$touch"
                            />
                            <div class="mt-3">没有<v-icon size="18" color="red">mdi-star-outline</v-icon>号为隐藏选择【数量:{{ targetDeskUserList.length }}】</div>
                            <div 
                                class="border rounded-lg py-1 mt-3 overflow-y-auto" 
                                style="height: 350px;"
                                @dragover.prevent
                                @drop="handleDrop('target')"
                            >
                                <v-list>
                                    <v-list-item
                                        v-for="(user, index) in targetDeskUserList"
                                        :key="index"
                                        density="compact"
                                    >
                                        <template v-slot:prepend>
                                            <v-icon size="small" class="drag-handle">mdi-drag</v-icon>
                                        </template>
                                        <template v-slot:append>
                                            <v-icon v-if="user.isToCopy" size="small" icon="mdi-trash-can-outline" color="red" class="cursor-pointer" @click="removeTargetUser(index)"></v-icon>
                                        </template>
                                        <v-list-item-title><v-icon size="18" :color="user.is_hide ? 'grey-lighten-2' : 'red'" class="mr-2">mdi-star-outline</v-icon>{{ user.playername }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                                <div class="text-center text-grey pa-4">
                                    拖拽用户到这里
                                </div>
                            </div>
                        </div>
                    </v-col>
                </v-row>
                <div class="mt-3 d-flex justify-center">
                    <v-btn color="error" class="mr-2" :disabled="isSaving" @click="resetForm"><v-icon>mdi-refresh</v-icon> 重置</v-btn>
                    <v-btn color="primary" :disabled="isSaving || v$.$invalid" :loading="isSaving" @click="save"><v-icon>mdi-content-save</v-icon> 保存</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref,watch } from 'vue';
import { useUserStore } from '../../stores/user';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { GET_GROUP_PLAYERS } from '../../js/api/player_option';
import { useToast } from 'vue-toastification';
import { PLAYER_COPY } from '../../js/api/business_settings';

const toast = useToast();
const userStore = useUserStore();
const dialog = ref(false);
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
});

const isSaving = ref(false);
const obj = ref({
    source_desk: null,
    array_player_name: null,
    target_desk: null,
});
const rules = ref({
    source_desk: { required: helpers.withMessage('源台不能为空', required) },
    target_desk: {
        required: helpers.withMessage('目的台不能为空', required),
        notSameAsSource: helpers.withMessage('目的台不能与源台相同', value => value !== obj.value.source_desk)
    }
})
const v$ = useVuelidate(rules.value, obj.value);

const emit = defineEmits(['update:modelValue']);
watch(() => props.modelValue, (newVal) => {
    dialog.value = newVal;
});
watch(dialog, (newVal) => {
    emit('update:modelValue', newVal);
});

const groups = computed(() => userStore.groups);
const originDeskUserList = ref([]);
const targetDeskUserList = ref([]);

const draggedItem = ref(null);
const draggedIndex = ref(null);
const draggedSource = ref(null);
let draggedElement = null;

const startDrag = (event, user, index, source) => {
    const listItem = event.currentTarget;
    listItem.setAttribute('draggable', 'true');
    
    listItem.addEventListener('dragstart', (e) => {
        draggedItem.value = user;
        draggedIndex.value = index;
        draggedSource.value = source;
        draggedElement = listItem;
        
        // Set drag data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', listItem.innerHTML);
        
        // Add a class for visual feedback
        setTimeout(() => {
            listItem.style.opacity = '0.5';
        }, 0);
    }, { once: true });
    
    listItem.addEventListener('dragend', () => {
        listItem.style.opacity = '1';
        listItem.setAttribute('draggable', 'false');
    }, { once: true });
};

const handleDrop = (target) => {
    v$.value.target_desk.$touch();
    if (v$.value.target_desk.$invalid) return;

    if (!draggedItem.value || !draggedSource.value) return;
    
    // If dragging from origin to target
    if (draggedSource.value === 'origin' && target === 'target') {
        draggedItem.value.isToCopy = true;
        targetDeskUserList.value.push(draggedItem.value);
        // originDeskUserList.value.splice(draggedIndex.value, 1);
    }
    // If dragging from target back to origin
    else if (draggedSource.value === 'target' && target === 'origin') {
        originDeskUserList.value.push(draggedItem.value);
        targetDeskUserList.value.splice(draggedIndex.value, 1);
    }
    
    // Reset drag state
    draggedItem.value = null;
    draggedIndex.value = null;
    draggedSource.value = null;
};

const removeTargetUser = (index) => {
    const user = targetDeskUserList.value[index];
    targetDeskUserList.value.splice(index, 1);
};

const getPlayers = async (type) => {
    const res = await GET_GROUP_PLAYERS(type === 'origin' ? obj.value.source_desk : obj.value.target_desk);
    if (res.code == 200) {
        if (type === 'origin') {
            originDeskUserList.value = res.data;
        } else {
            targetDeskUserList.value = res.data;
        }
    }
}

const resetForm = () => {
    obj.value.source_desk = null;
    obj.value.target_desk = null;
    originDeskUserList.value = [];
    targetDeskUserList.value = [];
    v$.value.$reset();
}

const save = async () => {
    v$.value.$touch();
    if (v$.value.$invalid) return;
    isSaving.value = true;

    try {
        const players = targetDeskUserList.value.filter(user => user.isToCopy).map(user => user.playername);
        const res = await PLAYER_COPY(obj.value.source_desk, players, obj.value.target_desk);
        if (res && res.code === 200) {
            toast.success('玩家复制成功');
            resetForm();
        } else {
            toast.error(res.message || '玩家复制失败');
        }
    } catch (error) {
        toast.error('玩家复制失败');
    } finally {
        isSaving.value = false;
        resetForm();
    }
}

watch(() => obj.value.source_desk, (newVal) => {
    if (newVal) {
        getPlayers('origin');
    }
});
watch(() => obj.value.target_desk, (newVal) => {
    if (newVal) {
        targetDeskUserList.value = [];
        v$.value.target_desk.$touch();
        if (v$.value.target_desk.$invalid) return;
        getPlayers('target');
    }
});
</script>

<style scoped>
.user-drag-item {
    cursor: grab;
}

.user-drag-item:active {
    cursor: grabbing;
}

.drag-handle {
    cursor: grab;
    color: #999;
}

.drag-handle:hover {
    color: #666;
}
</style>