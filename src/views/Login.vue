<template>
    <div class="fill-height" style="position: relative;">
        <div class="fill-height" id="loginbg"></div>
        <div class="fill-height" id="loginBlur"></div>
        <div class="fill-height w-100 d-flex justify-center align-center">
            <v-card class="rounded-lg" :class="xs ? 'w-100 pa-2' : mdAndDown ? 'w-50 pa-5' : 'w-25 pa-5'" id="loginform">
                <v-card-text>
                    <div class="text-h4 font-weight-bold">登录</div>
                    <form class="mt-10">
                        <v-text-field
                            v-model="user.username"
                            prepend-inner-icon="mdi-account"
                            variant="outlined"
                            label="用户名"
                            :error-messages="v$.username.$errors.map(e => e.$message)"
                            @input="v$.username.$touch"
                            @blur="v$.username.$touch"
                            @keyup="isUsernameError = false"
                        >
                        </v-text-field>
                        <v-text-field
                            v-model="user.password"
                            :type="isShow ? 'text' : 'password'"
                            prepend-inner-icon="mdi-key"
                            :append-inner-icon="isShow ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append-inner="isShow = !isShow"
                            variant="outlined"
                            label="密码"
                            :error-messages="v$.password.$errors.map(e => e.$message)"
                            @input="v$.password.$touch"
                            @blur="v$.password.$touch"
                            @keyup="isPasswordError = false"
                            class="my-5"
                        >
                        </v-text-field>
                        <v-btn 
                            block 
                            :color="isLoading || v$.$invalid ? 'grey-darken-4' : 'primary'"
                            size="x-large" 
                            class="mt-10"
                            type="submit" 
                            :loading="isLoading" 
                            :disabled="isLoading || v$.$invalid" 
                            @click="login"
                        >登录</v-btn>
                    </form>
                </v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { ref } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useRoute } from 'vue-router';
import { useToast } from "vue-toastification";
import { LOGIN } from '../js/api/auth';
import router from '../router';

const { mdAndUp, mdAndDown, xs, smAndDown } = useDisplay();
const toast = useToast();
const route = useRoute();
const isLoading = ref(false);
const isShow = ref(false);
const user = ref({
    username: '',
    password: '',
})
const isUsernameError = ref(false);
const isPasswordError = ref(false);

const rules = ref({
    username: { required: helpers.withMessage('用户名不能为空', required) },
    password: { required: helpers.withMessage('密码不能为空', required), },
})

const v$ = useVuelidate(rules.value, user.value);

const login = async () => {
    if(v$.value.$invalid) return;
    isLoading.value = true;

    const res = await LOGIN(user.value.username, user.value.password);
    if (res.code == 500) {
        toast.error(res.msg);
    } else {
        toast.success(res.msg);
        router.push({ name: 'PointInOut', replace: true });
    }
    isLoading.value = false;
}
</script>

<style>
    #loginbg {
        position: absolute;
        background-image: url('../assets/loginbg.jpg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        width: 100%; 
    }
    #loginBlur {
        position: absolute;
        background: #12121250;
        backdrop-filter: blur(5px);
        width: 100%; 
        height: 100%;
    }
    #loginform {
        background-color: rgba(128, 128, 128, 0.144);
        color: white;
    }
    #recaptcha-size {
        width: 100px;
        height: 100%;
        cursor: pointer;
    }
</style>