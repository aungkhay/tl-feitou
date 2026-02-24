import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App);

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