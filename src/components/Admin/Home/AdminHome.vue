<template>
  <div class="content">
    <h1 class="text-center text-primary mb-5">Chào Mừng Đến Admin Dashboard</h1>
    <p class="text-center">
      Chọn một trong các mục điều hướng ở thanh bên để quản lý hệ thống.
    </p>
  </div>
</template>

<script>
export default {
  name: "AdminHome",
};
</script> 

<style scoped>
.content {
  flex: 1;
  padding: 50px;
  background-color: #f9fafb;
}

.welcome-title {
  font-size: 2.5rem;
  font-family: "Georgia", serif;
  color: #ff8800;
  text-align: center;
}

.welcome-subtitle {
  font-size: 1.2rem;
  text-align: center;
  color: #666;
  margin-top: 10px;
}
</style>
