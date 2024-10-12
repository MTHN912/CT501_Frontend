<template>
  <div class="background-container">
    <div class="left-content">
      <!-- Phần nội dung quảng cáo hoặc hình ảnh nền bên trái -->
      <img
        src="../../../public/img/Screenshot 2024-10-10 180749.png"
        alt="Promo"
        class="promo-image"
      />
      <!-- <h2 class="promo-title">10/10 Ngày Siêu Mua Sắm</h2>
      <p class="promo-subtitle">
        Săn voucher đến 70%, phí ship 0 đồng, cơ hội trúng 99 iPhone
      </p> -->
    </div>

    <div class="right-content">
      <!-- Nơi sẽ chèn form đăng nhập hoặc đăng ký -->
      <slot></slot>
      <!-- Form sẽ được chèn vào đây từ component khác -->
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap");

.background-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.left-content {
  flex: 1;
  background-color: #d4a762; /* Màu nền cho phần quảng cáo bên trái */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.promo-image {
  width: 80%;
  max-width: 400px;
  height: auto;
}

.promo-title {
  font-size: 36px;
  color: #fff;
  margin: 20px 0;
  text-align: center;
}

.promo-subtitle {
  font-size: 16px;
  color: #fff;
  text-align: center;
}

.right-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 20px;
}

.right-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1); /* Lớp phủ nhạt để làm nổi bật form */
  z-index: 1;
}

.right-content > * {
  z-index: 2; /* Đảm bảo nội dung form nằm trên lớp phủ */
}
</style>
