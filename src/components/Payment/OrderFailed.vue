<template>
  <div class="order-failed-container">
    <h1>Giao dịch thất bại!</h1>
    <p>
      Rất tiếc, giao dịch của bạn không thành công. Vui lòng thử lại hoặc liên
      hệ với chúng tôi để được hỗ trợ.
    </p>
    <router-link to="/orderlist">
      <button class="btn btn-primary">Xem lại các đơn đặt tiệc</button>
    </router-link>
    <router-link to="/contact">
      <button class="btn btn-secondary">Liên hệ hỗ trợ</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "OrderFailed",
  mounted() {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được tải
  },
};
</script>

<style scoped>
.order-failed-container {
  margin-top: 120px;
  text-align: center;
}

h1 {
  color: #dc3545; /* Màu đỏ để biểu thị lỗi */
}

p {
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.btn {
  margin: 10px;
  padding: 10px 20px;
  font-size: 1rem;
}
</style>
