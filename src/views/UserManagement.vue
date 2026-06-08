<template>
    <div class="px-2 py-3">

        <div class="d-flex justify-space-between mb-2">
            <v-btn color="primary" class="mr-2" @click="dialog = true"><v-icon>mdi-plus</v-icon> 新增</v-btn>
        </div>

        <v-data-table-server
            v-model:page="page"
            v-model:items-per-page="perPage"
            :headers="headers"
            :items="users"
            :items-length="total"
            :loading="loading"
            density="compact"
            class="table1"
            :items-per-page-options="pageSizeOptions"
            @update:options="getUsers"
            hover
        >
            <template #item.registTime="{ item }">
                {{ $filters.formatFullDate(item.registTime) }}
            </template>
            <template #item.permissions="{ item }">
                {{ formatPermissions(item.permissions) }}
            </template>
            <template #item.actions="{ item }">
                <v-btn size="small" color="success" variant="tonal" class="mr-2" @click="openPermDialog(item)"><v-icon>mdi-cog</v-icon> 设定权限</v-btn>
            </template>
            <template #bottom></template>
        </v-data-table-server>

        <v-dialog v-model="dialog" max-width="450" persistent>
            <v-card title="新增用户">
                <v-card-text>
                    <v-text-field
                        v-model="obj.username"
                        label="用户名"
                        variant="outlined"
                        class="mb-2"
                        :error-messages="v$.username.$errors.map(e => e.$message)"
                        @input="v$.username.$touch"
                        @blur="v$.username.$touch"
                    />

                    <v-text-field
                        v-model="obj.password"
                        :type="isShow ? 'text' : 'password'"
                        prepend-inner-icon="mdi-key"
                        :append-inner-icon="isShow ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="isShow = !isShow"
                        variant="outlined"
                        label="密码"
                        :error-messages="v$.password.$errors.map(e => e.$message)"
                        @input="v$.password.$touch"
                        @blur="v$.password.$touch"
                        class="mb-5"
                    />

                    <div class="d-flex justify-end">
                        <v-btn text="取消" variant="tonal" :disabled="isSaving" @click="closeDialog" color="red" class="mr-2"></v-btn>
                        <v-btn text="确定" variant="tonal" :disabled="v$.$invalid" :loading="isSaving" @click="saveUser" color="primary"></v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="setPermDialog" max-width="450" persistent>
            <v-card title="设定权限">
                <v-card-text>
                    <v-text-field
                        v-model="permObj.username"
                        label="用户名"
                        variant="outlined"
                        class="mb-2"
                        readonly
                    />

                    <v-select
                        v-model="permObj.permissions"
                        :items="permissions"
                        item-title="name"
                        item-value="id"
                        label="权限"
                        variant="outlined"
                        multiple
                        :error-messages="vPerm$.permissions.$errors.map(e => e.$message)"
                        @input="vPerm$.permissions.$touch"
                        @blur="vPerm$.permissions.$touch"
                        class="mb-5"
                    ></v-select>

                    <div class="d-flex justify-end">
                        <v-btn text="取消" variant="tonal" :disabled="isSaving" @click="closeDialog" color="red" class="mr-2"></v-btn>
                        <v-btn text="确定" variant="tonal" :disabled="vPerm$.$invalid" :loading="isSaving" @click="savePermissions" color="primary"></v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { useToast } from 'vue-toastification';
import { REGISTER, GET_USER_INFO, GET_PERMISSIONS, ADD_PERMISSIONS, SET_USER_PERMISSIONS } from '../js/api/user';

const toast = useToast();
const userStore = useUserStore();
const pageSizeOptions = computed(() => userStore.tablePageSize);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const users = ref([]);
const loading = ref(false);
const headers = [
    { title: '序列', value: 'index', width: 100 },
    { title: '用户名', value: 'username' },
    { title: '权限', value: 'permissions' },
    { title: '创建时间', value: 'registTime' },
    { title: '操作', value: 'actions' },
];
const permissions = ref([
    { id: 0, name: '系统管理员' },
    { id: 1, name: ' 财务人员' },
    { id: 2, name: '主持人员' },
]);

const filters = ref({
    name: null,
    is_virtual: 0,
    is_hide: 0
});
const dialog = ref(false);
const setPermDialog = ref(false);
const isSaving = ref(false);
const isShow = ref(false);

const obj = ref({
    username: '',
    password: '',
});
const rules = ref({
    username: { required: helpers.withMessage('用户名不能为空', required) },
    password: { required: helpers.withMessage('密码不能为空', required), },
})
const v$ = useVuelidate(rules.value, obj.value);

const permObj = ref({
    username: '',
    permissions: []
});
const permRules = ref({
    username: { required: helpers.withMessage('用户名不能为空', required) },
    permissions: { required: helpers.withMessage('请至少选择一个权限', value => value.length > 0) },
})
const vPerm$ = useVuelidate(permRules.value, permObj.value);

const formatPermissions = (permStr) => {
    if (!permStr) return '-';
    const permIds = permStr.split(',').map(Number);
    return permissions.value
        .filter(perm => permIds.includes(perm.id))
        .map(perm => perm.name)
        .join(', ');
}

const closeDialog = () => {
    dialog.value = false;
    setPermDialog.value = false;
    obj.value.username = '';
    obj.value.password = '';
    permObj.value.username = '';
    permObj.value.permissions = [];
}

const openPermDialog = (user) => {
    permObj.value.username = user.username;
    permObj.value.permissions = user.permissions ? user.permissions.split(',').map(Number) : [];
    setPermDialog.value = true;
}

const getUsers = async () => {
    loading.value = true;
    try {
        const res = await GET_USER_INFO(page.value, perPage.value);
        if (res.code == 200) {
            users.value = res.data.map((user, index) => ({ ...user, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.length
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
        console.log(error);
        toast.error('获取用户列表失败');
    } finally {
        loading.value = false;
    }
}

const saveUser = async () => {
    if(v$.value.$invalid) return;
    isSaving.value = true;

    try {
        const res = await REGISTER(obj.value.username, obj.value.password);
        if (res.code == 200) {
            toast.success('用户创建成功');
            closeDialog();
            getUsers();
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
        toast.error('用户创建失败');
    } finally {
        isSaving.value = false;
    }
}

const getPermissions = async () => {
    try {
        const res = await GET_PERMISSIONS();
        if (res.code == 200) {
            permissions.value = res.data;
        }
    } catch (error) {
        toast.error('获取权限列表失败');
    }
}

const savePermissions = async () => {
    if(vPerm$.value.$invalid) return;
    isSaving.value = true;

    try {
        const res = await SET_USER_PERMISSIONS(permObj.value.username, permObj.value.permissions);
        if (res.code == 200) {
            toast.success('权限设置成功');
            closeDialog();
            getUsers();
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
        toast.error('权限设置失败');
    } finally {
        isSaving.value = false;
    }
}
</script>