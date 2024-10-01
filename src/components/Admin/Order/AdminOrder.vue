<template>
  <div class="order-management">
    <div class="header">
      <h2>Quản lý đơn hàng</h2>
      <input
        type="text"
        placeholder="Tìm kiếm..."
        v-model="searchQuery"
        class="search"
      />
    </div>

    <table class="order-table">
      <thead>
        <tr>
          <th @click="sortBy('partyType')">Loại Tiệc ⬍</th>
          <th @click="sortBy('tables')">Số bàn ⬍</th>
          <th @click="sortBy('eventDate')">Ngày Diễn Ra ⬍</th>
          <th @click="sortBy('partyStatus')">Trạng Thái Tiệc ⬍</th>
          <th @click="sortBy('paymentMethod')">Phương thức thanh toán ⬍</th>
          <th @click="sortBy('totalPrice')">Tổng tiền ⬍</th>
          <th @click="sortBy('phoneNumber')">Số điện thoại ⬍</th>
          <th @click="sortBy('status')">Trạng thái ⬍</th>
          <th @click="sortBy('createdAt')">Ngày tạo ⬍</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in paginatedOrders" :key="order._id">
          <td>{{ order.partyType }}</td>
          <td>{{ order.tables }}</td>
          <td>{{ formatDate(order.eventDate) }}</td>
          <td>{{ order.partyStatus }}</td>
          <td>{{ translatePaymentMethod(order.paymentMethod) }}</td>
          <td>{{ formatCurrency(order.totalPrice) }}</td>
          <td>{{ order.phoneNumber }}</td>
          <td>{{ order.status }}</td>
          <td>{{ formatDate(order.createdAt) }}</td>
          <td>
            <i @click="openDetailModal(order)" class="fas fa-eye view-icon"></i>
            <i
              @click="openUpdateModal(order)"
              class="fas fa-edit edit-icon"
            ></i>
            <i
              @click="deleteOrder(order._id)"
              class="fas fa-trash delete-icon"
            ></i>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Phân trang -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Trước</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Tiếp
      </button>
    </div>

    <!-- Modal chi tiết đơn hàng -->
    <div v-if="isDetailModalOpen" class="modal">
      <div class="modal-content">
        <h2>Chi tiết đơn hàng</h2>
        <p><strong>Loại Tiệc:</strong> {{ selectedOrder.partyType }}</p>
        <p><strong>Số bàn:</strong> {{ selectedOrder.tables }}</p>
        <p>
          <strong>Phương thức thanh toán:</strong>
          {{ translatePaymentMethod(selectedOrder.paymentMethod) }}
        </p>

        <p>
          <strong>Tổng tiền:</strong>
          {{ formatCurrency(selectedOrder.totalPrice) }}
        </p>
        <p><strong>Địa chỉ:</strong> {{ selectedOrder.partyAddress }}</p>
        <p>
          <strong>Ngày diễn ra:</strong>
          {{ formatDate(selectedOrder.eventDate) }}
        </p>
        <p><strong>Trạng Thái Tiệc:</strong> {{ selectedOrder.partyStatus }}</p>
        <p><strong>Số điện thoại:</strong> {{ selectedOrder.phoneNumber }}</p>
        <p><strong>Ghi chú:</strong> {{ selectedOrder.note }}</p>
        <p><strong>Trạng thái:</strong> {{ selectedOrder.status }}</p>
        <p>
          <strong>Ngày tạo:</strong> {{ formatDate(selectedOrder.createdAt) }}
        </p>
        <h3>Danh sách món:</h3>
        <ul>
          <li v-for="item in selectedOrder.items" :key="item._id">
            <strong>{{ item.name }}</strong> - Số lượng: {{ item.quantity }} -
            Giá: {{ formatCurrency(item.price) }}
          </li>
        </ul>

        <button @click="closeDetailModal">Đóng</button>
      </div>
    </div>

    <!-- Modal cập nhật đơn hàng -->
    <div v-if="isUpdateModalOpen" class="modal">
      <div class="modal-content">
        <h2>Cập nhật đơn hàng</h2>
        <form @submit.prevent="submitUpdateOrder">
          <label for="status">Trạng thái:</label>
          <select v-model="selectedOrder.status" id="status">
            <option value="Chưa Thanh Toán">Chưa Thanh Toán</option>
            <option value="Đã Thanh Toán">Đã Thanh Toán</option>
            <option value="Đã Hủy">Đã Hủy</option>
          </select>

          <label for="note">Ghi chú:</label>
          <textarea v-model="selectedOrder.note" id="note"></textarea>

          <button type="submit">Cập nhật</button>
          <button @click="closeUpdateModal" type="button">Hủy</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      orders: [],
      searchQuery: "",
      sortField: "",
      sortOrder: 1,
      currentPage: 1,
      itemsPerPage: 10,
      isDetailModalOpen: false,
      isUpdateModalOpen: false,
      selectedOrder: {},
    };
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders.filter(
        (order) =>
          order._id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          order.phoneNumber.includes(this.searchQuery)
      );

      if (this.sortField) {
        filtered.sort((a, b) => {
          let result = 0;
          if (a[this.sortField] < b[this.sortField]) result = -1;
          if (a[this.sortField] > b[this.sortField]) result = 1;
          return result * this.sortOrder;
        });
      }

      return filtered;
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredOrders.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    },
  },
  methods: {
    translatePaymentMethod(paymentMethod) {
      switch (paymentMethod) {
        case "cash":
          return "Thanh Toán Tiền Mặt";
        case "credit-card":
          return "Thẻ Tín Dụng";
        case "momo":
          return "Ví Momo";
        default:
          return paymentMethod; // Trả về giá trị gốc nếu không khớp với bất kỳ trường hợp nào
      }
    },
    async fetchOrders() {
      try {
        const response = await axios.get(
          "http://localhost:3000/order/getAllOrders"
        );
        this.orders = response.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi tải danh sách đơn hàng.",
        });
      }
    },
    async fetchDishDetails(dishId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/dish/getDishById/${dishId}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching dish details:", error);
        return null; // Trả về null nếu có lỗi
      }
    },
    sortBy(field) {
      if (this.sortField === field) {
        this.sortOrder *= -1;
      } else {
        this.sortField = field;
        this.sortOrder = 1;
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString("vi-VN");
    },
    async openDetailModal(order) {
      this.selectedOrder = { ...order };

      // Gọi API lấy thông tin từng món ăn theo dishId và cập nhật vào selectedOrder.items
      const dishDetailsPromises = this.selectedOrder.items.map(async (item) => {
        const dishDetails = await this.fetchDishDetails(item.dishId);
        if (dishDetails) {
          return {
            ...item, // Giữ lại các thông tin hiện tại của item
            name: dishDetails.name, // Thêm tên món ăn
            price: dishDetails.price, // Thêm giá món ăn
          };
        }
        return item; // Nếu không có dữ liệu trả về, trả về item gốc
      });

      // Chờ tất cả các lời gọi API hoàn thành và cập nhật lại danh sách món ăn
      this.selectedOrder.items = await Promise.all(dishDetailsPromises);

      this.isDetailModalOpen = true; // Mở modal
    },
    closeDetailModal() {
      this.isDetailModalOpen = false;
    },
    openUpdateModal(order) {
      this.selectedOrder = { ...order };
      this.isUpdateModalOpen = true;
    },
    closeUpdateModal() {
      this.isUpdateModalOpen = false;
    },

    async submitUpdateOrder() {
      try {
        // Gọi API để cập nhật trạng thái đơn hàng
        await axios.patch(
          `http://localhost:3000/order/orders/${this.selectedOrder._id}/status`,
          {
            status: this.selectedOrder.status, // Trạng thái cần cập nhật
          }
        );

        // Sau khi cập nhật, lấy lại danh sách đơn hàng
        this.fetchOrders();

        // Đóng modal cập nhật
        this.closeUpdateModal();

        // Hiển thị thông báo cập nhật thành công
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công",
          text: "Trạng thái đơn hàng đã được cập nhật!",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error updating order status:", error);
        // Hiển thị thông báo lỗi
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.",
        });
      }
    },
    async deleteOrder(orderId) {
      if (
        await Swal.fire({
          title: "Bạn có chắc chắn muốn xóa đơn hàng này?",
          text: "Hành động này không thể hoàn tác!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Có, xóa nó!",
          cancelButtonText: "Hủy",
        }).then((result) => result.isConfirmed)
      ) {
        try {
          await axios.delete(
            `http://localhost:3000/order/deleteOrder/${orderId}`
          );
          this.fetchOrders();
          Swal.fire({
            icon: "success",
            title: "Xóa thành công",
            text: "Đơn hàng đã được xóa!",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting order:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Đã xảy ra lỗi khi xóa đơn hàng.",
          });
        }
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.order-management {
  padding: 20px;
  background-color: #101827;
  color: #fff;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  color: white;
}

.search {
  padding: 10px;
  background-color: #1d283c;
  border-radius: 5px;
  border: none;
  width: 200px;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.order-table th,
.order-table td {
  padding: 10px;
  border-bottom: 1px solid #444;
}

.order-table th {
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #0084ff;
  color: white;
  border: none;
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
}

.pagination span {
  margin: 0 10px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  color: #333;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}

.modal-content h2 {
  margin-bottom: 20px;
}

.modal-content label {
  display: block;
  margin-bottom: 5px;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.modal-content button {
  margin-right: 10px;
  padding: 10px 20px;
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.view-icon,
.edit-icon,
.delete-icon {
  cursor: pointer;
  margin-right: 10px;
}

.view-icon {
  color: #ffc107;
}

.edit-icon {
  color: #4caf50;
}

.delete-icon {
  color: #f44336;
}
</style>
