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
            <template #loading>
                <v-skeleton-loader type="table-row@3"/>
            </template>
            <template #item.actions="{ item }">
                <v-btn size="small" color="success" variant="tonal" class="mr-2" @click="{}"><v-icon>mdi-pencil</v-icon> 编辑</v-btn>
            </template>
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
    </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useToast } from 'vue-toastification';
import { REGISTER, GET_USER_LIST } from '../js/api/user';

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
    { title: '角色', value: 'role' },
    { title: '创建时间', value: 'option_time' },
    { title: '操作', value: 'actions' },
];
const filters = ref({
    name: null,
    is_virtual: 0,
    is_hide: 0
});
const dialog = ref(false);
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

const closeDialog = () => {
    dialog.value = false;
    obj.value.username = '';
    obj.value.password = '';
}

const getUsers = async () => {
    loading.value = true;
    try {
        const res = await GET_USER_LIST(filters.value.name, filters.value.is_virtual, filters.value.is_hide, page.value, perPage.value);
        if (res.code == 200) {
            users.value = res.data.list.map((item, index) => ({ ...item, index: (page.value - 1) * perPage.value + index + 1 }));
            total.value = res.data.total;
        } else {
            toast.error(res.msg);
        }
    } catch (error) {
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
</script>