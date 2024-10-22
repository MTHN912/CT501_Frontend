<template>
  <div class="container">
    <h2>Gói Của Bạn</h2>

    <div class="main-content">
      <!-- Nội dung chính: Tabs và danh sách đơn hàng -->
      <div class="content">
        <!-- Tabs để lọc đơn tiệc theo trạng thái -->
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: selectedTab === 'all' }"
              @click="selectedTab = 'all'"
              >Tất Cả</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: selectedTab === 'Chưa Xác Nhận' }"
              @click="selectedTab = 'Chưa Xác Nhận'"
              >Chưa Xác Nhận</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: selectedTab === 'Chưa Diễn Ra' }"
              @click="selectedTab = 'Chưa Diễn Ra'"
              >Chưa Diễn Ra</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: selectedTab === 'Chuẩn Bị' }"
              @click="selectedTab = 'Chuẩn Bị'"
              >Chuẩn Bị</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: selectedTab === 'Đang Diễn Ra' }"
              @click="selectedTab = 'Đang Diễn Ra'"
              >Đang Diễn Ra</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: selectedTab === 'Đã Kết Thúc' }"
              @click="selectedTab = 'Đã Kết Thúc'"
              >Đã Kết Thúc</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: selectedTab === 'Đã Hủy' }"
              @click="selectedTab = 'Đã Hủy'"
              >Đã Hủy</a
            >
          </li>
        </ul>

        <!-- Thông báo khi không có đơn tiệc -->
        <div v-if="filteredOrders.length === 0" class="alert alert-info">
          Không có đơn tiệc trong trạng thái này.
        </div>

        <!-- Hiển thị danh sách đơn tiệc -->
        <div v-else class="order-list">
          <div
            v-for="order in filteredOrders"
            :key="order._id"
            class="order-item"
            @click="goToDetail(order._id)"
            style="cursor: pointer"
          >
            <div class="order-header">
              <h3 class="order-id">Mã Tiệc: #{{ order._id.slice(-8) }}</h3>
              <span
                :class="['order-status', getStatusClass(order.partyStatus)]"
                >{{ order.partyStatus }}</span
              >
            </div>

            <div class="order-info">
              <div class="info-column">
                <p><strong>Loại Tiệc:</strong> {{ order.partyType }}</p>
                <p>
                  <strong>Ngày tiệc:</strong> {{ formatDate(order.eventDate) }}
                </p>
                <p><strong>Địa Chỉ:</strong> {{ order.partyAddress }}</p>
              </div>
              <div class="info-column">
                <p>
                  <strong>Trạng Thái Thanh Toán:</strong> {{ order.status }}
                </p>
                <p><strong>Phương Thức:</strong> {{ order.paymentMethod }}</p>
                <p>
                  <strong>Tổng Tiền:</strong>
                  {{ formatCurrency(order.totalPrice) }}
                </p>
                <p>
                  <strong>Đã Trả:</strong>
                  {{ formatCurrency(order.paidDepositAmount) }}
                </p>
              </div>
            </div>
            <div
              v-if="order.packageDetails"
              class="order-details container mt-4"
            >
              <div class="card p-4 shadow-sm">
                <h4 class="mb-4 text-primary">Gói Đã Đặt</h4>
                <div class="package-details mb-4">
                  <h5 class="text-secondary">
                    {{ order.packageDetails.name }}
                  </h5>
                  <p class="text-muted">
                    {{ order.packageDetails.description }}
                  </p>
                  <p>
                    <span class="fw-bold">Giá gốc:</span>
                    {{ order.packageDetails.price }} VND
                  </p>
                  <p>
                    <span class="fw-bold">Giá gói khuyến mãi:</span
                    ><span class="text-danger"
                      >{{ order.packageDetails.promotionalPrice }} VND</span
                    >
                  </p>
                  <p>Số lượng bàn: {{ order.packageDetails.tables }}</p>
                </div>

                <h4 class="mb-3">Các món trong gói</h4>
                <div class="row">
                  <div
                    v-for="item in order.packageDetails.combo"
                    :key="item._id"
                    class="col-md-4 mb-4"
                  >
                    <div class="card h-100 shadow-sm">
                      <img
                        :src="item.image"
                        alt="Món ăn"
                        class="card-img-top img-fluid dish-image"
                      />
                      <div class="card-body">
                        <h5 class="card-title">{{ item.name }}</h5>
                        <p class="card-text text-muted">
                          {{ item.description }}
                        </p>
                        <p class="card-text fw-bold">
                          Giá: {{ item.price }} VND
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="order-actions">
              <button
                v-if="
                  order.partyStatus !== 'Đã Hủy' &&
                  order.partyStatus !== 'Đã Kết Thúc'
                "
                @click.stop="cancelOrder(order._id)"
                class="btn btn-outline-danger"
              >
                Hủy Tiệc
              </button>
              <button
                v-if="
                  order.partyStatus === 'Đang Diễn Ra' &&
                  order.status === 'Đã Thanh Toán'
                "
                @click.stop="completeOrder(order._id)"
                class="btn btn-primary"
              >
                Hoàn Thành Tiệc
              </button>

              <button
                v-if="
                  order.partyStatus !== 'Đã Hủy' &&
                  order.status === 'Chưa Thanh Toán' &&
                  order.totalPrice > 1000000
                "
                @click.stop="depositOrder(order._id)"
                class="btn btn-warning"
              >
                Đặt Cọc
              </button>
              <button
                v-if="
                  (order.partyStatus !== 'Đã Hủy' &&
                    order.status === 'Chưa Thanh Toán') ||
                  order.status === 'Đã Cọc'
                "
                @click.stop="payOrder(order._id)"
                class="btn btn-success"
              >
                Thanh Toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import OrderDetail from "./OrderDetail.vue";

