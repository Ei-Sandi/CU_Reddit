import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router/index' 
import { canDirective } from './directives/can'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)

app.use(createPinia()) 
app.use(router)        
app.use(Antd)
app.directive('can', canDirective)

app.mount('#app')
