<template>
  <div class="container-fluid nav-bar fixed-top">
    <!-- fixed-top -->
    <div class="container">
      <nav class="navbar navbar-light navbar-expand-lg py-4">
        <router-link to="/" class="navbar-brand">
          <h1 class="text-primary fw-bold mb-0">
            MTHN<span class="text-dark">Restaurant</span>
          </h1>
        </router-link>
        <button
          class="navbar-toggler py-2 px-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span class="fa fa-bars text-primary"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav mx-auto">
            <router-link
              to="/"
              class="nav-item nav-link"
              exact-active-class="active"
              exact
              >Trang Chủ</router-link
            >
            <router-link
              to="/about"
              class="nav-item nav-link"
              active-class="active"
              >Giới Thiệu</router-link
            >
            <router-link
              to="/services"
              class="nav-item nav-link"
              active-class="active"
              >Khuyến Mãi</router-link
            >
            <router-link
              to="/events"
              class="nav-item nav-link"
              active-class="active"
              >Gói Tiệc</router-link
            >
            <router-link
              to="/menu"
              class="nav-item nav-link"
              active-class="active"
              >Món Ăn</router-link
            >
            <div class="nav-item dropdown">
              <a
                href="#"
                class="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                >Sự Kiện</a
              >
              <div class="dropdown-menu bg-light">
                <router-link
                  to="/book"
                  class="dropdown-item"
                  active-class="active"
                  >Tiệc Cưới</router-link
                >
                <router-link
                  to="/blog"
                  class="dropdown-item"
                  active-class="active"
                  >Sinh Nhật</router-link
                >
                <router-link
                  to="/team"
                  class="dropdown-item"
                  active-class="active"
                  >ABC</router-link
                >
                <router-link
                  to="/testimonial"
                  class="dropdown-item"
                  active-class="active"
                  >ABC2</router-link
                >
                <router-link
                  to="/404"
                  class="dropdown-item"
                  active-class="active"
                  >404 Page</router-link
                >
              </div>
            </div>
            <router-link
              to="/contact"
              class="nav-item nav-link"
              active-class="active"
              >Liên Hệ</router-link
            >
          </div>

          <!-- Phần giỏ hàng luôn hiển thị -->
          <div class="cart-summary">
            <router-link to="/cart" class="nav-link cart-icon">
              <i class="fas fa-shopping-cart"></i>
              <span class="badge bg-primary">{{ cartTotalQuantity }}</span>
            </router-link>
          </div>

          <!-- Nút tìm kiếm -->
          <button
            class="btn-search btn btn-primary btn-md-square me-4 rounded-circle d-none d-lg-inline-flex"
            data-bs-toggle="modal"
            data-bs-target="#searchModal"
          >
            <i class="fas fa-search"></i>
          </button>

          <!-- Dropdown cho tài khoản người dùng -->
          <div class="dropdown">
            <button
              class="btn btn-sm btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fas fa-user"></i>
            </button>

            <ul class="dropdown-menu dropdown-menu-end">
              <li v-if="isLoggedIn && isAdmin">
                <router-link
                  to="/admin"
                  class="dropdown-item"
                  active-class="active"
                >
                  Trang Quản Lý
                </router-link>
              </li>
              <li v-if="isLoggedIn">
                <!-- Thêm mục xem thông tin cá nhân -->
                <router-link
                  to="/profile"
                  class="dropdown-item"
                  active-class="active"
                >
                  Thông Tin Cá Nhân
                </router-link>
                <!-- Icon Xem Đơn Hàng -->
                <router-link
                  to="/orderlist"
                  class="dropdown-item"
                  active-class="active"
                >
                  Tiệc Của Bạn
                </router-link>
              </li>
              <li v-if="isLoggedIn">
                <button
                  @click="logout"
                  class="dropdown-item"
                  active-class="active"
                >
                  Đăng Xuất
                </button>
              </li>
              <li v-else>
                <router-link
                  to="/login"
                  class="dropdown-item"
                  active-class="active"
                >
                  Đăng Nhập</router-link
                >
              </li>
              <li v-if="!isLoggedIn">
                <router-link
                  to="/register"
                  class="dropdown-item"
                  active-class="active"
                >
                  Đăng Ký</router-link
                >
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Navbar",
  data() {
    return {
      cart: { items: [] },
    };
  },
  computed: {
    // Tính tổng số lượng món trong giỏ hàng
    cartTotalQuantity() {
      return this.cart.items.reduce((total, item) => total + item.quantity, 0);
    },
    // Kiểm tra trạng thái đăng nhập
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    // Kiểm tra quyền admin của người dùng
    isAdmin() {
      const userInfo = this.$store.getters.userInfo;
      return userInfo?.ROLE?.IS_ADMIN;
    },
    cartTotalQuantity() {
      // Tính tổng số lượng sản phẩm trong giỏ từ Vuex store
      return this.$store.state.cart.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
    cart() {
      return this.$store.state.cart;
    },
  },
  methods: {
    // Lấy dữ liệu giỏ hàng từ server
    async fetchCart() {
      try {
        const response = await axios.get("http://localhost:3000/cart/getCart");
        this.cart = response.data.cart;
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
      }
    },
    async logout() {
      try {
        await this.$store.dispatch("logout");
        // Điều hướng đến trang đăng nhập sau khi đăng xuất thành công
        this.$router.push("/login");
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
      }
    },
  },

  mounted() {
    // Tải giỏ hàng khi component được mount
    this.fetchCart();

    // Tự động cập nhật giỏ hàng khi Vuex Store thay đổi
    this.$store.watch(
      (state) => state.cart, // Theo dõi sự thay đổi của giỏ hàng trong store
      (newCart) => {
        this.cart = newCart; // Cập nhật giỏ hàng trong component
      }
    );
  },
};
</script>

<style scoped>
.cart-summary {
  position: relative;
}

.cart-icon {
  position: relative;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
}

.cart-icon .badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #ff6600;
  color: white;
}
/* .fixed-top {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1000;
} */
</style>
