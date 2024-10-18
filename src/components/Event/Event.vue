<template>
  <div class="party-package">
    <h2>Gói Menu Ưu Đãi</h2>

    <!-- Loading danh mục hoặc gói tiệc -->
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
    <ul v-if="!isLoading">
      <li
        v-for="pkg in filteredPackages"
        :key="pkg.id"
        @click="fetchPackageDetails(pkg._id)"
        :class="{ selected: selectedPackage && selectedPackage.id === pkg._id }"
      >
        <img
          :src="pkg.image"
          alt="Image of {{ pkg.name }}"
          class="package-image"
        />
        <span>{{ pkg.name }} - {{ pkg.price }} VND</span>
        <!-- Hiển thị giá khuyến mãi nếu có -->
        <span v-if="pkg.promotion"
          >Giá khuyến mãi: {{ pkg.promotionalPrice }} VND</span
        >
        <span v-else>Giá: {{ pkg.price }} VND</span>
        <span>Danh mục: {{ pkg.category }}</span>
        <span>Số bàn: {{ pkg.tables }}</span>
        <span class="promotion" v-if="pkg.promotion"
          >Ưu đãi: {{ pkg.promotion }}%</span
        >
      </li>
    </ul>

    <!-- Hiển thị chi tiết gói tiệc khi được chọn -->
    <div v-if="selectedPackage" class="package-details" ref="packageDetails">
      <h3>Gói: {{ selectedPackage.name }}</h3>
      <!-- Hiển thị cả giá gốc và giá khuyến mãi -->
      <p>
        <strong>Giá:</strong>
        <span v-if="selectedPackage.promotion">
          <s>{{ selectedPackage.price }} VND</s>
          {{ selectedPackage.promotionalPrice }} VND
        </span>
        <span v-else>{{ selectedPackage.price }} VND</span>
      </p>
      <p><strong>Danh mục:</strong> {{ selectedPackage.category }}</p>
      <p><strong>Số bàn mặc định:</strong> {{ selectedPackage.tables }}</p>
      <p><strong>Mô tả:</strong> {{ selectedPackage.description }}</p>
      <p><strong>Ưu đãi:</strong> {{ selectedPackage.promotion }}%</p>

      <h4>Combo món chính:</h4>
      <ul>
        <li
          v-for="dish in selectedPackage.combo"
          :key="dish.name"
          class="dish-item"
        >
          <img
            :src="dish.image"
            alt="Image of {{ dish.name }}"
            class="dish-image"
          />
          <div class="dish-info">
            <h5>{{ dish.name }}</h5>
            <p>{{ dish.description }}</p>
            <p>Số lượng: x{{ dish.quantity }}</p>
          </div>
        </li>
      </ul>

      <button @click="handleBooking">Đặt tiệc</button>
      <button class="close-btn" @click="closePackageDetails">Đóng</button>
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
  margin-bottom: 20px; /* Tăng khoảng cách giữa tiêu đề và các phần tử khác */
}

ul {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(320px, 1fr)
  ); /* Điều chỉnh kích thước tối thiểu của các card */
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
}

li:hover {
  background-color: #f0f8ff;
  transform: scale(1.05); /* Tăng hiệu ứng phóng to khi hover */
  border-color: #1abc9c;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Tăng độ mờ của bóng khi hover */
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
  margin-bottom: 15px; /* Tạo khoảng cách giữa hình và nội dung */
}

.package-info {
  font-size: 18px; /* Tăng kích thước font chữ */
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
  max-width: 800px; /* Giới hạn chiều rộng */
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

/* Điều chỉnh khoảng cách và kiểu input */
input {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 50%;
  margin-top: 10px;
}

/* Sắp xếp lưới món ăn thêm */
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

/* Canh giữa các phần của trang */
h3,
h4,
h5 {
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

@media (max-width: 768px) {
  ul {
    grid-template-columns: 1fr; /* Đối với màn hình nhỏ, hiển thị 1 cột */
  }
}
</style>
