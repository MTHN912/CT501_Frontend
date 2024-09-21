import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createApp } from "vue";
import '../public/css/style.css';
import App from "./App.vue";
import router from "./router";
import store from './store';

library.add(faFacebookF, faGoogle);

const app = createApp(App); // Khởi tạo app

app.use(router);
app.use(store); // Sử dụng store trước khi mount

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount("#app"); // Mount app sau khi cấu hình router, store, và các component
