<template>
  <div class="order-success-container">
    <h1>Đặt tiệc thành công!</h1>
    <p>
      Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi. Chúng tôi sẽ giúp buổi tiệc
      của bạn hoàn hảo nhất có thể.
    </p>
    <router-link to="/orderlist">
      <button class="btn btn-primary">Xem lại đơn đặt tiệc</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "OrderSuccess",
  mounted() {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi trang được tải
  },
};
</script>

<style scoped>
.order-success-container {
  margin-top: 120px;
  text-align: center;
  font-family: "Arial", sans-serif;
  background-color: #fdf3e6; /* Màu nền nhẹ để nổi bật nội dung */
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Hiệu ứng shadow nhẹ */
  max-width: 600px;
  margin: 150px auto; /* Căn giữa nội dung */
}

h1 {
  color: #28a745;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  color: #555555;
  margin-bottom: 30px;
}

button {
  background-color: #ffbf00; /* Màu nút vàng nhạt */
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #ffa500; /* Màu nút khi hover */
}

.btn {
  text-decoration: none;
}
</style>
