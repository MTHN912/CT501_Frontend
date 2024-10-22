<template>
  <div class="party-package">
    <p v-if="isLoading">Đang tải dữ liệu...</p>

    <!-- Hiển thị danh mục tiệc -->
    <label for="fetchCategories" v-if="!isLoading">Danh mục Tiệc:</label>
    <select id="fetchCategories" v-if="!isLoading" v-model="selectedCategory">
      <option value="">Tất cả</option>
      <option v-for="cat in categories" :key="cat.id" :value="cat.name">
        {{ cat.name }}
      </option>
    </select>

    <!-- Danh sách gói tiệc -->
    <ul v-if="!isLoading" class="row list-unstyled">
      <li
        v-for="pkg in filteredPackages"
        :key="pkg.id"
        @click="fetchPackageDetails(pkg._id)"
        class="col-md-4 mb-4"
      >
        <div
          :class="{
            'card selected': selectedPackage && selectedPackage.id === pkg._id,
          }"
        >
          <img
            :src="pkg.image"
            class="card-img-top"
            alt="Image of {{ pkg.name }}"
          />
          <div class="card-body">
            <h5 class="card-title">{{ pkg.name }}</h5>
            <p class="card-text">{{ pkg.price }} VND</p>
            <p v-if="pkg.promotion" class="text-danger">
              Giá khuyến mãi: {{ pkg.promotionalPrice }} VND
            </p>
            <p v-else>Giá: {{ pkg.price }} VND</p>
            <p>Danh mục: {{ pkg.category }}</p>
            <p>Số bàn: {{ pkg.tables }}</p>
          </div>
        </div>
      </li>
    </ul>

    <!-- Hiển thị chi tiết gói tiệc khi được chọn -->
    <!-- Modal Bootstrap -->
    <div
      v-if="selectedPackage"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Gói: {{ selectedPackage.name }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="closePackageDetails"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              <strong>Giá:</strong>
              {{ selectedPackage.promotionalPrice || selectedPackage.price }}
              VND
            </p>
            <p><strong>Danh mục:</strong> {{ selectedPackage.category }}</p>
            <p>
              <strong>Số bàn mặc định:</strong> {{ selectedPackage.tables }}
            </p>
            <p><strong>Mô tả:</strong> {{ selectedPackage.description }}</p>

            <h4>Combo món chính:</h4>
            <ul class="combo-list">
              <li
                v-for="dish in selectedPackage.combo"
                :key="dish.name"
                class="list-group-item"
              >
                <img
                  :src="dish.image"
                  alt="Image of {{ dish.name }}"
                  class="img-thumbnail"
                />
                <div class="d-inline-block">
                  <h5>{{ dish.name }}</h5>
                  <p>{{ dish.description }}</p>
                  <p>Số lượng: x{{ dish.quantity }}</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" @click="handleBooking">
              Đặt tiệc
            </button>
            <button class="btn btn-secondary" @click="closePackageDetails">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="purchaseStatus">{{ purchaseStatus }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      partyPackages: [], // Gói tiệc sẽ được lấy từ API
      selectedCategory: "", // Danh mục tiệc đang chọn
      selectedPackage: null,
      purchaseStatus: "",
      categories: [], // Danh mục tiệc sẽ được lấy từ API
      isLoading: true, // Trạng thái đang tải dữ liệu
      isLoggedIn: false,
    };
  },
  computed: {
    // Lọc các gói tiệc dựa trên danh mục đã chọn
    filteredPackages() {
      if (!this.selectedCategory) {
        return this.partyPackages;
      }
      return this.partyPackages.filter(
        (pkg) => pkg.category === this.selectedCategory
      );
    },
  },
  methods: {
    handleBooking() {
      if (this.selectedPackage) {
        // Nếu đã đăng nhập và có gói tiệc được chọn, chuyển hướng đến trang thanh toán
        this.$router.push({
          name: "CheckoutPackage", // Đặt tên route cho trang thanh toán
          params: { id: this.selectedPackage._id }, // Truyền packageId trong params
        });
      } else {
        alert("Vui lòng chọn một gói tiệc trước khi đặt.");
      }
    },
    // Lấy danh mục tiệc từ API
    async fetchCategories() {
      try {
        const response = await axios.get(
          "http://localhost:3000/categorypackage/getCategoryPackage"
        );
        this.categories = response.data.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    },
    // Lấy danh sách gói tiệc từ API
    async fetchPackages() {
      try {
        const response = await axios.get(
          "http://localhost:3000/package/getPackage"
        );
        this.partyPackages = response.data.data;
      } catch (error) {
        console.error("Lỗi khi lấy gói tiệc:", error);
      } finally {
        this.isLoading = false; // Tắt trạng thái đang tải khi dữ liệu đã được tải xong
      }
    },
    // Lấy chi tiết gói tiệc từ API
    async fetchPackageDetails(packageId) {
      try {
        const response = await fetch(
          `http://localhost:3000/package/getPackageById/${packageId}`
        );
        const data = await response.json();
        if (data.success) {
          this.selectedPackage = data.data;
          // this.numTables = this.selectedPackage.tables + 1;
          this.$nextTick(() => {
            const packageDetails = this.$refs.packageDetails;
            if (packageDetails) {
              packageDetails.scrollIntoView({ behavior: "smooth" });
            }
          });
        } else {
          console.error("Lỗi khi lấy chi tiết gói tiệc:", data.message);
        }
      } catch (error) {
        console.error("Lỗi kết nối khi lấy chi tiết gói tiệc:", error);
      }
    },
    // Đóng phần chi tiết gói tiệc và cuộn về đầu trang
    closePackageDetails() {
      this.selectedPackage = null;
      window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn về đầu trang
    },
  },
  // Lấy dữ liệu khi component được tạo
  created() {
    this.fetchCategories();
    this.fetchPackages();
  },
};
</script>

