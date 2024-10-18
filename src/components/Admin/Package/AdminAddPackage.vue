<template>
  <div class="addpackagecontainer">
    <h2 class="text-center mb-4">Thêm Gói Tiệc Mới</h2>
    <form @submit.prevent="createPackage">
      <!-- Tên gói -->
      <div class="form-group mb-3">
        <label for="name">Tên gói:</label>
        <input
          v-model="packageData.name"
          type="text"
          id="name"
          class="form-control"
          required
        />
      </div>

      <!-- Giá (tự động tính) -->
      <div class="form-group mb-3">
        <label for="price">Giá (tự động tính):</label>
        <input
          v-model="calculatedPrice"
          type="number"
          id="price"
          class="form-control"
          readonly
        />
      </div>

      <!-- Số bàn -->
      <div class="form-group mb-3">
        <label for="tables">Số bàn:</label>
        <input
          v-model="packageData.tables"
          @input="calculatePrice"
          type="number"
          id="tables"
          class="form-control"
          required
        />
      </div>

      <!-- Khuyến mãi -->
      <div class="form-group mb-3">
        <label for="promotion">Khuyến mãi (%):</label>
        <input
          v-model="packageData.promotion"
          @input="calculatePrice"
          type="number"
          id="promotion"
          class="form-control"
        />
      </div>

      <!-- Giá khuyến mãi -->
      <div class="form-group mb-3">
        <label for="discountedPrice">Giá khuyến mãi:</label>
        <input
          v-model="discountedPrice"
          type="number"
          id="discountedPrice"
          class="form-control"
          readonly
        />
      </div>

      <!-- Danh mục -->
      <div class="form-group">
        <label>Danh mục:</label>
        <select v-model="packageData.category" class="form-control" required>
          <option
            v-for="category in categoryPackages"
            :key="category._id"
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Mô tả -->
      <div class="form-group mb-3">
        <label for="description">Mô tả:</label>
        <textarea
          v-model="packageData.description"
          id="description"
          class="form-control"
        ></textarea>
      </div>

      <!-- Hình ảnh -->
      <div class="form-group mb-3">
        <label for="image">Hình ảnh (URL):</label>
        <input
          v-model="packageData.image"
          type="text"
          id="image"
          class="form-control"
        />
      </div>

      <!-- Combo món ăn -->
      <div class="form-group mb-3">
        <label>Combo món ăn:</label>
        <button type="button" class="btn btn-primary" @click="openModal">
          Chọn món ăn
        </button>

        <!-- Hiển thị danh sách món đã chọn -->
        <ul class="list-group mt-3">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="(dish, index) in selectedDishes"
            :key="dish._id"
          >
            <div>{{ dish.name }} - {{ dish.price }} VND</div>
            <div>
              <img
                :src="dish.image"
                alt="Dish Image"
                style="width: 50px; height: 50px; margin-right: 25px"
              />
              <!-- Nút bỏ chọn -->
              <button
                type="button"
                class="btn btn-danger btn-sm ml-2"
                @click="removeDish(index)"
              >
                Bỏ chọn
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Nút tạo gói tiệc -->
      <button type="submit" class="btn btn-success">Tạo Gói Tiệc</button>
    </form>

    <!-- Thông báo -->
    <p v-if="message" class="alert alert-info mt-3">{{ message }}</p>

    <!-- Modal chọn món ăn -->
    <div
      v-if="isModalOpen"
      class="modal fade show d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chọn danh mục món ăn</h5>
            <button type="button" class="close" @click="closeModal">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <!-- Danh mục món ăn -->
            <select
              v-model="selectedCategory"
              class="form-control mb-3"
              @change="fetchDishes"
            >
              <option
                v-for="category in categories"
                :key="category._id"
                :value="category.name"
              >
                {{ category.name }}
              </option>
            </select>

            <!-- Danh sách món ăn -->
            <ul class="list-group">
              <li
                class="list-group-item"
                v-for="dish in dishes"
                :key="dish._id"
                @click="selectDish(dish)"
              >
                {{ dish.name }} - {{ dish.price }} VND
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      packageData: {
        name: "",
        price: 0,
        tables: 0,
        promotion: 0,
        category: "",
        description: "",
        image: "",
        combo: "",
      },
      message: "",
      isModalOpen: false,
      categories: [],
      categoryPackages: [],
      selectedCategory: "",
      dishes: [],
      selectedDishes: [],
      calculatedPrice: 0,
      discountedPrice: 0,
    };
  },
  methods: {
    // Mở modal
    openModal() {
      this.isModalOpen = true;
      this.fetchCategories();
    },
    // Đóng modal
    closeModal() {
      this.isModalOpen = false;
    },
    // Lấy danh mục món ăn
    async fetchCategoryPackages() {
      try {
        const response = await axios.get(
          "http://localhost:3000/categorypackage/getCategoryPackage"
        );
        this.categoryPackages = response.data.data; // Lưu danh sách danh mục vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh mục package:", error);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get(
          "http://localhost:3000/category/getCategory"
        );
        this.categories = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    },
    // Lấy danh sách món ăn dựa trên danh mục đã chọn
    async fetchDishes() {
      try {
        const response = await axios.get("http://localhost:3000/dish/getDish", {
          params: {
            category: this.selectedCategory,
          },
        });
        this.dishes = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy món ăn:", error);
      }
    },
    // Chọn món ăn và thêm vào danh sách combo
    selectDish(dish) {
      this.selectedDishes.push(dish);
      this.packageData.combo = this.selectedDishes.map((d) => d._id).join(",");
      this.calculatePrice(); // Tính toán giá khi chọn món
      this.closeModal();
    },
    // Bỏ chọn món ăn
    removeDish(index) {
      this.selectedDishes.splice(index, 1); // Xóa món khỏi danh sách
      this.packageData.combo = this.selectedDishes.map((d) => d._id).join(",");
      this.calculatePrice(); // Cập nhật lại giá
    },
    // Tính toán giá
    calculatePrice() {
      const totalDishPrice = this.selectedDishes.reduce(
        (sum, dish) => sum + dish.price,
        0
      );
      this.calculatedPrice = totalDishPrice * this.packageData.tables;
      // Áp dụng khuyến mãi
      const discount =
        (this.calculatedPrice * this.packageData.promotion) / 100;
      this.discountedPrice = this.calculatedPrice - discount;
    },

    async createPackage() {
      try {
        this.packageData.price = this.calculatedPrice;
        const requestData = {
          ...this.packageData,
          combo: this.selectedDishes.map((dish) => dish._id),
        };
        const response = await axios.post(
          "http://localhost:3000/package/addPackage",
          requestData
        );
        this.message = response.data.message;
        this.resetForm();
      } catch (error) {
        this.message = "Có lỗi xảy ra khi tạo gói tiệc";
      }
    },
    resetForm() {
      this.packageData = {
        name: "",
        price: 0,
        tables: 0,
        promotion: 0,
        category: "",
        description: "",
        image: "",
        combo: "",
      };
      this.selectedDishes = [];
      this.calculatedPrice = 0;
      this.discountedPrice = 0;
    },
  },
  created() {
    this.fetchCategoryPackages();
  },
};
</script>

<style scoped>
.addpackagecontainer {
  background-color: #101827;
  padding: 20px;
  color: #f1f5f9;
  width: 100%;
  height: 100%;
}

h2 {
  color: #f1f5f9;
}

.form-control {
  background-color: #1e293b;
  color: #f1f5f9;
  border: 1px solid #334155;
}

.form-control::placeholder {
  color: #94a3b8;
}

label {
  color: #94a3b8;
}

.btn-primary {
  background-color: #2563eb;
  border-color: #2563eb;
}

.btn-success {
  background-color: #10b981;
  border-color: #10b981;
}

.btn-danger {
  background-color: #ef4444;
  border-color: #ef4444;
}

.modal-content {
  background-color: #1e293b;
  color: #f1f5f9;
}

.list-group-item {
  background-color: #1e293b;
  color: #f1f5f9;
}

.list-group-item:hover {
  background-color: #334155;
}

.modal-header,
.modal-footer {
  border-bottom: none;
  border-top: none;
}

.alert-info {
  background-color: #2563eb;
  color: #f1f5f9;
  border: none;
}
</style>
