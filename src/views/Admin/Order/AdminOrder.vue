<template>
  <div class="admin-dashboard">
    <Sidebar @toggle-sidebar="handleSidebarToggle" />
    <div :class="['admin-content', { collapsed: isSidebarCollapsed }]">
      <AdminOrder />
    </div>
  </div>
</template>

<script>
import Sidebar from "../../../components/Admin/Layouts/Sidebar.vue";
import AdminOrder from "../../../components/Admin/Order/AdminOrder.vue";

export default {
  components: {
    Sidebar,
    AdminOrder,
  },
  data() {
    return {
      isSidebarCollapsed: false,
    };
  },
  methods: {
    handleSidebarToggle(isCollapsed) {
      this.isSidebarCollapsed = isCollapsed;
    },
  },
};
</script>

<style scoped>
.admin-dashboard {
  display: flex;
}

.admin-content {
  margin-left: 250px; /* Tương ứng với độ rộng của sidebar */
  transition: margin-left 0.3s ease-in-out;
  width: calc(100% - 250px);
}

.admin-content.collapsed {
  margin-left: 80px; /* Khi sidebar thu nhỏ */
  width: calc(100% - 80px);
}
</style>
