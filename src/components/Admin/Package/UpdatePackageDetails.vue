<template>
  <div class="updatepackagecontainer">
    <div class="breadcrumb">
      <a href="/admin">Dashboard</a>
      <i class="fas fa-chevron-right"></i>
      <a href="/adminpackage">Danh Sách Gói Tiệc</a>
      <i class="fas fa-chevron-right"></i>
      <span>Cập Nhật Gói Tiệc</span>
    </div>
    <div class="header">
      <h2 class="text-center mb-4">Cập Nhật Thông Tin Gói Tiệc</h2>
    </div>
    <form @submit.prevent="updatePackage">
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
        <label for="image">Hình ảnh:</label>
        <input
          type="file"
          id="image"
          class="form-control"
          @change="uploadImage"
          accept="image/*"
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

      <!-- Nút cập nhật gói tiệc -->
      <button type="submit" class="btn btn-success">Cập Nhật Gói Tiệc</button>
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
import Swal from "sweetalert2";

export default {
  props: ["packageId"],
  data() {
    return {
      packageData: {
        name: "",
        tables: 0,
        promotion: 0,
        category: "",
        description: "",
        combo: [],
      },
      message: "",
      isModalOpen: false,
      selectedCategory: null,
      categories: [],
      dishes: [],
      selectedDishes: [],
      calculatedPrice: 0,
      discountedPrice: 0,
    };
  },
  methods: {
    async fetchPackageDetails() {
      try {
        const packageId = this.packageId || this.$route.params.packageId; // Lấy packageId từ props hoặc route params
        if (!packageId) {
          console.error("Không tìm thấy ID của gói tiệc để lấy thông tin.");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/package/getPackageById/${packageId}` // Sử dụng packageId
        );
        this.packageData = response.data.data; // Giả sử dữ liệu gói tiệc ở trong response.data.data
        this.selectedDishes = this.packageData.combo || [];
        this.calculatePrice();
      } catch (error) {
        console.error("Lỗi khi lấy thông tin gói tiệc:", error);
      }
    },

    async updatePackage() {
      try {
        const packageId = this.packageId || this.$route.params.packageId; // Lấy packageId từ props hoặc route params
        if (!packageId) {
          this.message = "Không tìm thấy ID của gói tiệc để cập nhật";
          return;
        }
        this.packageData.price = this.calculatedPrice;
        const requestData = {
          ...this.packageData,
          combo: this.selectedDishes.map((dish) => dish._id),
        };
        const response = await axios.put(
          `http://localhost:3000/package/updatePackage/${packageId}`, // Sử dụng packageId
          requestData
        );
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công!",
          text: response.data.message,
          timer: 2000, // Thời gian hiển thị thông báo (2 giây)
          showConfirmButton: false,
        });

        // Chuyển hướng về trang /adminpackage sau 2 giây
        setTimeout(() => {
          this.$router.push("/adminpackage");
        }, 2000);
      } catch (error) {
        this.message = "Có lỗi xảy ra khi cập nhật gói tiệc";
      }
    },

    calculatePrice() {
      const basePrice = 100000 * this.packageData.tables;
      const discount = (basePrice * this.packageData.promotion) / 100;
      this.calculatedPrice = basePrice;
      this.discountedPrice = basePrice - discount;
    },
    async fetchCategoryPackages() {
      try {
        const response = await axios.get(
          "http://localhost:3000/categorypackage/getCategoryPackage"
        );
        this.categoryPackages = response.data.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh mục gói tiệc:", error);
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
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    async uploadImage(event) {
      const file = event.target.files[0]; // Lấy file đã chọn

      if (file) {
        try {
          const formData = new FormData();
          formData.append("image", file); // Tạo form data để gửi file

          const response = await axios.post(
            "http://localhost:3000/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Header cho upload file
              },
            }
          );

          // Gán link ảnh từ phản hồi của API vào packageData.image
          this.packageData.image = response.data.data.url; // Sử dụng link ảnh từ response.data.data.url
        } catch (error) {
          console.error("Lỗi khi tải ảnh lên:", error);
          this.message = "Không thể tải ảnh lên";
        }
      }
    },
  },
  created() {
    this.fetchCategoryPackages();
    this.fetchPackageDetails();
    this.fetchCategories();
  },
};
</script>

<style scoped>
.updatepackagecontainer {
  background-color: #101827;
  padding: 20px;
  color: #f1f5f9;
  width: 100%;
  height: 100%;
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
.header {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: #1e293b;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
h2 {
  color: #f1f5f9;
  text-align: center;
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
