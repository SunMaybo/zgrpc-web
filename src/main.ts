import { createApp } from "vue";
import App from "./App.vue";
import JsonViewer from 'vue3-json-viewer';
import { Edit } from '@element-plus/icons';
import 'vue3-json-viewer/dist/index.css';
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  
app.use(ElementPlus);
app.use(JsonViewer);
app.mount("#app");
