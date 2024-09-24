<template>
  <div class="admin-dashboard">
    <Sidebar />
    <AdminHome />
    <!-- Other components or content -->
  </div>
</template>

<script>
import AdminHome from "../../../components/Admin/Home/AdminHome.vue";
import Sidebar from "../../../components/Admin/Layouts/Sidebar.vue";
export default {
  components: {
    Sidebar,
    AdminHome,
  },
};
</script>
<style scoped>
.admin-dashboard {
  display: flex;
}
</style>
