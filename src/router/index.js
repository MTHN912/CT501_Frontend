import { createRouter, createWebHistory } from "vue-router";
import DishDetail from "../components/Menu/DishDetail.vue";
import ProfileView from "../views/Profile.vue";
import AboutView from "../views/About.vue";
import CartView from "../views/Cart.vue";
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
    path: '/dish/:id',
    name: 'DishDetail',
    component: DishDetail,
    props: true,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartView,
    props: true,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    props: true,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token');
      if (token) {
        // Nếu có token, chuyển hướng về trang chủ
        next('/');
      } else {
        // Nếu không có token, cho phép vào trang login
        next();
      }
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token');
      if (token) {
        // Nếu có token, chuyển hướng về trang chủ
        next('/');
      } else {
        // Nếu không có token, cho phép vào trang register
        next();
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
