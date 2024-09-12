<template>
  <div class="login-container">
    <!-- Tiêu đề Đăng nhập -->
    <h2 class="login-title">Đăng Nhập</h2>

    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="form-group">
        <input
          type="text"
          id="username"
          v-model="loginForm.username"
          placeholder="Tên tài khoản"
          required
        />
      </div>

      <div class="form-group">
        <input
          :type="isPasswordVisible ? 'text' : 'password'"
          id="password"
          v-model="loginForm.password"
          placeholder="Mật khẩu"
          required
        />
        <span class="toggle-password" @click="togglePasswordVisibility">
          <!-- Biểu tượng toggle mật khẩu -->
          <font-awesome-icon :icon="isPasswordVisible ? 'eye-slash' : 'eye'" />
        </span>
      </div>

      <button type="submit" class="btn-submit">Đăng nhập</button>

      <div class="form-links">
        <router-link to="/forgot-password">Quên mật khẩu</router-link>
        <router-link to="/sms-login">Đăng nhập với SMS</router-link>
      </div>

      <div class="divider">HOẶC</div>

      <div class="social-login">
        <button
          type="button"
          class="btn-social btn-facebook"
          @click="handleFacebookLogin"
        >
          <img
            src="https://cdn.freebiesupply.com/logos/large/2x/facebook-3-logo-png-transparent.png"
            class="social-icon"
            alt="Facebook Logo"
          />
          Facebook
        </button>
        <button
          type="button"
          class="btn-social btn-google"
          @click="handleGoogleLogin"
        >
          <img
            src="https://www.pngall.com/wp-content/uploads/13/Google-Logo.png"
            class="social-icon"
            alt="Google Logo"
          />
          Google
        </button>
      </div>

      <div class="form-footer">
        <p>
          Bạn mới biết đến MTHN Restaurant ?
          <router-link to="/register">Đăng ký</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref } from "vue";
import { useRouter } from "vue-router";

const loginForm = ref({
  username: "",
  password: "",
});

const isPasswordVisible = ref(false);

const router = useRouter();

const handleSubmit = () => {
  if (loginForm.value.username && loginForm.value.password) {
    console.log("Tên đăng nhập:", loginForm.value.username);
    console.log("Mật khẩu:", loginForm.value.password);
    router.push("/");
  } else {
    alert("Vui lòng nhập đầy đủ thông tin");
  }
};

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const handleFacebookLogin = () => {
  console.log("Login with Facebook");
  // Thêm logic đăng nhập qua Facebook
};

const handleGoogleLogin = () => {
  console.log("Login with Google");
  // Thêm logic đăng nhập qua Google
};
</script>

<style scoped>
/* Styling của phần login form */
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px; /* Tăng padding để tạo không gian */
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Giảm độ tối của bóng */
}

.login-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 25px;
  font-weight: bold;
  color: #ee4d2d;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  position: relative;
  margin-bottom: 25px; /* Tăng khoảng cách giữa các trường */
}

.form-group input {
  width: 100%;
  padding: 14px; /* Tăng padding */
  border: 1px solid #ddd;
  border-radius: 8px; /* Tăng border-radius để các ô trở nên mềm mại hơn */
  font-size: 16px; /* Tăng kích thước chữ */
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(45deg, #ee4d2d, #ff5733); /* Thêm gradient */
  color: white;
  border: none;
  border-radius: 8px; /* Tăng border-radius */
  cursor: pointer;
  font-size: 18px; /* Tăng kích thước chữ */
  transition: background 0.3s; /* Hiệu ứng chuyển màu khi hover */
}

.btn-submit:hover {
  background: linear-gradient(
    45deg,
    #ff5733,
    #ff6f61
  ); /* Thay đổi gradient khi hover */
}

.form-links {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  font-size: 14px;
}

.form-links a {
  color: #007bff;
  text-decoration: none;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 12px;
  color: #888;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #ddd;
  margin: 0 10px;
}

.social-login {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-social {
  width: 48%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #333;
  transition: all 0.3s ease;
}

.social-icon {
  margin-right: 10px; /* Thêm khoảng cách giữa logo và chữ */
  width: 24px; /* Điều chỉnh kích thước logo */
  height: 24px; /* Điều chỉnh kích thước logo */
}

.btn-facebook {
  color: #3b5998;
  border-color: #3b5998;
}

.btn-google {
  color: #db4437;
  border-color: #db4437;
}

.btn-facebook:hover {
  background-color: #3b5998;
  color: white;
}

.btn-google:hover {
  background-color: #db4437;
  color: white;
}

.btn-google:hover {
  background-color: #db4437; /* Thay đổi nền khi hover */
  color: white;
}

.form-footer {
  margin-top: 25px;
  text-align: center;
}

.form-footer p {
  font-size: 14px;
}
</style>
