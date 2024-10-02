<template>
  <div class="order-success-container">
    <h1>Đặt tiệc thành công!</h1>
    <p>
      Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi. Chúng tôi sẽ giúp buổi tiệc
      của bạn tuyệt nhất có thể.
    </p>

    <!-- Kiểm tra xem dữ liệu đã được tải xong chưa -->
    <div v-if="isLoading">
      <p>Đang tải thông tin đơn hàng...</p>
    </div>

    <!-- Hiển thị thông tin đơn hàng khi có dữ liệu -->
    <div v-else class="order-details">
      <h2>Thông tin đơn tiệc</h2>
      <p><strong>Loại Tiệc:</strong> {{ order.partyType }}</p>
      <p><strong>Số bàn:</strong> {{ order.tables }}</p>
      <p><strong>Ngày diễn ra:</strong> {{ formatDate(order.eventDate) }}</p>
      <p><strong>Trạng Thái Tiệc:</strong> {{ order.partyStatus }}</p>
      <p><strong>Địa chỉ:</strong> {{ order.partyAddress }}</p>
      <p><strong>Số điện thoại:</strong> {{ order.phoneNumber }}</p>
      <p><strong>Tổng tiền:</strong> {{ order.totalPrice }} đ</p>
      <p><strong>Ghi chú:</strong> {{ order.note }}</p>

      <h3>Các món đã đặt</h3>
      <ul>
        <li v-for="(item, index) in order.items" :key="index">
          <strong>Món:</strong> {{ item.name }} - <strong>Giá:</strong>
          {{ item.price }} đ - <strong>Số lượng:</strong> {{ item.quantity }}
        </li>
      </ul>

      <!-- Nút hủy đơn hàng -->
      <button @click="cancelOrder" class="cancel-button">Hủy đơn tiệc</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "OrderSuccess",
  data() {
    return {
      isLoading: true, // Để kiểm tra trạng thái tải dữ liệu
      order: null, // Chứa thông tin đơn hàng sau khi tải
    };
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleString("vi-VN");
    },
    // Gọi API để lấy thông tin đơn hàng
    async fetchOrder() {
      const orderId = this.$route.params.id; // Lấy orderId từ route params
      try {
        const response = await axios.get(
          `http://localhost:3000/order/orders/${orderId}`
        );
        this.order = response.data;
        await this.fetchDishDetails();
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
      } finally {
        this.isLoading = false; // Dừng trạng thái tải
      }
    },
    async fetchDishDetails() {
      const itemsWithDetails = await Promise.all(
        this.order.items.map(async (item) => {
          try {
            const response = await axios.get(
              `http://localhost:3000/dish/getDishById/${item.dishId}`
            );
            // Gộp thông tin món ăn với item
            return {
              ...item,
              name: response.data.name,
              price: response.data.price,
            };
          } catch (error) {
            console.error("Lỗi khi lấy thông tin món ăn:", error);
            return item; // Trả về item gốc nếu có lỗi
          }
        })
      );
      // Cập nhật order.items với chi tiết món ăn
      this.order.items = itemsWithDetails;
    },
    // Gọi API để hủy đơn hàng
    async cancelOrder() {
      const orderId = this.$route.params.id;
      try {
        // Gọi API để hủy đơn hàng
        await axios.patch(
          `http://localhost:3000/order/orders/${orderId}/cancel`
        );
        alert("Đơn hàng đã được hủy thành công!");
        // Điều hướng về trang chủ sau khi hủy
        this.$router.push({ name: "HomePage" });
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
      }
    },
  },
  async mounted() {
    // Gọi hàm fetchOrder để lấy thông tin đơn hàng khi component được tải
    await this.fetchOrder();
  },
};
</script>

<style scoped>
.order-success-container {
  margin-top: 100px;
  text-align: center;
  padding: 50px;
}

h1 {
  color: #28a745;
}

.order-details {
  margin-top: 30px;
  text-align: left;
}

.cancel-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #ff1a1a;
}
</style>
