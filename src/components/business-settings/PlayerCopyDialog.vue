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
                                :items="desks"
                                density="compact"
                                variant="outlined"
                                hide-details
                                color="primary"
                            />
                            <div class="mt-3">没有<v-icon size="18">mdi-star-outline</v-icon>号为隐藏选择【数量:{{ originDeskUserList.length }}】</div>
                            <div class="d-flex">
                                <v-text-field
                                    density="compact"
                                    class="flex-grow-1"
                                    hide-details
                                    variant="outlined"
                                ></v-text-field>
                                <v-btn class="ml-2" color="primary" variant="tonal">搜索</v-btn>
                            </div>
                            <div 
                                class="border rounded-lg py-1 mt-3 overflow-y-auto" 
                                style="height: 350px;"
                                @dragover.prevent
                                @drop="handleDrop('origin')"
                            >
                                <v-list>
                                    <v-list-item
                                        v-for="(user, index) in originDeskUserList"
                                        :key="user.username"
                                        density="compact"
                                        class="user-drag-item"
                                        @mousedown="startDrag($event, user, index, 'origin')"
                                    >
                                        <template v-slot:prepend>
                                            <v-icon size="small" class="drag-handle">mdi-drag</v-icon>
                                        </template>
                                        <v-list-item-title>{{ user.username }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <div class="border rounded-lg pa-3">
                            <div>目的台</div>
                            <v-select
                                :items="desks"
                                density="compact"
                                variant="outlined"
                                hide-details
                                color="primary"
                            />
                            <div class="mt-3">没有<v-icon size="18">mdi-star-outline</v-icon>号为隐藏选择【数量:{{ targetDeskUserList.length }}】</div>
                            <div class="d-flex">
                                <v-text-field
                                    density="compact"
                                    class="flex-grow-1"
                                    hide-details
                                    variant="outlined"
                                ></v-text-field>
                                <v-btn class="ml-2" color="primary" variant="tonal">搜索</v-btn>
                            </div>
                            <div 
                                class="border rounded-lg py-1 mt-3 overflow-y-auto" 
                                style="height: 350px;"
                                @dragover.prevent
                                @drop="handleDrop('target')"
                            >
                                <v-list>
                                    <v-list-item
                                        v-for="(user, index) in targetDeskUserList"
                                        :key="user.username"
                                        density="compact"
                                        class="user-drag-item"
                                        @mousedown="startDrag($event, user, index, 'target')"
                                    >
                                        <template v-slot:prepend>
                                            <v-icon size="small" class="drag-handle">mdi-drag</v-icon>
                                        </template>
                                        <v-list-item-title>{{ user.username }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                                <div v-if="targetDeskUserList.length === 0" class="text-center text-grey pa-4">
                                    拖拽用户到这里
                                </div>
                            </div>
                        </div>
                    </v-col>
                </v-row>
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

const originDeskMenu = ref(false);
const desks = ref([
    { title: '辉煌一台' }
]);
const targetDeskMenu = ref(false);
const originDeskUserList = ref([
    { username: '玩家一', status: '正常' },
    { username: '玩家二', status: '封停' },
    { username: '玩家三', status: '正常' },
    { username: '玩家四', status: '正常' },
    { username: '玩家五', status: '封停' },
]);
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
    if (!draggedItem.value || !draggedSource.value) return;
    
    // If dragging from origin to target
    if (draggedSource.value === 'origin' && target === 'target') {
        targetDeskUserList.value.push(draggedItem.value);
        originDeskUserList.value.splice(draggedIndex.value, 1);
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