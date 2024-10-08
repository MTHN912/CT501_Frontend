<template>
  <div class="order-management">
    <div class="header">
      <h2>Quản lý đơn tiệc</h2>
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          v-model="searchQuery"
          class="search"
        />
      </div>
    </div>

    <div class="ustabs">
      <div class="tab-all">
        <button
          @click="selectTab('allOrders')"
          :class="{ active: activeTab === 'allOrders' }"
        >
          Tất cả
        </button>
      </div>
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="selectTab(tab.value)"
          :class="{ active: activeTab === tab.value }"
        >
          <template
            v-if="tab.value === 'status' || tab.value === 'partyStatus'"
          >
            <select
              :value="
                tab.value === 'status' ? selectedStatus : selectedPartyStatus
              "
              @change="updateTabSelection($event, tab.value)"
              @click.stop
            >
              <option value="">{{ tab.label }}</option>
              <option
                v-for="option in tab.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </template>
          <template v-else>
            {{ tab.label }}
          </template>
        </button>
        <div class="date-range-filter">
          <input
            type="date"
            v-model="startDate"
            @change="updateDateRangeFilter"
          />
          <input
            type="date"
            v-model="endDate"
            @change="updateDateRangeFilter"
          />
        </div>
      </div>
    </div>

    <table class="order-table">
      <thead>
        <tr>
          <th @click="sortBy('username')" class="narrow-column1">
            Người đặt tiệc
          </th>
          <th @click="sortBy('partyType')" class="narrow-column2">Loại Tiệc</th>
          <th @click="sortBy('tables')" class="narrow-column">Số bàn</th>
          <th @click="sortBy('eventDate')" class="narrow-column3">
            Ngày Diễn Ra
          </th>
          <th @click="sortBy('partyStatus')" class="narrow-column4">
            Trạng Thái Tiệc
          </th>
          <th @click="sortBy('paymentMethod')" class="narrow-column5">
            Phương Thức Thanh Toán
          </th>
          <th @click="sortBy('totalPrice')" class="narrow-column6">
            Tổng Tiền
          </th>
          <th @click="sortBy('depositAmount')" class="narrow-column9">
            Đã Trả
          </th>
          <th @click="sortBy('phoneNumber')" class="narrow-column7">
            Số Điện Thoại
          </th>
          <th @click="sortBy('status')" class="narrow-column8">
            Trạng Thái Thanh Toán
          </th>
          <th class="narrow-column10">Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in paginatedOrders" :key="order._id" class="order-row">
          <td class="narrow-column1">{{ order.username || "Đang tải..." }}</td>
          <td class="narrow-column2">{{ order.partyType }}</td>
          <td class="narrow-column">{{ order.tables }}</td>
          <td class="narrow-column3">{{ formatDate(order.eventDate) }}</td>
          <td class="narrow-column4">
            <span
              :class="['status-badge', getPartyStatusClass(order.partyStatus)]"
            >
              {{ order.partyStatus }}
            </span>
          </td>
          <td class="narrow-column5">
            {{ translatePaymentMethod(order.paymentMethod) }}
          </td>
          <td class="narrow-column6">{{ formatCurrency(order.totalPrice) }}</td>
          <td class="narrow-column9">
            {{ formatCurrency(order.paidDepositAmount) }}
          </td>
          <td class="narrow-column7">{{ order.phoneNumber }}</td>
          <td class="narrow-column8">
            <span :class="['status-badge', getStatusClass(order.status)]">
              {{ order.status }}
            </span>
          </td>
          <td>
            <i
              @click="openDetailModal(order)"
              class="fas fa-eye view-icon"
              title="Xem"
            ></i>
            <i
              @click="openUpdateModal(order)"
              class="fas fa-edit edit-icon"
              title="Sửa"
            ></i>
            <i
              @click="deleteOrder(order._id)"
              class="fas fa-trash delete-icon"
              title="Xóa"
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
      <select v-model="itemsPerPage" @change="updateItemsPerPage">
        <option :value="10">10 / trang</option>
        <option :value="20">20 / trang</option>
        <option :value="50">50 / trang</option>
      </select>
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
          <button type="submit">Cập nhật</button>
          <button
            v-if="selectedOrder.partyStatus === 'Chưa Xác Nhận'"
            @click="confirmOrder"
            type="button"
          >
            Xác nhận đơn hàng
          </button>
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
      ordersByCategory: {},
      activeTab: "allOrders",
      searchQuery: "",
      sortField: "",
      sortOrder: 1,
      currentPage: 1,
      itemsPerPage: 10,
      isDetailModalOpen: false,
      isUpdateModalOpen: false,
      selectedOrder: {},
      selectedEventDate: "",
      startDate: "",
      endDate: "",
      tabs: [
        // { label: "Tất cả", value: "allOrders" },
        {
          label: "Trạng Thái Tiệc",
          value: "partyStatus",
          options: [
            { label: "Chưa Xác Nhận", value: "Chưa Xác Nhận" },
            { label: "Chưa Diễn Ra", value: "Chưa Diễn Ra" },
            { label: "Chuẩn Bị", value: "Chuẩn Bị" },
            { label: "Đang Diễn Ra", value: "Đang Diễn Ra" },
            { label: "Đã Kết Thúc", value: "Đã Kết Thúc" },
          ],
        },
        {
          label: "Trạng Thái Thanh Toán",
          value: "status",
          options: [
            { label: "Chưa Thanh Toán", value: "Chưa Thanh Toán" },
            { label: "Đã Thanh Toán", value: "Đã Thanh Toán" },
            { label: "Đã Cọc", value: "Đã Cọc" },
            { label: "Đã Hủy", value: "Đã Hủy" },
          ],
        },
      ],
      selectedStatus: "",
      selectedPartyStatus: "",
    };
  },
  computed: {
    allOrders() {
      return Object.values(this.ordersByCategory).flat();
    },
    filteredOrders() {
      let orders =
        this.activeTab === "allOrders"
          ? this.allOrders
          : this.ordersByCategory[this.activeTab] || [];

      return orders.filter(
        (order) =>
          (order.username &&
            order.username
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())) || // Tìm kiếm theo tên người đặt tiệc
          order.phoneNumber
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) // Tìm kiếm theo số điện thoại (giữ nguyên)
      );
    },
    sortedOrders() {
      return this.filteredOrders.sort((a, b) => {
        let aVal = a[this.sortField];
        let bVal = b[this.sortField];

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return -1 * this.sortOrder;
        if (aVal > bVal) return 1 * this.sortOrder;
        return 0;
      });
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedOrders.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    },
    currentTabLabel() {
      const currentTab = this.tabs.find((tab) => tab.value === this.activeTab);
      if (currentTab.value === "status" && this.selectedStatus) {
        return this.selectedStatus;
      } else if (
        currentTab.value === "partyStatus" &&
        this.selectedPartyStatus
      ) {
        return this.selectedPartyStatus;
      }
      return currentTab.label;
    },
  },
  methods: {
    applyFilters() {
      this.fetchOrdersWithBothFilters();
    },
    resetFilters() {
      this.selectedStatus = "";
      this.selectedPartyStatus = "";
      this.selectedEventDate = "";
      this.startDate = "";
      this.endDate = "";
      this.fetchOrdersWithBothFilters();
    },
    getStatusClass(status) {
      const statusMap = {
        "Đã Cọc": "disposet",
        "Chưa Thanh Toán": "unpaid",
        "Đã Thanh Toán": "paid",
        "Đã Hủy": "cancelled",
      };
      return statusMap[status] || "";
    },
    getPartyStatusClass(partyStatus) {
      const partyStatusMap = {
        "Chưa Xác Nhận": "unconfirmed",
        "Chưa Diễn Ra": "upcoming",
        "Chuẩn Bị": "nearing",
        "Đang Diễn Ra": "ongoing",
        "Đã Kết Thúc": "finished",
        "Đã Hủy": "cancelled",
      };
      return partyStatusMap[partyStatus] || "";
    },
    updateItemsPerPage() {
      this.currentPage = 1; // Reset to first page
      this.fetchOrdersWithBothFilters();
    },

    updateDateRangeFilter() {
      this.fetchOrdersWithBothFilters();
    },
    updateEventDateFilter() {
      this.startDate = ""; // Reset startDate
      this.endDate = ""; // Reset endDate
      this.fetchOrdersWithBothFilters();
    },
    getStatusFromTab(tab) {
      const statusMap = {
        canceledOrders: "Đã Hủy",
        paidOrders: "Đã Thanh Toán",
        unpaidOrders: "Chưa Thanh Toán",
      };
      return statusMap[tab] || undefined;
    },

    getPartyStatusFromTab(tab) {
      const partyStatusMap = {
        upcomingOrders: "Chưa Diễn Ra",
        nearingOrders: "Chuẩn Bị",
        ongoingOrders: "Đang Diễn Ra",
        finishedOrders: "Đã Kết Thúc",
      };
      return partyStatusMap[tab] || undefined;
    },
    translatePaymentMethod(paymentMethod) {
      switch (paymentMethod) {
        case "cash":
          return "Thanh Toán Sau Tiệc";
        case "credit-card":
          return "VN-Pay";
        case "momo":
          return "Ví Momo";
        default:
          return paymentMethod; // Trả về giá trị gốc nếu không khớp với bất kỳ trường hợp nào
      }
    },
    selectTab(tabValue) {
      this.activeTab = tabValue;
      if (tabValue === "allOrders") {
        this.selectedStatus = "";
        this.selectedPartyStatus = "";
        this.selectedEventDate = ""; // Reset ngày khi chọn "Tất cả"
        this.fetchOrders();
      }
    },
    updateTabSelection(event, tabValue) {
      const selectedValue = event.target.value;

      if (tabValue === "status") {
        this.selectedStatus = selectedValue;
      } else if (tabValue === "partyStatus") {
        this.selectedPartyStatus = selectedValue;
      }

      // Gửi cả hai giá trị của status và partyStatus cùng lúc
      this.fetchOrdersWithBothFilters();
    },
    filterByStatus() {
      this.fetchOrders();
    },

    filterByPartyStatus() {
      this.fetchOrders();
    },
    async fetchOrdersWithBothFilters() {
      try {
        // Gửi cả hai giá trị của status và partyStatus đến API
        const response = await axios.get(
          "http://localhost:3000/order/getAllOrders",
          {
            params: {
              status: this.selectedStatus,
              partyStatus: this.selectedPartyStatus,
              eventDate: this.selectedEventDate,
              startDate: this.startDate,
              endDate: this.endDate,
            },
          }
        );

        this.ordersByCategory = { [this.activeTab]: response.data };
        await this.fetchUsersForOrders();
      } catch (error) {
        console.error("Error fetching orders with both filters:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi tải danh sách đơn hàng.",
        });
      }
    },
    async fetchOrders() {
      try {
        const response = await axios.get(
          "http://localhost:3000/order/getAllOrders",
          {
            params: {
              status: this.selectedStatus,
              partyStatus: this.selectedPartyStatus,
              eventDate: this.selectedEventDate, // Thêm eventDate vào params
            },
          }
        );
        this.ordersByCategory = { [this.activeTab]: response.data };
        await this.fetchUsersForOrders();
      } catch (error) {
        console.error("Error fetching orders:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi tải danh sách đơn hàng.",
        });
      }
    },

    async fetchUsersForOrders() {
      for (const category in this.ordersByCategory) {
        const userPromises = this.ordersByCategory[category].map(
          async (order) => {
            if (order.userId) {
              try {
                const response = await axios.get(
                  `http://localhost:3000/user/getUserById/${order.userId}`
                );
                return { ...order, username: response.data.FULLNAME }; // Lưu tên người đặt tiệc vào `username`
              } catch (error) {
                console.error(`Error fetching user ${order.userId}:`, error);
                return { ...order, username: "Không tìm thấy người dùng" };
              }
            }
            return { ...order, username: "Không xác định" };
          }
        );
        this.ordersByCategory[category] = await Promise.all(userPromises);
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
    async confirmOrder() {
      try {
        const response = await axios.put(
          `http://localhost:3000/order/oders/${this.selectedOrder._id}/confirm`,
          {}
        );

        if (response.status === 200) {
          const { order } = response.data;

          // Cập nhật trạng thái đơn hàng trong dữ liệu local
          this.selectedOrder.partyStatus = order.partyStatus;

          // Đóng modal cập nhật
          this.closeUpdateModal();

          // Cập nhật lại danh sách đơn hàng
          this.fetchOrders();

          // Hiển thị thông báo xác nhận thành công
          Swal.fire({
            icon: "success",
            title: "Xác nhận thành công",
            text: `Đơn hàng đã được xác nhận! Trạng thái mới: ${order.partyStatus}`,
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error confirming order:", error);
        // Hiển thị thông báo lỗi
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text:
            error.response?.data?.error ||
            "Đã xảy ra lỗi khi xác nhận đơn hàng.",
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
    this.fetchOrdersWithBothFilters();
  },
};
</script>

<style scoped>
.order-management {
  padding: 20px;
  background-color: #101827;
  color: #fff;
  width: 100%;
  height: 100%px;
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

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search {
  padding: 10px 10px 10px 35px;
  background-color: #1d283c;
  border-radius: 5px;
  border: 1px solid #444;
  width: 200px;
  color: white;
}

/* Tabs CSS */
.ustabs {
  display: flex;
}
.tabs {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

/* Tab 'Tất cả' không hiển thị mũi tên */
.tab-all {
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 20px;
}

.tab-all button {
  padding: 10px 20px;
  background-color: #1d283c;
  color: white;
  border: 1px solid #444;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  /* min-width: 120px; */
  height: 42px;
  width: 90px;
  position: relative;
  text-align: left;
}

/* Hiệu ứng hover cho tab 'Tất cả' */
.tab-all button:hover {
  background-color: #34495e;
  transform: translateY(-2px);
}

/* Khi tab 'Tất cả' được chọn */
.tab-all button.active {
  background-color: #0084ff;
  color: white;
}

/* Định dạng cho các tab còn lại */
.tabs button {
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #1d283c;
  color: #fff;
  border: 1px solid #444;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  position: relative;
  overflow: visible;
  min-width: 120px;
  width: 210px;
}

/* Hiệu ứng hover cho các tab */
.tabs button:hover {
  background-color: #34495e;
  transform: translateY(-2px);
}

/* Khi một tab được chọn */
.tabs .active {
  background-color: #0084ff;
  color: white;
}

/* Dropdown trong tab */
.tabs select {
  appearance: none;
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
  padding: 10px 20px;
  margin: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  outline: none;
}

/* Loại bỏ mũi tên của dropdown trên các trình duyệt khác nhau */
.tabs select::-ms-expand {
  display: none;
}

/* Thêm mũi tên cho các tab có dropdown */
.tabs button::after {
  content: "\25BC"; /* Mũi tên xuống */
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 0.8em;
}

/* Đảm bảo kích thước đồng nhất cho tất cả các nút và dropdown */
.tabs button,
.tabs select {
  width: 210px;
  min-width: 120px;
  height: 42px;
}

/* Các tùy chọn trong dropdown */
.tabs select option {
  background-color: #1d283c;
  color: #fff;
}

.order-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  margin-top: 20px;
}

.order-table th {
  padding: 12px;
  text-align: center;
  background-color: #1d283c;
}

.order-table td {
  padding: 12px;
  /* text-align: left; */
  background-color: #1d283c;
}

.order-table th {
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
}

.order-table tr {
  transition: background-color 0.3s;
}

.order-table tr:hover {
  background-color: #2c3e50;
}

.narrow-column {
  width: 75px;
}
.narrow-column1 {
  width: 200px;
}
.narrow-column2 {
  width: 60px;
}
.narrow-column3 {
  width: 130px;
}
.narrow-column4 {
  width: 150px;
  text-align: center;
}
.narrow-column5 {
  width: 175px;
  text-align: center;
}
.narrow-column6 {
  width: 70px;
  text-align: center;
}
.narrow-column7 {
  width: 120px;
  text-align: center;
}
.narrow-column8 {
  width: 180px;
  text-align: center;
}
.narrow-column9 {
  text-align: center;
}
.narrow-column10 {
  vertical-align: middle;
}
.status-badge {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.unpaid {
  background-color: #ffa500;
  color: #000;
}
.paid {
  background-color: #4caf50;
  color: #fff;
}
.cancelled {
  background-color: #f44336;
  color: #fff;
}
.upcoming {
  background-color: #2196f3;
  color: #fff;
}
.nearing {
  background-color: #ff9800;
  color: #000;
}
.ongoing {
  background-color: #9c27b0;
  color: #fff;
}
.finished {
  background-color: #607d8b;
  color: #fff;
}
.unconfirmed {
  background-color: #adb4ad; /* Màu xanh lá */
  color: white;
}
.disposet {
  background-color: #fa4802;
  color: white;
}

.action-icon {
  margin-right: 10px;
  cursor: pointer;
  transition: color 0.3s;
}

.action-icon:hover {
  color: #0084ff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button,
.pagination select {
  margin: 0 5px;
  padding: 8px 12px;
  background-color: #1d283c;
  color: white;
  border: 1px solid #444;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination select {
  appearance: none;
  padding-right: 25px;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23ffffff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 5px;
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
.dropdown {
  margin-left: 10px;
}

.dropdown select {
  padding: 10px;
  background-color: #1d283c;
  color: #fff;
  border: 1px solid #444;
  border-radius: 5px;
  cursor: pointer;
}
.date-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-filter label {
  font-size: 16px;
  font-weight: bold;
}

.date-filter input[type="date"] {
  padding: 5px 7px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 20px;
  transition: border-color 0.3s ease;
}

.date-filter input[type="date"]:focus {
  border-color: #007bff;
  outline: none;
}

.date-filter input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

.date-filter input[type="date"]::-webkit-inner-spin-button {
  display: none;
}
.date-range-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-range-filter input[type="date"] {
  background-color: #1d283c;
  height: 40px;
  padding: 5px 7px;
  border-radius: 5px;
  border: 1px solid #ddd;
  color: #ddd;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.date-range-filter input[type="date"]:focus {
  border-color: #007bff;
  outline: none;
}
</style>
