<template>
  <div class="admin-dashboard">
    <Sidebar />
    <AdminDish />
    <!-- Other components or content -->
  </div>
</template>

<script>
import AdminDish from "../../../components/Admin/Dish/AdminDish.vue";
import Sidebar from "../../../components/Admin/Layouts/Sidebar.vue";
export default {
  components: {
    Sidebar,
    AdminDish,
  },
}; 
</script>
<style scoped>
.admin-dashboard {
  display: flex;
}
</style>
