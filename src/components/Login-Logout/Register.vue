<template>
  <div class="register-container">
    <h2 class="register-title">Đăng Ký</h2>

    <form @submit.prevent="handleSubmit" class="register-form">
      <div class="form-row">
        <div class="form-group">
          <input
            type="text"
            id="fullname"
            v-model="registerForm.fullname"
            placeholder="Họ và tên"
            required
          />
          <p v-if="errors.fullname" class="error-message">
            {{ errors.fullname }}
          </p>
        </div>
        <div class="form-group">
          <input
            type="text"
            id="username"
            v-model="registerForm.username"
            placeholder="Tên tài khoản"
            required
          />
          <p v-if="errors.username" class="error-message">
            {{ errors.username }}
          </p>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <input
            type="email"
            id="email"
            v-model="registerForm.email"
            placeholder="Email"
            required
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>
        <div class="form-group">
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            id="password"
            v-model="registerForm.password"
            placeholder="Mật khẩu"
            required
          />
          <span class="toggle-password" @click="togglePasswordVisibility">
            <font-awesome-icon
              :icon="isPasswordVisible ? 'eye-slash' : 'eye'"
            />
          </span>
          <p v-if="errors.password" class="error-message">
            {{ errors.password }}
          </p>
        </div>
      </div>

      <!-- Address and Confirm Password in one row -->
      <div class="form-row">
        <div class="form-group">
          <input
            type="text"
            id="address"
            v-model="registerForm.address"
            placeholder="Địa chỉ"
            required
          />
          <!-- Hiển thị lỗi cho Địa chỉ -->
          <p v-if="errors.address" class="error-message">
            {{ errors.address }}
          </p>
        </div>
        <div class="form-group">
          <input
            :type="isConfirmPasswordVisible ? 'text' : 'password'"
            id="confirmPassword"
            v-model="registerForm.confirmPassword"
            placeholder="Xác nhận mật khẩu"
            required
          />
          <span
            class="toggle-password"
            @click="toggleConfirmPasswordVisibility"
          >
            <font-awesome-icon
              :icon="isConfirmPasswordVisible ? 'eye-slash' : 'eye'"
            />
          </span>
          <!-- Hiển thị lỗi cho Xác nhận mật khẩu -->
          <p v-if="errors.confirmPassword" class="error-message">
            {{ errors.confirmPassword }}
          </p>
        </div>
      </div>
      <div v-if="showOTP" class="form-row full-width otp-group">
        <div class="form-group full-width">
          <input
            type="text"
            id="otp"
            v-model="otp"
            placeholder="Nhập mã OTP"
            required
          />
          <button
            type="button"
            @click="resendOTP"
            :disabled="isOTPSending || otpTimer > 0"
            class="btn-resend-otp"
          >
            {{ otpTimer > 0 ? otpTimer : "Gửi lại" }}
          </button>
          <p v-if="errors.otp" class="error-message">{{ errors.otp }}</p>
        </div>
      </div>

      <button type="submit" class="btn-submit">
        {{ showOTP ? "Xác Thực" : "Đăng ký" }}
      </button>

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
          Đã có tài khoản?
          <router-link to="/login">Đăng nhập</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";

const registerForm = ref({
  fullname: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  address: "",
});

const errors = ref({
  fullname: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  address: "",
  otp: "",
});

const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const showOTP = ref(false);
const otp = ref("");
const otpTimer = ref(0);
const isOTPSending = ref(false);
const otpInterval = ref(null);
const router = useRouter();

