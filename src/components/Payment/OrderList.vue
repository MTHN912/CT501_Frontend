<template>
  <div class="container mt-4">
    <h2>Tiệc Của Bạn</h2>

    <div v-if="orders.length === 0" class="alert alert-info">
      Bạn chưa có đơn tiệc nào.
    </div>

    <div v-else>
      <div class="list-group">
        <div
          v-for="order in orders"
          :key="order._id"
          class="list-group-item list-group-item-action"
        >
          <h5>Mã Tiệc: #{{ order._id }}</h5>
          <p><strong>Loại Tiệc:</strong> {{ order.partyType }}</p>
          <p>
            <strong>Thời Gian Đặt:</strong> {{ formatDate(order.createdAt) }}
          </p>
          <p>
            <strong>Thời Gian Bắt Đầu Tiệc:</strong>
            {{ formatDate(order.eventDate) }}
          </p>
          <p><strong>Địa Chỉ Tiệc:</strong> {{ order.partyAddress }}</p>
          <p><strong>Trạng Thái Tiệc:</strong> {{ order.partyStatus }}</p>
          <p><strong>Trạng Thái Thanh Toán:</strong> {{ order.status }}</p>
          <p>
            <strong>Hình Thức Thanh Toán:</strong> {{ order.paymentMethod }}
          </p>
          <p><strong>Số Bàn:</strong> {{ order.tables }}</p>
          <p>
            <strong>Tổng Tiền:</strong>
            {{ order.totalPrice.toLocaleString() }} VND
          </p>
          <p><strong>Ghi Chú:</strong> {{ order.note }}</p>

          <!-- Danh sách món ăn -->
          <h3>Các món đã đặt</h3>
          <ul>
            <li v-for="(item, index) in order.items" :key="index">
              <strong>Món:</strong> {{ item.name }} - <strong>Giá:</strong>
              {{ item.price }} đ - <strong>Số lượng:</strong>
              {{ item.quantity }}
            </li>
          </ul>

          <!-- Nút hủy đơn -->
          <div v-if="order.partyStatus === 'Đã Hủy'">
            <button class="btn btn-secondary mt-2" disabled>Đã Hủy Tiệc</button>
          </div>
          <div v-else>
            <button @click="cancelOrder(order._id)" class="btn btn-danger mt-2">
              Hủy Tiệc
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "OrderList",
  data() {
    return {
      orders: [], // Mảng lưu trữ danh sách đơn hàng
    };
  },
  methods: {
    // Gọi API lấy danh sách đơn hàng của người dùng
    async fetchOrders() {
      try {
        // Thay thế userId bằng userId từ store hoặc session nếu cần
        const response = await axios.get(
          "http://localhost:3000/order/getOrdersByUserId"
        );
        this.orders = response.data; // Cập nhật danh sách đơn hàng
        await this.fetchDishDetails();
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      }
    },
    async fetchDishDetails() {
      try {
        // Duyệt qua tất cả các đơn hàng
        for (const order of this.orders) {
          const itemsWithDetails = await Promise.all(
            order.items.map(async (item) => {
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
          order.items = itemsWithDetails;
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin món ăn:", error);
      }
    },
    // Định dạng ngày tháng hiển thị cho người dùng
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString("vi-VN");
    },
    async cancelOrder(orderId) {
      if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
        try {
          // Gọi API PATCH để hủy đơn hàng với đường dẫn chính xác
          await axios.patch(
            `http://localhost:3000/order/orders/${orderId}/cancel`
          );
          alert("Đơn hàng đã được hủy thành công!");

          // Cập nhật lại danh sách đơn hàng sau khi hủy
          this.fetchOrders();
        } catch (error) {
          console.error("Lỗi khi hủy đơn hàng:", error);
          alert("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
        }
      }
    },
  },
  mounted() {
    // Gọi API lấy danh sách đơn hàng khi component được mount
    this.fetchOrders();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

h2 {
  margin-top: 110px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
}

.list-group {
  margin-top: 50px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.list-group-item {
  width: auto; /* Chiếm 30% chiều rộng để có 3 cột */
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column; /* Đặt các thành phần theo cột */
  justify-content: space-between; /* Đẩy nút bấm xuống dưới */
  transition: box-shadow 0.3s ease;
}

.list-group-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h5 {
  font-size: 1.25rem;
  color: #007bff;
}

p {
  margin: 5px 0;
  font-size: 0.95rem;
}

ul {
  padding-left: 20px;
  margin-bottom: 20px;
}

ul li {
  margin-bottom: 8px;
}

.alert-info {
  text-align: center;
  font-size: 1.1rem;
  padding: 10px;
  background-color: #e9f7fa;
  border: 1px solid #bde5f0;
  color: #31708f;
}
/* Cố định vị trí nút bấm ở cuối */
.list-group-item button {
  align-self: flex-end;
  margin-top: auto;
}
.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

@media (max-width: 1024px) {
  .list-group-item {
    width: 48%; /* Trên màn hình trung bình, hiển thị 2 đơn hàng trên một hàng */
  }
}

@media (max-width: 768px) {
  .list-group-item {
    width: 100%; /* Trên màn hình nhỏ hơn, đơn hàng chiếm toàn bộ chiều rộng */
  }
}
</style>