export default {
  props: {
    orders: Array,
  },
  components: {
    OrderDetail,
  },
  name: "OrderList",
  data() {
    return {
      orders: [],
      selectedOrder: null,
      selectedTab: "all",
      activeMenuItem: null,
    };
  },
  computed: {
    filteredOrders() {
      if (this.selectedTab === "all") {
        return this.orders;
      }
      return this.orders.filter(
        (order) => order.partyStatus === this.selectedTab
      );
    },
  },
  methods: {
    navigateTo(component) {
      this.activeMenuItem = component;
      this.$router.push({ name: component });
    },
    async fetchOrders() {
      try {
        const response = await axios.get(
          "http://localhost:3000/order/getOrdersPackageByUserId"
        );

        // Map lại orders và lấy package details cho từng order
        this.orders = await Promise.all(
          response.data.map(async (order) => {
            const packageDetails = await this.fetchPackageDetails(
              order.packageId
            );
            return {
              ...order,
              packageDetails, // Gán thông tin chi tiết gói vào từng đơn
              showItems: false, // Bạn có thể bỏ showItems nếu không cần nữa
            };
          })
        );

        // Sắp xếp các đơn hàng theo thời gian mới nhất (createdAt)
        this.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      }
    },
    showOrderDetails(orderId) {
      this.selectedOrder = this.orders.find((order) => order._id === orderId);
    },
    async fetchPackageDetails(packageId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/package/getPackageById/${packageId}`
        );
        if (response.data.success) {
          return response.data.data; // Trả về chi tiết gói
        } else {
          console.error("Không thể lấy thông tin gói");
          return null;
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin gói: ", error);
        return null;
      }
    },
    async completeOrder(orderId) {
      try {
        // Gọi API để cập nhật trạng thái đơn tiệc thành "Đã Kết Thúc"
        const response = await fetch(
          `http://localhost:3000/order/ordersPackage/${orderId}/party-status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ partyStatus: "Đã Kết Thúc" }), // Gửi trạng thái "Đã Kết Thúc" trong body
          }
        );

        if (response.ok) {
          // Nếu cập nhật thành công, lấy dữ liệu đơn hàng được trả về
          const data = await response.json();
          const updatedOrder = data.order; // Đơn hàng đã cập nhật

          // Tìm và cập nhật trạng thái đơn tiệc trong danh sách `orders`
          const orderIndex = this.orders.findIndex(
            (order) => order._id === orderId
          );
          if (orderIndex !== -1) {
            this.orders[orderIndex] = updatedOrder;
          }
          alert("Tiệc đã được hoàn thành.");
          this.fetchOrders();
        } else {
          const errorData = await response.json();
          console.error("Failed to complete the order:", errorData.error);
          alert("Có lỗi xảy ra: " + errorData.error);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Có lỗi kết nối, vui lòng thử lại.");
      }
    },
    calculatedDeposit(totalPriceForTables) {
      if (totalPriceForTables >= 20000000) {
        return totalPriceForTables * 0.5;
      } else if (totalPriceForTables >= 10000000) {
        return totalPriceForTables * 0.4;
      } else if (totalPriceForTables >= 5000000) {
        return totalPriceForTables * 0.3;
      }
      return 0; // Đặt cọc tùy chọn
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
    async cancelOrder(orderId) {
      if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
        try {
          await axios.patch(
            `http://localhost:3000/order/ordersPackage/${orderId}/cancel`
          );
          alert("Đơn hàng đã được hủy thành công!");
          this.fetchOrders();
        } catch (error) {
          console.error("Lỗi khi hủy đơn hàng:", error);
          alert("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
        }
      }
    },
    toggleItems(orderId) {
      const order = this.orders.find((o) => o._id === orderId);
      if (order) {
        order.showItems = !order.showItems;
      }
    },
    async depositOrder(orderId) {
      const order = this.orders.find((o) => o._id === orderId);
      const depositAmount = this.calculatedDeposit(order.totalPrice);

      Swal.fire({
        title: "Bạn cần đặt cọc bằng hình thức thanh toán online",
        text: `Số tiền cần thanh toán là ${depositAmount.toLocaleString()} VND. Vui lòng chọn phương thức thanh toán để tiếp tục.`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "VNPay",
        cancelButtonText: "Ví Momo",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.post(
              "http://localhost:3000/order/orderPaymentPackage",
              {
                orderId: orderId,
                amount: depositAmount, // Gửi số tiền đúng định dạng
                bankCode: "", // Tuỳ chọn, nếu không chọn thì để rỗng
                language: "vn", // Ngôn ngữ mặc định là "vn"
              }
            );

            if (response.data && response.data.paymentUrl) {
              window.location.href = response.data.paymentUrl; // Chuyển hướng tới URL thanh toán của VNPay
            } else {
              Swal.fire(
                "Lỗi",
                "Không thể tạo URL thanh toán, vui lòng thử lại sau.",
                "error"
              );
            }
          } catch (error) {
            console.error("Lỗi khi gọi API thanh toán:", error);
            Swal.fire(
              "Lỗi",
              "Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại sau.",
              "error"
            );
          }
        }
      });
    },
    async payOrder(orderId) {
      const order = this.orders.find((o) => o._id === orderId);
      const remainingAmount = order.totalPrice - order.paidDepositAmount;

      const newOrderId = `${orderId}_installment${Date.now()}`; // Tạo mã đơn hàng mới cho phần thanh toán còn lại

      Swal.fire({
        title: "Chọn Phương Thức Thanh Toán",
        text: `Số tiền còn lại cần thanh toán là ${remainingAmount.toLocaleString()} VND. Bạn có thể chọn lại phương thức thanh toán.`,
        icon: "info",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "VNPay",
        denyButtonText: "Ví Momo",
        cancelButtonText: "Thanh Toán Sau Tiệc",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Nếu chọn VNPay
          try {
            const response = await axios.post(
              "http://localhost:3000/order/orderPaymentPackage",
              {
                orderId: newOrderId, // Sử dụng mã đơn hàng mới
                amount: remainingAmount, // Gửi số tiền còn lại để thanh toán
                bankCode: "", // Tuỳ chọn, nếu không chọn thì để rỗng
                language: "vn", // Ngôn ngữ mặc định là "vn"
              }
            );

            if (response.data && response.data.paymentUrl) {
              window.location.href = response.data.paymentUrl; // Chuyển hướng tới URL thanh toán của VNPay
            } else {
              Swal.fire(
                "Lỗi",
                "Không thể tạo URL thanh toán, vui lòng thử lại sau.",
                "error"
              );
            }
          } catch (error) {
            console.error("Lỗi khi gọi API thanh toán:", error);
            Swal.fire(
              "Lỗi",
              "Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại sau.",
              "error"
            );
          }
        } else if (result.isDenied) {
          Swal.fire(
            "Ví Momo chưa được tích hợp. Vui lòng chọn phương thức khác.",
            "info"
          );
        } else if (result.isDismissed) {
          Swal.fire(
            "Bạn đã chọn thanh toán sau tiệc. Vui lòng thanh toán sau khi sự kiện kết thúc.",
            "success"
          );
        }
      });
    },
    goToDetail(orderId) {
      this.$router.push({ name: "OrderDetail", params: { id: orderId } });
    },
    getStatusClass(status) {
      switch (status) {
        case "Đã Kết Thúc":
          return "status-completed";
        case "Đã Hủy":
          return "status-cancelled";
        case "Đang Diễn Ra":
          return "status-ongoing";
        default:
          return "status-pending";
      }
    },
  },
  mounted() {
    this.fetchOrders();
    this.fetchPackageDetails();
    window.scrollTo(0, 0);
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  margin-top: 120px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  color: #333;
}

