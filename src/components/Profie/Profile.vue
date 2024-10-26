<template>
  <h2 class="title">Thông Tin Cá Nhân</h2>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-title">
        <label for="avatarInput">
          <div v-if="loadingAvatar" class="spinner"></div>
          <!-- Thêm hiệu ứng loading -->
          <img
            v-else
            :src="
              userInfo?.AVATAR ||
              avatarUrl ||
              'https://vivureviews.com/wp-content/uploads/2022/08/avatar-vo-danh-10.png'
            "
            alt="Avatar"
            class="avatar"
          />
        </label>
        <input
          id="avatarInput"
          type="file"
          style="display: none"
          ref="fileInput"
          @change="handleFileUpload"
        />
      </div>
      <div class="profile-info">
        <div class="info-item">
          <p>
            <strong>Tên đăng nhập:</strong>
            <span class="content">{{ userInfo?.USERNAME }}</span>
          </p>
        </div>
        <div class="info-item">
          <p>
            <strong>Họ và tên:</strong>
            <template v-if="!editing">
              <span class="content">{{ userInfo?.FULLNAME }}</span>
            </template>
            <input
              v-else
              type="text"
              :value="editData.FULLNAME"
              @input="updateEditData('FULLNAME', $event.target.value)"
            />
          </p>
        </div>
        <div class="info-item">
          <p>
            <strong>Số Điện Thoại:</strong>
            <template v-if="!editing">
              <span class="content">{{ userInfo?.PHONE }}</span>
            </template>
            <input
              v-else
              type="text"
              :value="editData.PHONE"
              @input="updateEditData('PHONE', $event.target.value)"
            />
          </p>
        </div>
        <div class="info-item">
          <p>
            <strong>Giới tính:</strong>
            <template v-if="!editing">
              <span class="content">{{ userInfo?.GENDER }}</span>
            </template>
            <select
              v-else
              :value="editData.GENDER"
              @change="updateEditData('GENDER', $event.target.value)"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </p>
        </div>
        <div class="info-item">
          <p>
            <strong>Địa chỉ:</strong>
            <template v-if="!editing">
              <span class="content">{{ userInfo?.ADDRESS }}</span>
            </template>
            <input
              v-else
              type="text"
              :value="editData.ADDRESS"
              @input="updateEditData('ADDRESS', $event.target.value)"
            />
          </p>
        </div>
      </div>
      <div class="action-buttons">
        <button v-if="!editing" @click="editProfile">Chỉnh sửa</button>
        <button v-if="editing" @click="saveProfile">Lưu</button>
        <button v-if="editing" @click="cancelEdit">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      avatarUrl: null,
      editing: false,
      loadingAvatar: false,
      editData: {
        FULLNAME: "",
        PHONE: "",
        ADDRESS: "",
        GENDER: "",
        AVATAR: "",
      },
      originalData: {},
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    handleFileUpload(event) {
      const file = event.target.files[0]; // Nhận file từ input
      if (file) {
        this.uploadAvatar(file);
      }
    },

    async uploadAvatar(file) {
      const formData = new FormData();
      formData.append("image", file); // Đặt tên trường là "image" theo yêu cầu của API
      this.loadingAvatar = true;

      try {
        // Gọi API upload
        const response = await axios.post(
          "http://localhost:3000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Định dạng multipart
            },
          }
        );

        // Kiểm tra nếu API trả về thành công
        if (response.data.success) {
          const imageUrl = response.data.data.url; // Lấy link ảnh từ JSON trả về
          this.avatarUrl = imageUrl; // Cập nhật avatarUrl để hiển thị ảnh mới
          this.editData.AVATAR = imageUrl; // Cập nhật link vào editData

          // Gọi API updateUserInfo để cập nhật trường AVATAR
          await this.updateUserInfo({ AVATAR: imageUrl });

          // Cập nhật lại thông tin người dùng từ API
          await this.getUserInfo();
        } else {
          console.error("Lỗi upload avatar:", response.data.message);
        }
      } catch (error) {
        console.error("Lỗi upload avatar:", error);
      } finally {
        this.loadingAvatar = false; // Kết thúc hiệu ứng loading
      }
    },
    editProfile() {
      this.originalData = { ...this.userInfo };
      this.editData = {
        FULLNAME: this.userInfo.FULLNAME,
        PHONE: this.userInfo.PHONE,
        ADDRESS: this.userInfo.ADDRESS,
        GENDER: this.userInfo.GENDER,
      };
      this.editing = true;
    },
    async saveProfile() {
      try {
        const filteredEditData = this.filterEmptyFields(this.editData);
        const updatedUser = await this.updateUserInfo(filteredEditData);
        await this.getUserInfo();
        this.editing = false;
      } catch (error) {
        console.error(
          "Lỗi cập nhật thông tin:",
          error.response?.data?.message || error.message
        );
      }
    },
    filterEmptyFields(data) {
      return Object.keys(data)
        .filter((key) => data[key] !== null && data[key] !== "")
        .reduce((acc, key) => {
          acc[key] = data[key];
          return acc;
        }, {});
    },
    async updateUserInfo(updatedUser) {
      try {
        const response = await axios.put(
          "http://localhost:3000/user/updateUser",
          updatedUser
        );
        return response.data;
      } catch (error) {
        console.error(
          "Lỗi cập nhật thông tin:",
          error.response?.data?.message || error.message
        );
        throw error;
      }
    },
    updateEditData(field, value) {
      this.editData[field] = value;
    },
    cancelEdit() {
      this.editData = { ...this.originalData };
      this.editing = false;
    },
  },
  mounted() {
    if (!this.userInfo) {
      this.getUserInfo();
    }
    window.scrollTo(0, 0);
  },
};
</script>

<style scoped>
.title {
  margin-top: 120px;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
}
.profile-container {
  display: flex;
  justify-content: center;
  height: 100%;
}

.profile-card {
  width: 95%;
  padding: 40px; /* Tăng padding cho cảm giác thoáng hơn */
  background-color: #f0f2f5;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  height: 600px;
}

.profile-title {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column; /* Đảm bảo tiêu đề và avatar xếp theo cột */
  gap: 10px;
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  margin-bottom: 10px;
  width: 150px; /* Tăng kích thước lớn hơn nữa */
  height: 150px; /* Tăng kích thước lớn hơn nữa */
  border-radius: 50%;
}

.profile-info {
  margin-top: 20px;
}

.info-item {
  margin-bottom: 10px;
  font-size: 16px;
  text-align: left;
}

.info-item strong {
  font-weight: bold;
  font-size: 18px;
}

.info-item p {
  font-size: 16px;
}
.info-item input,
.info-item select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.action-buttons {
  display: flex;
  justify-content: center; /* Căn giữa các nút */
  gap: 10px;
}

button {
  padding: 10px 20px; /* Tăng kích thước nút */
  border-radius: 5px; /* Làm nút trông tròn hơn */
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1890ff;
  color: white;
}

@media screen and (max-width: 768px) {
  .profile-card {
    width: 100%;
  }
}

.content {
  margin-left: 8px;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
