<template>
  <!-- Hero Start -->
  <div class="container-fluid bg-light py-6 my-6 mt-0">
    <div class="container">
      <div class="row g-5 align-items-center">
        <div class="col-lg-7 col-md-12">
          <small
            class="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-4 animated bounceInDown"
            >Welcome to MTHN</small
          >
          <h1 class="display-1 mb-4 animated bounceInDown">
            Đến <span class="text-primary">MTHN</span>Restaurant Để Thưởng Thức Mỹ Vị
          </h1>
          <a
            href="http://localhost:3001/menu"
            class="btn btn-primary border-0 rounded-pill py-3 px-4 px-md-5 me-4 animated bounceInLeft"
            >Đặt Ngay</a
          >
          <a
            href="http://localhost:3001/about"
            class="btn btn-primary border-0 rounded-pill py-3 px-4 px-md-5 animated bounceInLeft"
            >Xem Thêm</a
          >
        </div>
        <div class="col-lg-5 col-md-12">
          <img
            src="img/hero.png"
            class="img-fluid rounded animated zoomIn"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
  <!-- Hero End -->
</template>

<script>
export default {
  name: "Hero",
};
</script>

<style scoped>
/* Add your CSS styles here, if necessary */
</style>
