import { createRouter, createWebHistory } from "vue-router";
import AboutView from "../views/About.vue";
import AdminCategory from "../views/Admin/Category/Category.vue";
import AdminDish from "../views/Admin/Dish/AdminDish.vue";
import AdminHome from "../views/Admin/Home/AdminHome.vue";
import AdminOrder from "../views/Admin/Order/AdminOrder.vue";
import AdminOrderPackage from "../views/Admin/Order/AdminOrderPackage.vue";
import AdminAddPackage from "../views/Admin/Package/AdminAddPackage.vue";
import AdminPackage from "../views/Admin/Package/AdminPackage.vue";
import AdminUser from "../views/Admin/User/AdminUser.vue";
import CartView from "../views/Cart.vue";
import ContactView from "../views/Contact.vue";
import DishDetail from "../views/DishDetail.vue";
import EventView from "../views/Event.vue";
import HomeView from "../views/Home.vue";
import LoginView from "../views/Login.vue";
import MenuView from "../views/Menu.vue";
import OrderDetail from "../views/Payment/OrderDetail.vue";
import OrderFailed from "../views/Payment/OrderFailed.vue";
import OrderList from "../views/Payment/OrderList.vue";
import CheckoutPage from "../views/Payment/Payment.vue";
import OrderPackage from "../views/Payment/PaymentPackage.vue";
import ProfileView from "../views/Profile.vue";
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
    path: '/:id',
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
    path: '/admin',
    name: 'Admin',
    component: AdminHome,
  },
  {
    path: '/admindishes',
    name: 'AdminDish',
    component: AdminDish,
  },
  {
    path: '/adminUsers',
    name: 'AdminUser',
    component: AdminUser,
  },
  {
    path: '/admincategorys',
    name: 'AdminCategory',
    component: AdminCategory,
  },
  {
    path: '/adminorder',
    name: 'AdminOrder',
    component: AdminOrder,
  },
  {
    path: '/adminpackageorder',
    name: 'AdminOrderPackage',
    component: AdminOrderPackage,
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage,
  },
  {
    path: '/orderlist',
    name: 'OrderList',
    component: OrderList,
  },
  {
    path: '/ordersuccess',
    name: 'OrderSuccess',
    component: () => import('@/views/Payment/OrderSuccess.vue'),
  },
  {
    path:'/orderfailed',
    name: 'OrderFailed',
    component: OrderFailed,
  },
  {
    path: '/:id-order',
    name: 'OrderDetail',
    component: OrderDetail,
    props: true,
  },
  {
    path: '/:id-package',
    name: 'CheckoutPackage',
    component: OrderPackage,
    props: true,
  },
  {
    path: '/adminaddpackage',
    name: 'AdminAddPackage',
    component: AdminAddPackage,
  },
  {
    path: '/adminpackage',
    name: 'AdminPackage',
    component: AdminPackage,
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
  scrollBehavior(to, from, savedPosition) {
    // Luôn cuộn lên đầu trang khi điều hướng
    return { top: 0 }; 
  },
});

export default router;
