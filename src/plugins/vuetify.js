import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import { zhHans } from 'vuetify/locale'

export default createVuetify({
    locale: {
        locale: 'zh-CN',
        messages: { 'zh-CN': zhHans },
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi },
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    // primary: '#407bff',
                }
            },
            dark: {
                colors: {
                    // primary: '#407bff',
                }
            }
        }
    }
})