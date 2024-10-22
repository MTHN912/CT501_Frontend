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
      <!-- Lặp qua các mục menu -->
      <li v-for="item in menuItems" :key="item.text" class="nav-item">
        <!-- Hiển thị các mục không có subItems -->
        <template v-if="!item.subItems || item.subItems.length === 0">
          <router-link :to="item.link" class="nav-link" active-class="active">
            <i :class="item.icon"></i>
            <span v-if="!isCollapsed">{{ item.text }}</span>
          </router-link>
        </template>

        <!-- Hiển thị các mục có subItems (dropdown) -->
        <template v-else>
          <a
            class="nav-link dropdown-toggle"
            href="#"
            @click.prevent="toggleDropdown(item.text)"
          >
            <i :class="item.icon"></i>
            <span v-if="!isCollapsed">{{ item.text }}</span>
          </a>
          <transition name="dropdown">
            <ul v-if="dropdowns[item.text]" class="dropdown-menu show">
              <li v-for="subItem in item.subItems" :key="subItem.text">
                <router-link :to="subItem.link" class="dropdown-item">
                  {{ subItem.text }}
                </router-link>
              </li>
            </ul>
          </transition>
        </template>
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
      dropdowns: {
        "Quản Lý Đơn Hàng": false,
        "Quản Lý Gói Tiệc": false,
      },
      menuItems: [
        {
          text: "Thống Kê Cửa Hàng",
          link: "/statistical",
          icon: "fas fa-store",
        },
        {
          text: "Quản Lý Người Dùng",
          link: "/adminUsers",
          icon: "fas fa-users",
        },
        {
          text: "Quản Lý Món Ăn",
          link: "/admindishes",
          icon: "fas fa-mortar-pestle",
        },
        {
          text: "Quản Lý Danh Mục",
          link: "/admincategorys",
          icon: "fas fa-boxes",
        },
        {
          text: "Quản Lý Đơn Tiệc",
          icon: "fas fa-receipt",
          subItems: [
            { text: "Đơn Tiệc", link: "/adminorder" },
            { text: "Đơn Mua Gói Tiệc", link: "/adminpackageorder" },
          ],
        },
        {
          text: "Quản Lý Gói Tiệc",
          icon: "fas fa-tags",
          subItems: [
            { text: "Thêm Gói", link: "/adminaddpackage" },
            { text: "Các Gói Tiệc", link: "/adminpackage" },
          ],
        },
      ],
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
      this.$emit("toggle-sidebar", this.isCollapsed);
    },
    toggleDropdown(menu) {
      console.log("Dropdown clicked:", menu); // Thêm lệnh console để kiểm tra
      const normalizedMenu = menu.trim(); // Loại bỏ khoảng trắng không cần thiết
      this.dropdowns[normalizedMenu] = !this.dropdowns[normalizedMenu];
      console.log("Dropdown status:", this.dropdowns[normalizedMenu]);
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch("getUserInfo");
      const isLoggedIn = this.$store.getters.isLoggedIn;
      const userInfo = this.$store.getters.userInfo;

      if (!isLoggedIn || !userInfo?.ROLE?.IS_ADMIN) {
        this.$router.push("/");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      this.$router.push("/");
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
  position: fixed;
  left: 0;
  top: 0;
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
  flex-direction: column;
  align-items: center;
}
.navbar-brand {
  font-size: 1.5rem;
  color: #ff8800;
}
.navbar-brand .logo {
  white-space: nowrap;
  display: inline-block;
}
.navbar-brand .logo span {
  color: #fff;
}
.sidebar-collapsed .navbar-brand .logo {
  white-space: normal;
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 10px;
}
.sidebar-collapsed .navbar-brand .logo span {
  display: none;
}
.btn-toggle {
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}
.sidebar-collapsed .btn-toggle {
  margin-top: 10px;
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
.nav-link.active {
  background-color: #2d2d42; /* Cùng màu với hover */
}
.nav-link i {
  margin-right: 15px;
}
.sidebar-collapsed .nav-link {
  justify-content: center;
  padding: 10px;
}
.sidebar-collapsed .nav-link span {
  display: none;
}
.sidebar-collapsed .nav-link i {
  margin-right: 0;
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
.dropdown-menu {
  display: block;
  background-color: #2d2d42;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}
/* Đảm bảo dropdown nằm trong sidebar */
.sidebar .dropdown-menu {
  position: relative; /* Đảm bảo dropdown nằm trong sidebar */
  background-color: #2d2d42;
  padding: 0;
  border-radius: 5px;
  width: 100%; /* Đảm bảo dropdown không mở rộng ra ngoài */
  max-width: 250px; /* Độ rộng tối đa của dropdown */
  overflow: hidden; /* Ẩn các phần dư thừa nếu có */
}

/* Điều chỉnh từng mục trong dropdown */
.sidebar .dropdown-menu .dropdown-item {
  color: #fff;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
  white-space: nowrap; /* Giúp các mục dropdown không bị tràn ra ngoài */
  overflow: hidden; /* Ẩn phần chữ bị tràn nếu có */
  text-overflow: ellipsis; /* Thêm dấu "..." nếu chữ quá dài */
}
/* Hover effect cho các item */
.sidebar .dropdown-menu .dropdown-item:hover {
  background-color: #3a3a57;
}
.sidebar .dropdown-menu .dropdown-item.active {
  background-color: #3a3a57; /* Cùng màu với hover */
}
/* Căn chỉnh dropdown với sidebar khi bị thu gọn */
.sidebar-collapsed .dropdown-menu {
  position: relative;
  max-width: 100%;
}

/* Khi dropdown hiển thị */
.dropdown-menu.show {
  display: block;
}

.dropdown-menu.show {
  max-height: 100%;
  opacity: 1;
}

.nav-item.dropdown .dropdown-menu {
  display: block;
  background-color: #2d2d42;
  margin-left: 20px;
  list-style: none;
  padding: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: 0;
  opacity: 0;
}
.nav-item.dropdown .dropdown-menu.show {
  max-height: 500px;
  opacity: 1;
}
.nav-item.dropdown .dropdown-item {
  color: #fff;
  padding: 10px 20px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s ease, padding 0.3s ease;
}
.nav-item.dropdown .dropdown-item:hover {
  background-color: #3a3a57;
  padding-left: 25px;
}
.sidebar-collapsed .nav-item.dropdown .dropdown-menu {
  position: relative; /* Đảm bảo dropdown không bị đẩy ra ngoài */
  max-width: 80px; /* Giới hạn kích thước theo chiều rộng của sidebar */
  padding: 0;
  display: block;
  visibility: visible;
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
