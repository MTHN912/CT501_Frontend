<template>
  <div class="forgot-password-container">
    <!-- Nút mũi tên quay lại cho bước 2 và 3 -->
    <button v-if="step > 1" class="btn-back-top" @click="goBack">←</button>

    <h2 class="forgot-password-title">
      <span v-if="step === 1">Quên Mật Khẩu</span>
      <span v-else-if="step === 2">Nhập mã xác nhận</span>
      <span v-else>Đặt mật khẩu mới</span>
    </h2>

    <!-- Form gửi email để nhận mã OTP -->
    <form
      v-if="step === 1"
      @submit.prevent="requestOtp"
      class="form-forgot-password"
    >
      <div class="form-group">
        <input
          type="email"
          v-model="email"
          placeholder="Nhập email của bạn"
          required
          class="form-control"
        />
      </div>
      <button
        type="button"
        class="btn btn-primary btn-custom"
        @click="requestOtp"
      >
        Tiếp theo
      </button>
      <router-link to="/login" class="back-to-login"
        >Trở về đăng nhập</router-link
      >
    </form>

    <!-- Form nhập mã OTP -->
    <form
      v-if="step === 2"
      @submit.prevent="verifyOtp"
      class="form-forgot-password"
    >
      <div class="form-group">
        <input
          type="text"
          v-model="otp"
          placeholder="Nhập mã OTP"
          required
          class="form-control"
        />
      </div>
      <button type="submit" class="btn btn-primary btn-custom">
        Xác nhận OTP
      </button>
      <router-link to="/login" class="back-to-login"
        >Trở về đăng nhập</router-link
      >
    </form>

    <!-- Form đặt mật khẩu mới -->
    <form
      v-if="step === 3"
      @submit.prevent="resetPassword"
      class="form-forgot-password"
    >
      <div class="form-group">
        <input
          type="password"
          v-model="newPassword"
          placeholder="Nhập mật khẩu mới"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          v-model="confirmPassword"
          placeholder="Xác nhận mật khẩu mới"
          required
          class="form-control"
        />
      </div>
      <button type="submit" class="btn btn-primary btn-custom">
        Đổi mật khẩu
      </button>
      <router-link to="/login" class="back-to-login"
        >Trở về đăng nhập</router-link
      >
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const otp = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const step = ref(1); // Bước hiện tại: 1 - gửi email, 2 - nhập OTP, 3 - nhập mật khẩu mới

// Hiển thị thông báo SweetAlert2
const showAlert = (title, text, icon, timer = 3000) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    timer: timer,
    showConfirmButton: false,
    timerProgressBar: true,
  });
};

// Gửi yêu cầu gửi mã OTP
const requestOtp = async () => {
  try {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc chắn muốn gửi mã OTP đến email này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      // Nếu người dùng xác nhận, tiến hành gửi yêu cầu gửi mã OTP
      await axios.post("http://localhost:3000/user/forgetPassword", {
        email: email.value,
      });
      showAlert(
        "Thành công!",
        "Mã xác thực đã được gửi. Vui lòng kiểm tra email của bạn.",
        "success"
      );
      setTimeout(() => {
        step.value = 2; // Chuyển sang bước nhập OTP
      }, 3000); // Chờ vài giây trước khi chuyển bước
    }
  } catch (error) {
    showAlert(
      "Thất bại",
      error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
      "error"
    );
  }
};

// Biến lưu trữ mã OTP đã xác minh
let otpTokenVerified = null;

// Cập nhật lại hàm verifyOtp để lưu otpToken nếu xác minh thành công
const verifyOtp = async () => {
  try {
    const response = await axios.post("http://localhost:3000/user/verifyOTP", {
      email: email.value,
      otp: otp.value,
    });

    // Lưu mã OTP đã xác minh để dùng ở bước tiếp theo
    otpTokenVerified = response.data.otpToken;

    showAlert("Thành công", "OTP xác nhận thành công!", "success");
    setTimeout(() => {
      step.value = 3;
    }, 3000);
  } catch (error) {
    showAlert(
      "Thất bại",
      error.response?.data?.error || "Mã OTP không hợp lệ hoặc đã hết hạn.",
      "error"
    );
  }
};

// Cập nhật lại hàm resetPassword để gửi otpToken
const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    showAlert("Lỗi", "Mật khẩu xác nhận không khớp.", "error");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/user/resetPassword",
      {
        email: email.value,
        newPassword: newPassword.value,
        otpToken: otpTokenVerified, // Gửi otpToken đã được xác minh
      }
    );

    showAlert("Thành công", "Đổi mật khẩu thành công!", "success");
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  } catch (error) {
    showAlert(
      "Thất bại",
      error.response?.data?.error || "Có lỗi xảy ra. Vui lòng thử lại.",
      "error"
    );
  }
};

// Hàm quay lại bước trước đó
const goBack = () => {
  if (step.value > 1) {
    step.value--;
  }
};
</script>

<style scoped>
.forgot-password-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.btn-back-top {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #b58b47;
  cursor: pointer;
}

.btn-back-top:hover {
  color: #967035;
}

.forgot-password-title {
  font-size: 24px;
  font-weight: bold;
  color: #b58b47;
  text-align: center;
  margin-bottom: 20px;
}

.form-forgot-password {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.btn-custom {
  background-color: #b58b47;
  border: none;
  width: 100%;
  color: white;
  font-weight: bold;
}

.btn-custom:hover {
  background-color: #967035;
}

.back-to-login {
  display: block;
  margin-top: 10px;
  text-align: center;
  color: #b58b47;
  font-weight: bold;
  text-decoration: none;
}

.back-to-login:hover {
  text-decoration: underline;
}

.form-control {
  width: 400px;
}
</style>
