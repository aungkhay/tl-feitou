import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App);

import moment from 'moment';
app.config.globalProperties.$filters = {
    formatFullDate(date) {
        if (!date) return '-';
        return moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss');
    },
    formatDate(date) {
        if (!date) return '-';
        return moment(new Date(date)).format('YYYY-MM-DD');
    },
    check10MinuteAgo(date) {
        if (!date) return false;
        const now = moment();
        const target = moment(new Date(date));
        return now.diff(target, 'minutes') <= 10;
    }
}

// Toast
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
const options = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
}

app.use(pinia)
app.use(vuetify)
app.use(router)
app.use(Toast, options);
app.mount('#app')