<style scoped>
.party-package {
  margin-top: 100px;
  padding: 30px 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

h2,
h3,
h4 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px; /* Tăng khoảng cách giữa các thẻ */
  margin: 20px 0;
}

li {
  padding: 20px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 15px; /* Tăng độ bo tròn cho các thẻ */
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Tăng độ mờ của bóng */
  text-align: left;
  max-width: 320px; /* Giới hạn chiều rộng tối đa của thẻ */
}

li:hover {
  background-color: #f0f8ff;
  transform: scale(1.05);
  border-color: #1abc9c;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

li.selected {
  background-color: #d3f9d8;
  border-color: #28a745;
}

.package-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
}

.package-info {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.promotion {
  font-weight: bold;
  color: #d35400;
  margin-top: 10px;
}

.package-details {
  margin-top: 20px;
  background-color: #f4f6f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

button {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

button:hover {
  background-color: #218838;
}

.close-btn {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.close-btn:hover {
  background-color: #c82333;
}

.promotion {
  font-weight: bold;
  color: #d35400;
}

.package-details-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
}

.dish-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.dish-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

.dish-info {
  text-align: center;
  font-size: 14px;
}

input {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 50%;
  margin-top: 10px;
}

ul.extra-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

li.extra-item {
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;
  text-align: center;
  width: 150px;
}
.modal-content {
  width: 1500px; /* Tăng chiều rộng modal */
  height: 700px; /* Giới hạn chiều cao modal để không chiếm quá nhiều không gian */
  overflow-y: auto; /* Thêm thanh cuộn dọc nếu nội dung vượt quá chiều cao */
  margin-left: -340px;
  padding: 20px;
}
.modal-header,
.modal-body,
.modal-footer {
  padding: 20px;
}

.modal-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.combo-list {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(200px, 1fr)
  ); /* Tạo nhiều cột với kích thước tối thiểu */
  gap: 20px; /* Khoảng cách giữa các món */
  margin-top: 20px;
  width: 100%; /* Để lưới combo chiếm toàn bộ chiều rộng modal */
}

.list-group-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.list-group-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}
.modal-footer {
  display: flex;
  justify-content: center;
}

.modal-body img {
  width: 100%; /* Hình ảnh sẽ rộng tối đa nhưng không vượt quá modal */
  height: auto;
}

.modal-body h2,
.modal-body h3 {
  text-align: center;
}
button {
  margin: 20px;
  padding: 12px 24px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #218838;
}
/* Giảm thiểu modal che khuất header */
.modal {
  top: 10vh; /* Đảm bảo modal cách xa header */
}
@media (max-width: 768px) {
  .modal-content {
    max-width: 100%;
    max-height: 90vh; /* Tăng chiều cao tối đa trên thiết bị nhỏ */
  }
}

@media (max-width: 768px) {
  ul {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
