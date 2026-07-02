<template>
    <div class="px-2 py-3">
        <div class="d-flex justify-space-between mb-2">
            <v-btn color="primary" class="mr-2" @click="dialog = true"><v-icon>mdi-plus</v-icon> 新增</v-btn>
        </div>
        <v-row dense>
            <v-col cols="12" sm="4" md="3" lg="2" v-for="(ip, index) in ipList" :key="index">
                <v-card variant="outlined" color="grey-lighten-2" class="mb-2">
                    <v-card-text class="d-flex justify-space-between align-center">
                        <div class="text-black">{{ ip }}</div>
                        <div class="d-flex">
                            <v-btn color="primary" size="small" variant="tonal" class="mr-2" @click="editIP(index)">编辑</v-btn>
                            <v-btn color="error" size="small" variant="tonal" @click="deleteIP(index)">删除</v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="400" persistent>
            <v-card :title="selectedIPIndex === -1 ? '新增IP' : '编辑IP'">
                <v-card-text>
                    <v-text-field
                        v-model="selectedIP"
                        label="IP地址"
                        variant="outlined"
                        class="mb-2"
                        hide-details
                    />
                    <div v-if="isIPExists && selectedIPIndex === -1" class="text-error text-caption">IP地址已存在</div>
                    <div class="d-flex justify-end">
                        <v-btn variant="tonal" color="error" class="mr-2" @click="closeDialog">取消</v-btn>
                        <v-btn variant="tonal" color="primary" :disabled="!isIPValid || isIPExists" :loading="isSaving" @click="saveIP">{{ selectedIPIndex === -1 ? '新增' : '保存' }}</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="400" persistent>
            <v-card :title="'删除IP'">
                <v-card-text>
                    <div>确定要删除IP地址 {{ selectedIP }} 吗？</div>
                    <div class="d-flex justify-end mt-4">
                        <v-btn variant="tonal" color="error" class="mr-2" @click="closeDialog">取消</v-btn>
                        <v-btn variant="tonal" color="primary" :loading="isSaving" @click="confirmDeleteIP">删除</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { GET_WHITE_LIST, SET_WHITE_LIST } from '../js/api/user';
import { useToast } from 'vue-toastification';

const toast = useToast();
const dialog = ref(false);
const deleteDialog = ref(false);
const ipList = ref([]);
const selectedIP = ref('');
const selectedIPIndex = ref(-1);
const isSaving = ref(false);
const isIPValid = computed(() => {
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipPattern.test(selectedIP.value);
});
const isIPExists = computed(() => {
    return ipList.value.includes(selectedIP.value);
});

const closeDialog = () => {
    if (isSaving.value) return;
    dialog.value = false;
    selectedIP.value = '';
    selectedIPIndex.value = -1;
    deleteDialog.value = false;
};

const getIPList = async () => {
    try {
        const res = await GET_WHITE_LIST();
        if (res && res.code == 200) {
            ipList.value = res.data?.[0]?.ipWhileList.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0);
        }
    } catch (error) {
        console.error('Error fetching IP list:', error);
    }
}

const saveIP = async (ip) => {
    try {
        isSaving.value = true;

        const isEditOrDelete = selectedIPIndex.value !== -1;
        if (isEditOrDelete) {
            ipList.value[selectedIPIndex.value] = selectedIP.value;
        } else {
            ipList.value.push(selectedIP.value);
        }

        const res = await SET_WHITE_LIST(ipList.value.join(','));
        if (res && res.code == 200) {
            toast.success('IP地址已保存');
        } else {
            toast.error(res.message || '保存失败');
        }
        await getIPList();
    } catch (error) {
        console.error('Error saving IP:', error);
    } finally {
        isSaving.value = false;
        closeDialog();
    }
}

const editIP = (index) => {
    selectedIPIndex.value = index;
    selectedIP.value = ipList.value[index];
    dialog.value = true;
}

const deleteIP = async (index) => {
    deleteDialog.value = true;
    selectedIPIndex.value = index;
    selectedIP.value = ipList.value[index];
}

const confirmDeleteIP = async () => {
    if (selectedIPIndex.value === -1) return;
    try {
        isSaving.value = true;
        const allIPs = ipList.value.filter((_, index) => index !== selectedIPIndex.value);
        const res = await SET_WHITE_LIST(allIPs.join(','));
        if (res && res.code == 200) {
            toast.success('IP地址已删除');
        } else {
            toast.error(res.message || '删除失败');
        }
        await getIPList();
    } catch (error) {
        console.error('Error deleting IP:', error);
    } finally {
        isSaving.value = false;
        closeDialog();
    }
}

onMounted(() => {
    getIPList();
});
</script>