const validateForm = () => {
  let isValid = true;
  errors.value = {
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    otp: "",
  };

  if (!registerForm.value.fullname) {
    errors.value.fullname = "Vui lòng nhập họ và tên.";
    isValid = false;
  }

  if (!registerForm.value.email) {
    errors.value.email = "Vui lòng nhập email.";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(registerForm.value.email)) {
    errors.value.email = "Email không hợp lệ.";
    isValid = false;
  }

  if (!registerForm.value.username) {
    errors.value.username = "Vui lòng nhập tên tài khoản.";
    isValid = false;
  }

  if (!registerForm.value.password) {
    errors.value.password = "Vui lòng nhập mật khẩu.";
    isValid = false;
  }

  if (!registerForm.value.confirmPassword) {
    errors.value.confirmPassword = "Vui lòng nhập lại mật khẩu.";
    isValid = false;
  } else if (
    registerForm.value.password !== registerForm.value.confirmPassword
  ) {
    errors.value.confirmPassword = "Mật khẩu không khớp.";
    isValid = false;
  }

  return isValid;
};
const handleSubmit = async () => {
  errors.value = {
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    address: "",
    otp: "",
  };

  if (!validateForm()) {
    return;
  }

  if (showOTP.value) {
    // Xác thực OTP
    try {
      const response = await axios.post(
        "http://localhost:3000/user/verifyOTPAndActivateUser",
        {
          otp: otp.value,
          email: registerForm.value.email,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Xác thực thành công!",
          icon: "success",
          confirmButtonText: "Đăng nhập",
        }).then(() => {
          router.push("/login");
        });
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        errors.value.otp = error.response.data.errors.OTP || "";
      } else {
        Swal.fire({
          title: "Xác thực thất bại",
          text: "Mã OTP không đúng, vui lòng thử lại",
          icon: "error",
        });
      }
    }
  } else {
    // Đăng ký người dùng
    try {
      const response = await axios.post("http://localhost:3000/user/register", {
        FULLNAME: registerForm.value.fullname,
        EMAIL: registerForm.value.email,
        USERNAME: registerForm.value.username,
        PASSWORD: registerForm.value.password,
        ADDRESS: registerForm.value.address, // Đảm bảo thêm địa chỉ vào request
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Đăng ký thành công!",
          text: "Vui lòng kiểm tra email để nhận mã OTP.",
          icon: "success",
        });
        showOTP.value = true;
        startNewOTPTimer(); // Bắt đầu đếm ngược ngay khi hiển thị trường OTP
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Hiển thị lỗi từ backend vào các trường tương ứng
        errors.value.fullname = error.response.data.errors.FULLNAME || "";
        errors.value.email = error.response.data.errors.EMAIL || "";
        errors.value.username = error.response.data.errors.USERNAME || "";
        errors.value.password = error.response.data.errors.PASSWORD || "";
        errors.value.confirmPassword =
          error.response.data.errors.CONFIRM_PASSWORD || "";
        errors.value.address = error.response.data.errors.ADDRESS || "";
      } else {
        Swal.fire({
          title: "Lỗi đăng ký",
          text: "Có lỗi xảy ra, vui lòng thử lại sau.",
          icon: "error",
        });
      }
    }
  }
};

const startNewOTPTimer = () => {
  otpTimer.value = 60;
  clearInterval(otpInterval.value);

  otpInterval.value = setInterval(() => {
    if (otpTimer.value > 0) {
      otpTimer.value--;
    } else {
      clearInterval(otpInterval.value);
    }
  }, 1000);
};
const resendOTP = async () => {
  if (isOTPSending.value || otpTimer.value > 0) return;

  isOTPSending.value = true;
  try {
    const response = await axios.post("http://localhost:3000/user/resendOTP", {
      email: registerForm.value.email,
    });

    if (response.status === 201) {
      Swal.fire({
        title: "OTP đã được gửi lại!",
        icon: "success",
      });
      startNewOTPTimer();
    }
  } catch (error) {
    console.error("Gửi lại OTP thất bại:", error);
    Swal.fire({
      title: "Lỗi",
      text: "Không thể gửi lại OTP, vui lòng thử lại sau.",
      icon: "error",
    });
  } finally {
    isOTPSending.value = false;
  }
};

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const toggleConfirmPasswordVisibility = () => {
  isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;
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
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
.register-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 25px;
  font-weight: bold;
  color: #d4a762;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-group {
  position: relative;
  width: 48%;
}

.form-group.full-width {
  width: 100%;
}

.form-group input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
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
  background: #d4a762;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.3s;
}

.btn-submit:hover {
  background: #c09759;
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
  margin-right: 10px;
  width: 24px;
  height: 24px;
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

.form-footer {
  margin-top: 25px;
  text-align: center;
}

.form-footer p {
  font-size: 14px;
}

.full-width {
  grid-column: span 2;
}

.otp-group {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.otp-group input {
  flex-grow: 1;
  margin-right: 10px;
}

.btn-resend-otp {
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
  white-space: nowrap;
  min-width: 80px;
}

.btn-resend-otp:hover {
  background: #0056b3;
}

.btn-resend-otp:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .register-container {
    max-width: 100%;
    margin: 20px;
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
  }

  .form-group,
  .form-group.full-width {
    width: 100%;
    margin-bottom: 15px;
  }
}
</style>
