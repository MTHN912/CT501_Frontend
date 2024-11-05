<template>
  <div id="app">
    <Navbar />
    <SearchModal />
    <div class="main-content">
      <div class="sidebar">
        <Sidebar :activeMenuItem="activeMenuItem" @navigate="navigateTo" />
      </div>

      <div class="content">
        <FavouriteList />
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import SearchModal from "@/components/Layout/SearchModal.vue";
import Sidebar from "@/components/Payment/Sidebar.vue";
import FavouriteList from "@/components/Profie/FavouriteList.vue";

export default {
  components: {
    Navbar,
    SearchModal,
    FavouriteList,
    Footer,
    Sidebar,
  },
  data() {
    return {
      activeMenuItem: "FavouriteList", // Mặc định chọn OrderList
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
