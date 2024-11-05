<template>
  <div class="sidebar">
    <ul>
      <!-- Mục lớn "Tài Khoản Của Bạn" với icon và menu dropdown -->
      <li
        :class="{ active: activeMenuItem === 'Profile' || isDropdownOpen }"
        @click="toggleDropdown"
      >
        <i class="fas fa-user-circle"></i> Tài Khoản Của Bạn
      </li>

      <!-- Dropdown menu cho các mục con của "Tài Khoản Của Bạn" -->
      <ul v-show="isDropdownOpen" class="dropdown">
        <li
          :class="{ active: activeMenuItem === 'Profile' }"
          @click="navigateTo('Profile')"
        >
          Thông Tin Cá Nhân
        </li>
        <li
          :class="{ active: activeMenuItem === 'FavouriteList' }"
          @click="navigateTo('FavouriteList')"
        >
          Các món yêu thích
        </li>
        <li
          :class="{ active: activeMenuItem === 'Forgot-Password' }"
          @click="navigateTo('Forgot-Password')"
        >
          Đổi Mật Khẩu
        </li>
        <li
          :class="{ active: activeMenuItem === 'PrivacySettings' }"
          @click="navigateTo('PrivacySettings')"
        >
          Thiết Lập Riêng Tư
        </li>
      </ul>

      <!-- Các mục lớn khác với icon -->
      <li
        :class="{ active: activeMenuItem === 'OrderList' }"
        @click="navigateTo('OrderList')"
      >
        <i class="fas fa-calendar-alt"></i> Tiệc Của Bạn
      </li>
      <li
        :class="{ active: activeMenuItem === 'OrderListPackage' }"
        @click="navigateTo('OrderListPackage')"
      >
        <i class="fas fa-box"></i> Gói Của Bạn
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["activeMenuItem"],
  data() {
    return {
      isDropdownOpen: false, // Trạng thái mở/đóng của dropdown
    };
  },
  watch: {
    // Theo dõi sự thay đổi của route để cập nhật trạng thái dropdown
    $route(to) {
      this.updateDropdownState(to);
    },
  },
  mounted() {
    // Kiểm tra đường dẫn hiện tại khi component được mount
    this.updateDropdownState(this.$route);
  },
  methods: {
    updateDropdownState(route) {
      // Kiểm tra nếu route là một trong các mục con của "Tài Khoản Của Bạn"
      const subRoutes = [
        "/profile",
        "/favouritelist",
        "/forgot-password",
        "/privacysettings",
      ];
      this.isDropdownOpen = subRoutes.includes(route.path);
    },
    navigateTo(component) {
      this.$emit("navigate", component);
      // Sử dụng router để điều hướng
      this.$router.push(`/${component.toLowerCase()}`);
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
  },
};
</script>

<style scoped>
.sidebar {
  flex: 1;
  border-left: 1px solid #ddd;
  padding-left: 20px;
  width: 300px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar ul li {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.sidebar ul li:hover {
  background-color: #f0f0f0;
}
.sidebar li.active {
  background-color: #d4a762;
  color: white;
  font-weight: bold;
}

.dropdown {
  padding-left: 20px;
  border-left: 2px solid #ddd;
  transition: max-height 0.3s ease;
}

.dropdown li {
  font-size: 14px;
  padding: 8px 0;
  background-color: #f9f9f9;
}

ul.v-show.isDropdownOpen .dropdown {
  max-height: 500px;
}
.sidebar ul li i {
  margin-right: 8px;
}
</style>
