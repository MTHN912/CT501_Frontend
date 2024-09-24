<template>
  <div :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]">
    <!-- Khu vực Logo thương hiệu và Nút thu/phóng -->
    <div class="brand-toggle">
      <router-link to="/" class="navbar-brand">
        <div class="logo">MTHN<span>Restaurant</span></div>
      </router-link>

      <!-- Nút toggle thu/phóng với icon -->
      <button class="btn btn-toggle" @click="toggleSidebar">
        <i v-if="isCollapsed" class="fas fa-bars"></i>
        <i v-else class="fas fa-angle-left"></i>
      </button>
    </div>

    <!-- Danh sách điều hướng với icon -->
    <ul class="nav flex-column">
      <li class="nav-item" v-for="item in menuItems" :key="item.text">
        <router-link :to="item.link" class="nav-link" active-class="active">
          <i :class="item.icon"></i>
          <!-- Icon -->
          <span v-if="!isCollapsed">{{ item.text }}</span>
        </router-link>
      </li>
    </ul>

    <!-- Thông tin quản trị viên ở dưới cùng -->
    <div class="user-profile" v-if="!isCollapsed">
      <img
        src="https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-6/358476609_1927355997635186_4515249726350529893_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=pahMH1moF2kQ7kNvgF-80ln&_nc_ht=scontent.fsgn2-4.fna&oh=00_AYDk6sXSfbRWE5zOBd2eW329Uw1nSjV41f7uYuQjewBJPA&oe=66F82F5A"
        alt="Admin Avatar"
        class="avatar"
      />
      <div class="user-info">
        <span class="user-name">MTHN Admin</span>
        <i class="fas fa-ellipsis-h"></i>
        <!-- Icon tùy chỉnh -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      isCollapsed: false,
      menuItems: [
        {
          text: "Quản Lý Người Dùng",
          link: "/adminUsers",
          icon: "fas fa-users",
        },
        {
          text: "Quản Lý Món Ăn",
          link: "/admindishes",
          icon: "fas fa-boxes",
        },
        {
          text: "Quản Lý Đơn Hàng",
          link: "/admin/orders",
          icon: "fas fa-receipt",
        },
        {
          text: "Quản Lý Khuyến Mãi",
          link: "/admin/promotions",
          icon: "fas fa-tags",
        },
        {
          text: "Quản Lý Sự Kiện",
          link: "/admin/events",
          icon: "fas fa-calendar-alt",
        },
      ],
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch("getUserInfo"); // Gọi action để lấy thông tin người dùng
      const isLoggedIn = this.$store.getters.isLoggedIn;
      const userInfo = this.$store.getters.userInfo;

      if (!isLoggedIn || !userInfo?.ROLE?.IS_ADMIN) {
        this.$router.push("/"); // Điều hướng về trang chủ
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      this.$router.push("/"); // Điều hướng về trang chủ nếu có lỗi
    }
  },
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: rgba(21, 30, 47, 1);
  height: 100vh;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease-in-out;
}

.sidebar-collapsed {
  width: 80px;
}

.brand-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #2d2d42;
}

.sidebar-collapsed .brand-toggle {
  flex-direction: column; /* Xếp các phần tử theo chiều dọc */
  align-items: center; /* Căn giữa các phần tử theo chiều ngang */
}

.navbar-brand {
  font-size: 1.5rem;
  color: #ff8800;
}

.navbar-brand .logo {
  white-space: nowrap; /* Giữ toàn bộ logo trên một dòng nếu đủ không gian */
  display: inline-block;
}

.navbar-brand .logo span {
  color: #fff;
}

.sidebar-collapsed .navbar-brand .logo {
  white-space: normal; /* Logo tự xuống dòng khi sidebar thu nhỏ */
  text-align: center; /* Căn giữa logo */
  font-size: 1.2rem; /* Giảm kích thước logo khi thu nhỏ */
  margin-bottom: 10px; /* Khoảng cách giữa logo và nút thu/phóng */
}
.sidebar-collapsed .navbar-brand .logo span {
  display: none; /* Ẩn chữ "Restaurant" khi sidebar thu nhỏ */
}

.btn-toggle {
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}

.sidebar-collapsed .btn-toggle {
  margin-top: 10px; /* Tạo khoảng cách giữa logo và nút thu/phóng */
}

.nav {
  list-style: none;
  padding: 0;
}

.nav-item {
  margin: 15px 0;
}

.nav-link {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.3s ease;
  padding: 10px 20px;
  border-radius: 10px;
}

.nav-link:hover {
  background-color: #2d2d42;
}

.nav-link i {
  margin-right: 15px;
}

.sidebar-collapsed .nav-link {
  justify-content: center;
}

.sidebar-collapsed .nav-link span {
  display: none;
}

.user-profile {
  margin-top: auto;
  display: flex;
  align-items: center;
  padding: 15px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.user-name {
  font-size: 1rem;
}

.sidebar-collapsed .user-profile {
  justify-content: center;
}

.sidebar-collapsed .user-name {
  display: none;
}
</style>
