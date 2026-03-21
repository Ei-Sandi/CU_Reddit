import { createApp } from 'vue'
import { createPinia } from 'pinia' // 1. Import Pinia
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router' // 2. Import Router (We will create this file next)
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

app.use(createPinia()) // 3. Use Pinia
app.use(router)        // 4. Use Router
app.use(Antd)

app.mount('#app')
