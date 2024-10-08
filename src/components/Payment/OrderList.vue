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
          <p>
            <strong>Trạng Thái Tiệc:</strong>
            <span class="status">{{ order.partyStatus }}</span>
          </p>
          <p>
            <strong>Trạng Thái Thanh Toán:</strong>
            <span class="status">{{ order.status }}</span>
          </p>
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
          <h3 v-if="order.items.length">
            Các món đã đặt
            <span @click="toggleItems(order._id)" class="toggle-btn"
              >[{{ order.showItems ? "Ẩn" : "Xem" }}]</span
            >
          </h3>
          <ul v-if="order.showItems">
            <li v-for="(item, index) in order.items" :key="index">
              <strong>Món:</strong> {{ item.name }} - <strong>Giá:</strong>
              {{ item.price }} đ - <strong>Số lượng:</strong>
              {{ item.quantity }}
            </li>
          </ul>
          <div class="action-buttons">
            <!-- Nút Hủy Đơn -->
            <button
              v-if="order.partyStatus !== 'Đã Hủy'"
              @click="cancelOrder(order._id)"
              class="btn btn-danger"
            >
              Hủy Tiệc
            </button>
            <button v-else class="btn btn-secondary" disabled>
              Đã Hủy Tiệc
            </button>
            <!-- Nút Thanh Toán -->
            <button
              v-if="
                (order.status === 'Đã Cọc' ||
                  order.status === 'Chưa Thanh Toán') &&
                order.partyStatus !== 'Chưa Xác Nhận'
              "
              @click="payOrder(order._id)"
              class="btn btn-success"
            >
              Thanh Toán
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
        // Thêm thuộc tính showItems mặc định là false cho mỗi đơn hàng
        this.orders = response.data.map((order) => ({
          ...order,
          showItems: false, // Mặc định ẩn các món ăn
        }));
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
    // Hàm để ẩn/hiện danh sách món ăn trong một đơn hàng
    toggleItems(orderId) {
      const order = this.orders.find((o) => o._id === orderId);
      if (order) {
        order.showItems = !order.showItems; // Chuyển đổi trạng thái ẩn/hiện
      }
    },
  },
  mounted() {
    // Gọi API lấy danh sách đơn hàng khi component được mount
    this.fetchOrders();
    window.scrollTo(0, 0);
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
  gap: 30px; /* Tạo khoảng cách giữa các tiệc */
  justify-content: space-between;
}

.list-group-item {
  width: 30%;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.list-group-item:hover {
  transform: scale(1.02); /* Tăng nhẹ kích thước khi hover */
}

h5 {
  font-size: 1.35rem;
  color: #007bff;
}

p {
  margin: 5px 0;
  font-size: 0.95rem;
}

.status {
  font-weight: bold;
  color: #28a745; /* Xanh lá để trạng thái hiển thị rõ hơn */
}

ul {
  padding-left: 20px;
  margin-bottom: 20px;
}

ul li {
  margin-bottom: 8px;
}

.toggle-btn {
  font-size: 0.85rem;
  color: #007bff;
  cursor: pointer;
}

.alert-info {
  text-align: center;
  font-size: 1.1rem;
  padding: 10px;
  background-color: #e9f7fa;
  border: 1px solid #bde5f0;
  color: #31708f;
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
    width: 48%;
  }
}

@media (max-width: 768px) {
  .list-group-item {
    width: 100%;
  }
}
.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-success:hover {
  background-color: #218838;
  transform: scale(1.05); /* Hiệu ứng phóng to nhẹ khi hover */
}

.btn-success:active {
  background-color: #1e7e34;
  transform: scale(1); /* Trở lại kích thước gốc khi bấm nút */
}
.action-buttons {
  display: flex;
  justify-content: space-between; /* Căn đều hai bên */
  gap: 10px; /* Tạo khoảng cách giữa các nút */
  margin-top: 15px; /* Khoảng cách từ phần thông tin phía trên */
}
</style>
