<template>
  <div class="container-fluid nav-bar">
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
          <button
            class="btn-search btn btn-primary btn-md-square me-4 rounded-circle d-none d-lg-inline-flex"
            data-bs-toggle="modal"
            data-bs-target="#searchModal"
          >
            <i class="fas fa-search"></i>
          </button>
          <!-- <div class="d-flex">
            <router-link
              to="/login"
              class="btn btn-sm btn-outline-primary rounded-circle me-2"
              active-class="active"
            >
              <i class="fas fa-user"></i>
            </router-link>
            <router-link
              to="/register"
              class="btn btn-sm btn-outline-primary rounded-circle"
              active-class="active"
            >
              <i class="fas fa-user-plus"></i>
            </router-link>
          </div> -->

          <!-- Dropdown cho nút trên thiết bị nhỏ -->
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
              <li>
                <router-link
                  to="/login"
                  class="dropdown-item"
                  active-class="active"
                  >Đăng Nhập</router-link
                >
              </li>
              <li>
                <router-link
                  to="/register"
                  class="dropdown-item"
                  active-class="active"
                  >Đăng Ký</router-link
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
export default {
  name: "Navbar",
};
</script>

<style scoped>
/* Add your CSS styles here, if necessary */
</style>
