<template>
  <div class="packagecontainer">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <a href="/admin">Dashboard</a>
      <i class="fas fa-chevron-right"></i>
      <span>Danh Sách Gói Tiệc</span>
    </div>
    <div class="header">
      <h2 class="text-white">Danh Sách Gói Tiệc</h2>
    </div>
    <div class="form">
      <div class="form-group mb-3">
        <label class="text-white">Xem theo danh mục</label>
        <select
          v-model="categoryFilter"
          @change="fetchPackages"
          class="form-control ok"
        >
          <option value="">Tất cả</option>
          <option
            v-for="category in categories"
            :key="category._id"
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="row" v-if="partyPackages.length">
      <div class="col-md-4 mb-4" v-for="pkg in partyPackages" :key="pkg._id">
        <div class="card h-100 bg-dark text-white">
          <img
            v-if="pkg.image"
            :src="pkg.image"
            class="card-img-top"
            alt="Package Image"
            style="height: 200px; object-fit: cover"
          />
          <div class="card-body">
            <h4 class="card-title">{{ pkg.name }}</h4>
            <p class="card-text">Giá: {{ pkg.price.toLocaleString() }} VND</p>
            <p class="card-text">
              Giá khuyến mãi: {{ pkg.promotionalPrice.toLocaleString() }} VND
            </p>
            <p class="card-text">Số bàn: {{ pkg.tables }}</p>
            <p class="card-text">Khuyến mãi: {{ pkg.promotion }}%</p>
            <p class="card-text">Danh mục: {{ pkg.category }}</p>
            <p class="card-text">{{ pkg.description || "Không có mô tả" }}</p>
            <!-- Nút Chỉnh sửa -->
            <button @click="editPackage(pkg)" class="btn btn-warning">
              Chỉnh sửa
            </button>

            <!-- Form chỉnh sửa gói tiệc -->
            <div v-if="selectedPackage && selectedPackage._id === pkg._id">
              <input
                v-model="selectedPackage.name"
                placeholder="Tên gói tiệc"
                class="form-control mb-2"
              />
              <input
                v-model="selectedPackage.price"
                placeholder="Giá"
                class="form-control mb-2"
              />
              <input
                v-model="selectedPackage.promotion"
                placeholder="Khuyến mãi (%)"
                class="form-control mb-2"
              />
              <input
                v-model="selectedPackage.tables"
                placeholder="Số bàn"
                class="form-control mb-2"
              />
              <textarea
                v-model="selectedPackage.description"
                placeholder="Mô tả"
                class="form-control mb-2"
              ></textarea>
              <button
                @click="updatePackage(selectedPackage)"
                class="btn btn-success mt-2 me-2"
              >
                Cập nhật
              </button>
              <button
                type="button"
                class="btn btn-warning mt-2 me-2"
                @click="goToDetailUpdate(selectedPackage._id)"
              >
                Cập Nhật Chi Tiết
              </button>
              <button @click="closeEditForm" class="btn btn-secondary mt-2">
                Đóng
              </button>
            </div>
            <div v-if="pkg.combo.length">
              <h5>Combo món ăn:</h5>
              <ul class="list-group">
                <li
                  v-for="combo in pkg.combo"
                  :key="combo._id"
                  class="list-group-item bg-transparent text-white"
                >
                  <img
                    v-if="combo.image"
                    :src="combo.image"
                    class="img-thumbnail mr-2"
                    style="width: 60px; height: 60px; object-fit: cover"
                    alt="Combo Image"
                  />
                  <span
                    >{{ combo.name }} -
                    {{ combo.price.toLocaleString() }} VND</span
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="card-footer">
            <small class="text-muted"
              >Ngày tạo:
              {{ new Date(pkg.createdAt).toLocaleDateString() }}</small
            >
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-white">Không có gói tiệc nào.</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      partyPackages: [],
      categoryFilter: "",
      categories: [],
      selectedPackage: null,
    };
  },
  methods: {
    async fetchPackages() {
      try {
        const response = await axios.get(
          "http://localhost:3000/package/getPackage",
          {
            params: {
              category: this.categoryFilter,
            },
          }
        );
        this.partyPackages = response.data.data;
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy danh sách gói tiệc:", error);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get(
          "http://localhost:3000/categorypackage/getCategoryPackage"
        );
        this.categories = response.data.data; // Gán danh sách danh mục vào biến `categories`
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy danh sách danh mục:", error);
      }
    },
    editPackage(pkg) {
      this.selectedPackage = { ...pkg };
    },
    async updatePackage(pkg) {
      try {
        await axios.put(
          `http://localhost:3000/package/updatePackage/${pkg._id}`,
          pkg
        );
        alert("Gói tiệc đã được cập nhật thành công.");
        this.fetchPackages(); // Cập nhật lại danh sách gói tiệc
        this.selectedPackage = null; // Ẩn form chỉnh sửa
      } catch (error) {
        console.error("Có lỗi xảy ra khi cập nhật gói tiệc:", error);
      }
    },
    closeEditForm() {
      this.selectedPackage = null; // Đóng form chỉnh sửa
    },
    goToDetailUpdate(packageId) {
      // Kiểm tra nếu packageId tồn tại, sau đó điều hướng đến trang cập nhật
      if (packageId) {
        this.$router.push({
          name: "UpdatePackageDetails",
          params: { packageId },
        });
      } else {
        console.error("Không tìm thấy ID của gói tiệc để cập nhật.");
      }
    },
  },
  mounted() {
    this.fetchPackages();
    this.fetchCategories();
  },
};
</script>

<style scoped>
.packagecontainer {
  padding: 20px;
  background-color: #101827;
  color: #f8fafc;
  width: 100%;
  min-height: 100vh;
}
.breadcrumb {
  margin-bottom: 20px;
  color: #94a3b8;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb i {
  font-size: 0.75rem;
}
body {
  background-color: #101827;
  color: #f3f4f6;
  font-family: Arial, sans-serif;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: #1e293b;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #f8fafc;
  font-size: 2rem;
  font-weight: 600;
}

label {
  color: #e2e8f0;
}

input {
  background-color: #1f2937;
  color: #f3f4f6;
  border: 1px solid #374151;
  padding: 8px;
  margin-bottom: 20px;
  border-radius: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

li img {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin-right: 20px;
}

li h3 {
  color: #e2e8f0;
  margin: 0;
}

li p {
  margin: 5px 0;
}

.price-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.price-section p {
  color: #fbbf24; /* Màu vàng cho giá */
  font-weight: bold;
}

.promotional-price {
  color: #34d399; /* Màu xanh cho giá khuyến mãi */
}

.description {
  color: #9ca3af;
}

p.v-else {
  text-align: center;
  font-size: 18px;
  color: #f3f4f6;
}
.form {
  gap: 15px;
  margin-bottom: 30px;
  background: #1e293b;
  padding: 15px;
  border-radius: 12px;
}
.ok {
  width: 500px;
  display: inline-block;
  margin-left: 10px;
  margin-bottom: -10px;
}
</style>
