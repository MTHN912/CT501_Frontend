<template>
  <div id="app">
    <Navbar />
    <div class="main-content">
      <div class="sidebar">
        <Sidebar :activeMenuItem="activeMenuItem" @navigate="navigateTo" />
      </div>

      <div class="content">
        <OrderListPackage />
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import OrderListPackage from "@/components/Payment/OrderListPackage.vue";
import Sidebar from "@/components/Payment/Sidebar.vue";

export default {
  components: {
    Navbar,
    OrderListPackage,
    Footer,
    Sidebar, // Đăng ký Sidebar
  },
  data() {
    return {
      activeMenuItem: "OrderListPackage", // Mặc định chọn OrderList
    };
  },
  methods: {
    navigateTo(component) {
      this.activeMenuItem = component;
      this.$router.push({ name: component }); // Điều hướng khi click vào Sidebar
    },
  },
};
</script>

<style scoped>
.main-content {
  display: flex;
  gap: 20px;
  padding: 20px;
}
.sidebar {
  margin-top: 120px;
}
.content {
  flex: 3;
}
</style>
