<template>
  <div class="privacy-settings">
    <h2 class="title">Thiết Lập Riêng Tư</h2>
    <p>Chọn một trong các tùy chọn dưới đây để quản lý tài khoản của bạn.</p>

    <!-- Nút Yêu Cầu Xóa Tài Khoản -->
    <button class="delete-account-button" @click="confirmDeleteAccount">
      Yêu Cầu Xóa Tài Khoản
    </button>

    <!-- Nút Khóa Tài Khoản Tạm Thời -->
    <button class="lock-account-button" @click="confirmLockAccount">
      Khóa Tài Khoản Tạm Thời
    </button>
  </div>
</template>

<script>
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      showDeleteConfirmation: false, // Hiển thị hộp xác nhận xóa
      showLockConfirmation: false, // Hiển thị hộp xác nhận khóa
    };
  },
  computed: {
    ...mapGetters(["userInfo"]), // Lấy getter userInfo từ store
  },
  methods: {
    ...mapActions(["getUserInfo"]),

    // Hiển thị xác nhận xóa tài khoản
    confirmDeleteAccount() {
      Swal.fire({
        title: "Bạn có chắc chắn muốn xóa tài khoản?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xác Nhận Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteAccount();
        }
      });
    },

    // Thực hiện yêu cầu xóa tài khoản
    deleteAccount() {
      Swal.fire({
        icon: "success",
        title: "Yêu cầu xóa tài khoản đã được gửi.",
        showConfirmButton: false,
        timer: 1500,
      });
      // Thêm logic gửi yêu cầu xóa lên server nếu cần
    },

    // Hiển thị xác nhận khóa tài khoản
    confirmLockAccount() {
      Swal.fire({
        title: "Bạn có chắc chắn muốn khóa tài khoản tạm thời?",
        text: "Bạn có thể mở khóa lại sau.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xác Nhận Khóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          this.lockAccount();
        }
      });
    },

    // Thực hiện yêu cầu khóa tài khoản
    async lockAccount() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token không tồn tại.");

        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        const payload = {
          userId: userId,
          IS_BLOCKED: true,
        };

        const response = await fetch("http://localhost:3000/user/blockUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Có lỗi xảy ra khi khóa tài khoản."
          );
        }

        const updatedUser = await response.json();
        Swal.fire({
          icon: "success",
          title: "Tài khoản của bạn đã bị khóa tạm thời.",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log("User đã được cập nhật:", updatedUser);

        // Gọi action fetchUserInfo để cập nhật userInfo từ server sau khi khóa
        await this.getUserInfo();

        // Chuyển tiếp đến trang /profile sau khi cập nhật userInfo
        this.$router.push("/profile");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Không thể khóa tài khoản",
          text: error.message,
        });
      }
    },
  },
};
</script>

<style scoped>
.privacy-settings {
  text-align: center;
}
.title {
  margin-top: 120px;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
}

button {
  margin-top: 10px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
}

.delete-account-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
}

.lock-account-button {
  background-color: #f0ad4e;
  color: white;
  border: none;
}

.confirmation-modal {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  margin-top: 20px;
  color: white;
}

.confirmation-modal button {
  background-color: white;
  color: black;
  margin-right: 10px;
}
</style>
