<template>
  <div class="party-package">
    <p v-if="isLoading">Đang tải dữ liệu...</p>

    <div v-if="!isLoading" class="category-selector">
      <label for="fetchCategories">Danh mục Tiệc:</label>
      <select id="fetchCategories" v-model="selectedCategory">
        <option value="">Tất cả</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.name">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Danh sách gói tiệc -->
    <ul v-if="!isLoading">
      <li
        v-for="pkg in filteredPackages"
        :key="pkg.id"
        @click="fetchPackageDetails(pkg._id)"
        :class="{ selected: selectedPackage && selectedPackage.id === pkg._id }"
      >
        <img :src="pkg.image" :alt="pkg.name" class="package-image" />
        <div class="card-body">
          <h5 class="card-title">{{ pkg.name }}</h5>
          <div class="category-label">{{ pkg.category }}</div>
          <p class="price">{{ formatPrice(pkg.price) }}</p>
          <p v-if="pkg.promotion" class="promotion">
            Giá khuyến mãi: {{ formatPrice(pkg.promotionalPrice) }}
          </p>
          <p class="tables-info">Số bàn: {{ pkg.tables }}</p>
        </div>
      </li>
    </ul>

    <!-- Modal chi tiết -->
    <div
      v-if="selectedPackage"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedPackage.name }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="closePackageDetails"
            ></button>
          </div>

          <div class="modal-body">
            <div class="package-details">
              <div class="price-info">
                <p class="price">
                  <strong>Giá gốc:</strong>
                  {{ formatPrice(selectedPackage.price) }} VND
                </p>
                <p v-if="selectedPackage.promotion" class="promotion">
                  <strong>Giá khuyến mãi:</strong>
                  {{ formatPrice(selectedPackage.promotionalPrice) }} VND
                </p>
              </div>

              <div class="category-label">{{ selectedPackage.category }}</div>

              <p class="tables-info">
                <strong>Số bàn mặc định:</strong> {{ selectedPackage.tables }}
              </p>

              <p class="description">{{ selectedPackage.description }}</p>

              <h4 class="combo-title">Combo món chính:</h4>
              <div class="combo-list">
                <div
                  v-for="dish in selectedPackage.combo"
                  :key="dish.name"
                  class="list-group-item"
                >
                  <img :src="dish.image" :alt="dish.name" />
                  <h5>{{ dish.name }}</h5>
                  <p>{{ dish.description }}</p>
                  <p class="quantity">Số lượng: x{{ dish.quantity }}</p>
                </div>
              </div>
            </div>
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
    formatPrice(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
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
  margin-top: 50px;
  padding: 40px 30px;
  font-family: "Poppins", Arial, sans-serif;
  text-align: center;
  background-color: #faf8f5;
}

select {
  padding: 10px 15px;
  border: 2px solid #d4a067;
  border-radius: 8px;
  font-size: 16px;
  margin: 20px 0;
  background-color: white;
  color: #2c3e50;
  width: 250px;
}

select:focus {
  outline: none;
  border-color: #b78346;
  box-shadow: 0 0 0 2px rgba(212, 160, 103, 0.2);
}

ul {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 35px;
  margin: 30px 0;
}

li {
  padding: 0;
  cursor: pointer;
  border: none;
  border-radius: 20px;
  background-color: white;
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

li:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(212, 160, 103, 0.2);
}

li.selected {
  border: 2px solid #d4a067;
  background-color: #fff9f2;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 22px;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
}

.package-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 20px 20px 0 0;
}

.price {
  font-size: 20px;
  color: #2c3e50;
  margin: 15px 0;
}

.promotion {
  color: #d4a067;
  font-weight: 600;
  font-size: 18px;
  margin-top: 10px;
}

.category-label {
  background-color: #f8f1e9;
  color: #d4a067;
  padding: 5px 15px;
  border-radius: 15px;
  display: inline-block;
  margin: 10px 0;
  font-size: 14px;
}

.tables-info {
  color: #666;
  margin-top: 10px;
  font-size: 15px;
}

/* Modal Styling */
.modal {
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  max-height: 100vh;
}

.modal-dialog {
  max-width: 90%;
  width: 1200px;
  margin: 30px auto;
}
.modal-content {
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 20px;
  border: none;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.modal-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #f8f1e9;
  border-radius: 20px 20px 0 0;
  border-bottom: none;
}

.modal-footer {
  position: sticky;
  bottom: 0;
  z-index: 1000;
  background-color: white;
  border-top: 1px solid #f0e5d8;
  padding: 15px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.modal-title {
  color: #d4a067;
  font-weight: 600;
}

.btn-close {
  background-color: #d4a067;
  opacity: 1;
  padding: 10px;
}

.modal-body {
  padding: 30px;
  overflow-y: auto;
}
.combo-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 25px;
  padding: 0 15px;
}

.list-group-item {
  border: 1px solid #f0e5d8;
  border-radius: 15px;
  padding: 15px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
}

.list-group-item:hover {
  background-color: #fff9f2;
  border-color: #d4a067;
}

.list-group-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
}
.list-group-item h5 {
  font-size: 16px;
  margin: 10px 0;
  text-align: center;
}

.list-group-item p {
  font-size: 14px;
  margin: 5px 0;
  text-align: center;
}

/* Package Details Styling */
.package-details {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.price-info {
  margin-bottom: 20px;
}

.description {
  margin: 20px 0;
  line-height: 1.6;
}

.combo-title {
  margin: 30px 0 20px;
  color: #d4a067;
  font-weight: 600;
}
.btn {
  min-width: 120px;
  padding: 12px 25px;
}
.btn-success {
  background-color: #d4a067;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background-color: #b78346;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 160, 103, 0.3);
}

.btn-secondary {
  background-color: #e9ecef;
  color: #2c3e50;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 10px;
}

.btn-secondary:hover {
  background-color: #dee2e6;
  color: #2c3e50;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .modal-dialog {
    width: 95%;
    margin: 10px auto;
  }

  .combo-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .list-group-item img {
    height: 120px;
  }

  .modal-content {
    max-height: 90vh;
  }

  .modal-body {
    padding: 15px;
  }

  .package-details {
    padding: 10px;
  }
}

/* Scrollbar Styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #d4a067;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #b78346;
}
</style>