.main-content {
  display: flex;
  gap: 20px; /* Khoảng cách giữa order-list và sidebar */
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* flex: 3; */
}

.order-item {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(6, 6, 6, 0.1);
  width: 1120px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.order-id {
  font-size: 1.2rem;
  color: #007bff;
  margin: 0;
}

.order-status {
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
}

.order-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.info-column {
  flex: 1;
}

.info-column p {
  margin: 5px 0;
  font-size: 0.9rem;
}

.order-items {
  margin-bottom: 20px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.item-card {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
}

.item-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.item-info p {
  margin: 5px 0;
  font-size: 0.8rem;
}

.item-name {
  font-weight: bold;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  color: #fff;
  background-color: #dc3545;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  color: #fff;
}

.status-completed {
  background-color: #28a745;
  color: white;
  padding: 4px 20px;
  border-radius: 15px;
}
.status-cancelled {
  background-color: #dc3545;
  color: white;
  padding: 4px 20px;
  border-radius: 15px;
}
.container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  margin-top: 120px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  color: #333;
}

.main-content {
  display: flex;
  gap: 20px; /* Khoảng cách giữa order-list và sidebar */
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 3;
}
/* Các phần còn lại giữ nguyên */
.order-item {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(6, 6, 6, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.order-id {
  font-size: 1.2rem;
  color: #007bff;
  margin: 0;
}

.order-status {
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
}

.order-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.info-column {
  flex: 1;
}

.info-column p {
  margin: 5px 0;
  font-size: 0.9rem;
}

.order-items {
  margin-bottom: 20px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.item-card {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
}

.item-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.item-info p {
  margin: 5px 0;
  font-size: 0.8rem;
}

.item-name {
  font-weight: bold;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  color: #fff;
  background-color: #dc3545;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  color: #fff;
}

.status-completed {
  background-color: #28a745;
  color: white;
  padding: 4px 20px;
  border-radius: 15px;
}
.status-cancelled {
  background-color: #dc3545;
  color: white;
  padding: 4px 20px;
  border-radius: 15px;
}
.status-ongoing {
  background-color: #17a2b8;
  color: white;
  padding: 4px 20px;
  border-radius: 15px;
}
.status-pending {
  background-color: #ffc107;
  color: #212529;
  padding: 4px 20px;
  border-radius: 15px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .order-info {
    flex-direction: column;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
.dish-image {
  width: 100%; /* Makes the image take the full width of its container */
  height: 150px; /* Set a fixed height */
  object-fit: cover; /* Ensures the image scales and crops to fill the set size */
}
.card {
  max-width: 1070px; /* Adjust the width to your desired size */
}
</style>
