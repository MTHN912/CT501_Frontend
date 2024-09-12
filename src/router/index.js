import { createRouter, createWebHistory } from "vue-router";
// import deleteCookie from "../utils/deleteCookie";
// import getCookieValue from "../utils/getCookie";
// import isTokenValid from "../utils/isTokenValid";
import AboutView from "../views/About.vue";
import ContactView from "../views/Contact.vue";
import EventView from "../views/Event.vue";
import HomeView from "../views/Home.vue";
import LoginView from "../views/Login.vue";
import MenuView from "../views/Menu.vue";
import RegisterView from "../views/Register.vue";
import ServicesView from "../views/Service.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/services",
    name: "services",
    component: ServicesView,
  },
  {
    path: "/events",
    name: "events",
    component: EventView,
  },
  {
    path: "/menu",
    name: "menu",
    component: MenuView,
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
