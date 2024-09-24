<template>
  <div class="user-management">
    <div class="header">
      <h2>User Management</h2>
      <input
        type="text"
        placeholder="Search users..."
        v-model="searchQuery"
        class="search"
        @input="fetchUsers"
      />
    </div>

    <!-- Thêm các tab -->
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
          <th @click="sortBy('USERNAME')">Username ⬍</th>
          <th @click="sortBy('FULLNAME')">Full Name ⬍</th>
          <th @click="sortBy('EMAIL')">Email ⬍</th>
          <th @click="sortBy('GENDER')">Gender ⬍</th>
          <th @click="sortBy('ADDRESS')">Address ⬍</th>
          <th @click="sortBy('IS_ACTIVATED')">Activated ⬍</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user._id">
          <td>
            <img :src="user.AVATAR" alt="User avatar" class="user-avatar" />{{
              user.USERNAME
            }}
          </td>
          <td>{{ user.FULLNAME }}</td>
          <td>{{ user.EMAIL }}</td>
          <td>{{ user.GENDER }}</td>
          <td>{{ user.ADDRESS }}</td>
          <td>{{ user.IS_ACTIVATED ? "Yes" : "No" }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Nút điều hướng trang -->
    <div class="pagination">
      <button @click="changePage(page - 1)" :disabled="page === 1">
        Previous
      </button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button @click="changePage(page + 1)" :disabled="page === totalPages">
        Next
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

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
      let filtered = this.users.filter((user) =>
        user.USERNAME.toLowerCase().includes(this.searchQuery.toLowerCase())
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
  color: #fff;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search {
  padding: 10px;
  background-color: #1d283c;
  border-radius: 5px;
  border: none;
  width: 200px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #1d283c;
  color: #fff;
}

.tabs button.active {
  background-color: #0084ff;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.user-table th,
.user-table td {
  padding: 10px;
  border-bottom: 1px solid #444;
}

.user-table th {
  cursor: pointer;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;
}

/* Phân trang */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #0084ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.pagination span {
  color: #fff;
}
</style>
