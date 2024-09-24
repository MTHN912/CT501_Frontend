<template>
  <div class="admin-dashboard">
    <Sidebar />
    <AdminUser />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Sidebar from "../../../components/Admin/Layouts/Sidebar.vue";
import AdminUser from "../../../components/Admin/User/AdminUser.vue";
export default {
  components: {
    Sidebar,
    AdminUser,
  },
};
</script>
<style scoped>
.admin-dashboard {
  display: flex;
}
</style>
