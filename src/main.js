import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

library.add(faFacebookF, faGoogle);

createApp(App).use(router).mount("#app");
app.component('font-awesome-icon', FontAwesomeIcon);

