<template>
  <div class="user-management">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span>Dashboard</span>
      <i class="fas fa-chevron-right"></i>
      <span>Quản Lý Người Dùng</span>
    </div>

    <div class="header">
      <h1>Quản Lý Người Dùng</h1>
      <div class="header-actions">
        <div class="search-container">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            v-model="searchQuery"
            class="search"
          />
        </div>
        <button class="action-btn">
          <i class="fas fa-filter"></i>
          Lọc
        </button>
        <button class="action-btn">
          <i class="fas fa-download"></i>
          Xuất Excel
        </button>
      </div>
    </div>

    <!-- Tabs with counters -->
    <div class="tabs">
      <button :class="{ active: tabStatus === '4' }" @click="changeTab('4')">
        Tất Cả
        <span class="counter">{{ totalUsers }}</span>
      </button>
      <button :class="{ active: tabStatus === '2' }" @click="changeTab('2')">
        Đã Kích Hoạt
        <span class="counter">{{ activeUsers }}</span>
      </button>
      <button :class="{ active: tabStatus === '1' }" @click="changeTab('1')">
        Chưa Kích Hoạt
        <span class="counter">{{ inactiveUsers }}</span>
      </button>
    </div>

    <!-- Enhanced Table -->
    <table class="user-table">
      <thead>
        <tr>
          <th @click="sortBy('USERNAME')" class="sortable-header">
            <div class="header-content">
              Tài Khoản
              <i class="fas fa-sort"></i>
            </div>
          </th>
          <th @click="sortBy('FULLNAME')" class="sortable-header">
            <div class="header-content">
              Họ Tên
              <i class="fas fa-sort"></i>
            </div>
          </th>
          <th @click="sortBy('EMAIL')" class="sortable-header">
            <div class="header-content">
              Email
              <i class="fas fa-sort"></i>
            </div>
          </th>
          <th @click="sortBy('GENDER')" class="sortable-header">
            <div class="header-content">
              Giới Tính
              <i class="fas fa-sort"></i>
            </div>
          </th>
          <th @click="sortBy('ADDRESS')" class="sortable-header">
            <div class="header-content">
              Địa Chỉ
              <i class="fas fa-sort"></i>
            </div>
          </th>
          <th @click="sortBy('IS_ACTIVATED')" class="sortable-header">
            <div class="header-content">
              Trạng Thái
              <i class="fas fa-sort"></i>
            </div>
          </th>
          <th @click="sortBy('ORDER_COUNT')" class="sortable-header">
            <div class="header-content">
              Tiệc Đã Đặt
              <i class="fas fa-sort"></i>
            </div>
          </th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user._id">
          <td class="user-cell">
            <div class="user-info">
              <img :src="user.AVATAR" alt="User avatar" class="user-avatar" />
              <div class="user-details">
                <span class="username">{{ user.USERNAME }}</span>
              </div>
            </div>
          </td>
          <td>{{ user.FULLNAME }}</td>
          <td>
            <span class="email-cell" :title="user.EMAIL">{{ user.EMAIL }}</span>
          </td>
          <td>{{ user.GENDER }}</td>
          <td>
            <span class="address-cell" :title="user.ADDRESS">{{
              user.ADDRESS
            }}</span>
          </td>
          <td>
            <span
              :class="['status', user.IS_ACTIVATED ? 'active' : 'inactive']"
            >
              <i
                :class="
                  user.IS_ACTIVATED
                    ? 'fas fa-check-circle'
                    : 'fas fa-times-circle'
                "
              ></i>
              {{ user.IS_ACTIVATED ? "Đã Xác Thực" : "Chưa Xác Thực" }}
            </span>
          </td>
          <td class="order-count">{{ user.ORDER_COUNT }}</td>
          <td class="actions-cell">
            <button
              v-if="!user.IS_BLOCKED || !user.IS_BLOCKED.CHECK"
              @click="toggleUserBlock(user._id, true)"
              class="action-button block-button"
            >
              <i class="fas fa-lock"></i>
              Khóa
            </button>
            <button
              v-else
              @click="toggleUserBlock(user._id, false)"
              class="action-button unblock-button"
            >
              <i class="fas fa-lock-open"></i>
              Mở Khóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Enhanced Pagination -->
    <div class="pagination">
      <button
        class="page-button"
        @click="changePage(page - 1)"
        :disabled="page === 1"
      >
        <i class="fas fa-chevron-left"></i>
        Trước
      </button>
      <div class="page-info">
        <span>Trang {{ page }} / {{ totalPages }}</span>
      </div>
      <button
        class="page-button"
        @click="changePage(page + 1)"
        :disabled="page === totalPages"
      >
        Tiếp
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { debounce } from "lodash";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      searchQuery: "",
      sortField: "",
      sortOrder: 1,
      users: [],
      page: 1,
      limit: 10, // Giới hạn số user mỗi trang
      totalPages: 0,
      tabStatus: "4", // Mặc định hiển thị tất cả người dùng
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    filteredUsers() {
      let filtered = this.users;

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
    totalUsers() {
      return this.users?.length || 0;
    },
    activeUsers() {
      return this.users?.filter((user) => user.IS_ACTIVATED).length || 0;
    },
    inactiveUsers() {
      return this.users?.filter((user) => !user.IS_ACTIVATED).length || 0;
    },
  },
  methods: {
    ...mapActions(["getUserInfo"]),

    sortBy(field) {
      if (this.sortField === field) {
        this.sortOrder *= -1;
      } else {
        this.sortField = field;
        this.sortOrder = 1;
      }
    },
    changeTab(status) {
      this.tabStatus = status;
      this.page = 1; // Reset về trang đầu khi đổi tab
      this.fetchUsers();
    },
    changePage(newPage) {
      if (newPage > 0 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchUsers();
      }
    },
    async fetchUsers() {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/getUsers",
          {
            params: {
              tabStatus: this.tabStatus,
              page: this.page,
              limit: this.limit,
              search: this.searchQuery,
            },
          }
        );
        this.users = response.data.users;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    debounceFetchUsers: debounce(function () {
      this.fetchUsers();
    }, 500),
    async toggleUserBlock(userId, isBlocked) {
      try {
        await axios.post("http://localhost:3000/user/blockUser", {
          userId,
          IS_BLOCKED: isBlocked, // Truyền giá trị boolean trực tiếp
        });
        this.fetchUsers(); // Cập nhật lại danh sách người dùng sau khi thực hiện khóa/mở khóa
        await this.getUserInfo();
      } catch (error) {
        console.error(
          `Error ${isBlocked ? "blocking" : "unblocking"} user:`,
          error
        );
      }
    },
  },
  watch: {
    searchQuery() {
      this.debounceFetchUsers();
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.user-management {
  padding: 20px;
  background-color: #101827;
  color: #f8fafc;
  width: 100%;
  min-height: 100vh;
}

.breadcrumb {
  margin-bottom: 20px;
  color: #94a3b8;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb i {
  font-size: 0.75rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: #1e293b;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #f8fafc;
  font-size: 2rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.action-btn:hover {
  background: #1d4ed8;
}

.action-btn i {
  font-size: 1rem;
}

.search-container {
  position: relative;
  width: 350px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 1rem;
}

.search {
  padding: 12px 12px 12px 40px;
  background-color: #1e293b;
  border-radius: 8px;
  border: 2px solid #334155;
  width: 100%;
  color: #f8fafc;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  background: #1e293b;
  padding: 15px;
  border-radius: 12px;
}

.tabs button {
  padding: 12px 24px;
  background-color: transparent;
  color: #f8fafc;
  border: 1px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabs button:hover {
  background: #334155;
}

.tabs button.active {
  background: #2563eb;
  border-color: #2563eb;
}

.counter {
  background: #334155;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
}

.user-table {
  width: 100%;
  background: #1e293b;
  border-radius: 12px;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
}

.user-table th,
.user-table td {
  padding: 15px;
  text-align: left;
}

.user-table th {
  background: #262f3f;
  font-weight: 600;
  color: #94a3b8;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.user-table tr {
  transition: all 0.3s ease;
}

.user-table tr:hover {
  background-color: #334155;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sortable-header {
  cursor: pointer;
  transition: color 0.2s;
}

.sortable-header:hover {
  color: #f8fafc;
}

.checkbox-col {
  width: 40px;
  text-align: center;
}

.user-cell {
  padding: 12px 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-weight: 500;
  color: #f8fafc;
}
.user-role {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Enhanced status badges */
.status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status.active {
  background-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid #22c55e;
}

.status.inactive {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

/* Enhanced action buttons */
.action-button {
  padding: 8px 16px;
  font-size: 0.875rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.block-button {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.unblock-button {
  background-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid #22c55e;
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
</style>
