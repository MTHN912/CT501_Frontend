<template>
  <div class="packagecontainer">
    <h2 class="text-white">Danh Sách Gói Tiệc</h2>
    <div class="form-group mb-3">
      <label class="text-white">Lọc theo danh mục:</label>
      <select
        v-model="categoryFilter"
        @change="fetchPackages"
        class="form-control"
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
  },
  mounted() {
    this.fetchPackages();
    this.fetchCategories();
  },
};
</script>

<style scoped>
.packagecontainer {
  background-color: #101827;
  padding: 20px;
  color: #f1f5f9;
  width: 100%;
  height: 100%;
}
body {
  background-color: #101827;
  color: #f3f4f6;
  font-family: Arial, sans-serif;
}

h2 {
  color: #e2e8f0;
  text-align: center;
  margin-bottom: 20px;
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
</style>
