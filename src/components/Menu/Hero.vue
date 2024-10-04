<template>
  <!-- Hero Start -->
  <div class="container-fluid bg-light py-6 my-6 mt-0">
    <div class="container text-center animated bounceInDown">
      <h1 class="display-1 mb-4">{{ title }}</h1>
      <ol class="breadcrumb justify-content-center mb-0 animated bounceInDown">
        <li class="breadcrumb-item">
          <a href="http://localhost:3001/">{{ homeText }}</a>
        </li>
        <!-- <li class="breadcrumb-item">
          <a href="#">{{ pagesText }}</a>
        </li> -->
        <li class="breadcrumb-item text-dark" aria-current="page">
          {{ currentPage }}
        </li>
      </ol>
    </div>
  </div>
  <!-- Hero End -->
</template>

<script>
export default {
  data() {
    return {
      title: "Danh Sách Món Ăn", // Tiêu đề của Hero
      homeText: "Home", // Văn bản cho mục breadcrumb đầu tiên
      // pagesText: "Pages",
      currentPage: "Menu", // Trang hiện tại
    };
  },
};
</script>

<style scoped>
/* Thêm style tùy chỉnh nếu cần */
.container {
  margin-top: 100px;
}
</style>
