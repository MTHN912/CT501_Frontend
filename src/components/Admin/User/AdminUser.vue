<template>
  <div class="user-management">
    <div class="header">
      <h1>Quản Lý Người Dùng</h1>
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

    <!-- Tabs -->
    <div class="tabs">
      <button :class="{ active: tabStatus === '4' }" @click="changeTab('4')">
        Tất Cả
      </button>
      <button :class="{ active: tabStatus === '2' }" @click="changeTab('2')">
        Đã Kích Hoạt
      </button>
      <button :class="{ active: tabStatus === '1' }" @click="changeTab('1')">
        Chưa Kích Hoạt
      </button>
    </div>

    <!-- Bảng hiển thị danh sách người dùng -->
    <table class="user-table">
      <thead>
        <tr>
          <th @click="sortBy('USERNAME')">Tài Khoản ⬍</th>
          <th @click="sortBy('FULLNAME')">Họ Tên ⬍</th>
          <th @click="sortBy('EMAIL')">Email ⬍</th>
          <th @click="sortBy('GENDER')">Giới Tính ⬍</th>
          <th @click="sortBy('ADDRESS')">Địa Chỉ ⬍</th>
          <th @click="sortBy('IS_ACTIVATED')">Trạng Thái ⬍</th>
          <th @click="sortBy('ORDER_COUNT')">Tiệc Đã Đặt ⬍</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user._id">
          <td>
            <img :src="user.AVATAR" alt="User avatar" class="user-avatar" />
            {{ user.USERNAME }}
          </td>
          <td>{{ user.FULLNAME }}</td>
          <td>{{ user.EMAIL }}</td>
          <td>{{ user.GENDER }}</td>
          <td>{{ user.ADDRESS }}</td>
          <td>
            <span
              :class="['status', user.IS_ACTIVATED ? 'active' : 'inactive']"
            >
              {{ user.IS_ACTIVATED ? "Đã Xác Thực" : "Chưa Xác Thực" }}
            </span>
          </td>
          <td>{{ user.ORDER_COUNT }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Phân trang -->
    <div class="pagination">
      <button @click="changePage(page - 1)" :disabled="page === 1">
        Trước
      </button>
      <span>Trang {{ page }} / {{ totalPages }}</span>
      <button @click="changePage(page + 1)" :disabled="page === totalPages">
        Tiếp
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { debounce } from "lodash";
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
  },
  methods: {
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #f8fafc;
  font-size: 2.5rem;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search {
  padding: 12px 12px 12px 40px;
  background-color: #1e293b;
  border-radius: 8px;
  border: 1px solid #334155;
  width: 100%;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.tabs button {
  padding: 10px 20px;
  background-color: #1e293b;
  color: #f8fafc;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tabs button:hover {
  background-color: #334155;
}

.tabs button.active {
  background-color: #3b82f6;
}

.user-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  text-align: left;
}

.user-table th,
.user-table td {
  padding: 15px;
  background-color: #1e293b;
}

.user-table th {
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.875rem;
  color: #94a3b8;
}

.user-table tr {
  transition: all 0.3s ease;
}

.user-table tr:hover {
  background-color: #334155;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
  vertical-align: middle;
  object-fit: cover;
}

.status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.5rem;
  font-weight: bold;
}

.status.active {
  background-color: #22c55e;
  color: #f0fdf4;
}

.status.inactive {
  background-color: #ef4444;
  color: #fef2f2;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.pagination button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.pagination button:hover:not(:disabled) {
  background-color: #2563eb;
}

.pagination button:disabled {
  background-color: #64748b;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1rem;
  color: #f8fafc;
}
</style>
