<template>
  <div class="food-management">
    <div class="header">
      <h2>Quản Lý Món Ăn</h2>
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          v-model="searchQuery"
          class="search"
        />
      </div>
      <button @click="openModal" class="add-button">Add Food</button>
    </div>
    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="category in ['Tất cả', ...categories]"
        :key="category._id || 'all'"
        :class="{
          active:
            selectedTab === category.name ||
            (category === 'Tất cả' && selectedTab === ''),
        }"
        @click="selectTab(category)"
      >
        {{ category.name || "Tất cả" }}
      </button>
    </div>
    <!-- Danh sách món ăn -->
    <table class="food-table">
      <thead>
        <tr>
          <th @click="sortBy('name')">Tên món ⬍</th>
          <th @click="sortBy('description')">Mô tả ⬍</th>
          <th @click="sortBy('category')">Danh mục ⬍</th>
          <th @click="sortBy('averageRating')">Đánh Giá ⬍</th>
          <th @click="sortBy('price')">Đơn Giá ⬍</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="paginatedFoods.length === 0">
          <td colspan="6">Không có món nào trong danh mục này</td>
        </tr>
        <tr v-else v-for="food in paginatedFoods" :key="food._id">
          <td>
            <img :src="food.image" alt="Food image" class="food-image" />{{
              food.name
            }}
          </td>
          <td>{{ food.description }}</td>
          <td>{{ food.category }}</td>
          <!-- Hiển thị giá trị đánh giá trung bình -->
          <td>{{ food.averageRating || "Chưa có đánh giá" }}</td>
          <td>${{ food.price }}</td>
          <td>
            <!-- Nút cập nhật -->
            <i @click="openUpdateModal(food)" class="fas fa-edit edit-icon"></i>
            <!-- Nút xóa -->
            <i
              @click="deleteFood(food._id)"
              class="fas fa-trash delete-icon"
            ></i>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Phân trang -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Trước</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Tiếp
      </button>
    </div>

    <!-- Modal thêm món ăn -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h2>Thêm món ăn</h2>
        <form @submit.prevent="submitFood">
          <label for="image">Hình Ảnh:</label>
          <input type="file" id="image" @change="handleFileUpload" />
          <div v-if="selectedImageName" class="image-name">
            <strong>Tên file:</strong> {{ selectedImageName }}
          </div>

          <label for="name">Tên món:</label>
          <input
            v-model="newFood.name"
            type="text"
            id="name"
            placeholder="Tên món ăn"
          />

          <label for="description">Mô tả:</label>
          <input
            v-model="newFood.description"
            type="text"
            id="description"
            placeholder="Mô tả ngắn"
          />

          <label for="detailedDescription">Mô tả chi tiết:</label>
          <textarea
            v-model="newFood.detailedDescription"
            id="detailedDescription"
            placeholder="Mô tả chi tiết"
          ></textarea>

          <label for="category">Danh mục:</label>
          <select
            v-model="newFood.category"
            id="category"
            placeholder="Danh mục"
          >
            <option
              v-for="category in categories"
              :key="category._id"
              :value="category.name"
            >
              {{ category.name }}
            </option>
          </select>

          <label for="price">Đơn giá:</label>
          <input
            v-model="newFood.price"
            type="number"
            id="price"
            placeholder="Đơn giá"
          />

          <button type="submit">Thêm món</button>
          <button @click="closeModal" type="button">Hủy</button>
        </form>
      </div>
    </div>
    <!-- Modal cập nhật món ăn -->
    <div v-if="isUpdateModalOpen" class="modal">
      <div class="modal-content">
        <h2>Cập nhật món ăn</h2>
        <form @submit.prevent="submitUpdateFood">
          <label for="image">Hình Ảnh:</label>
          <input type="file" id="image" @change="handleUpdateFileUpload" />

          <!-- Hiển thị tên file ảnh đã chọn -->
          <div v-if="selectedUpdateImageName" class="image-name">
            <strong>Tên file:</strong> {{ selectedUpdateImageName }}
          </div>

          <label for="name">Tên món:</label>
          <input
            v-model="selectedFood.name"
            type="text"
            id="name"
            placeholder="Tên món ăn"
          />

          <label for="description">Mô tả:</label>
          <input
            v-model="selectedFood.description"
            type="text"
            id="description"
            placeholder="Mô tả ngắn"
          />

          <label for="detailedDescription">Mô tả chi tiết:</label>
          <textarea
            v-model="selectedFood.detailedDescription"
            id="detailedDescription"
            placeholder="Mô tả chi tiết"
          ></textarea>

          <label for="category">Danh mục:</label>
          <select
            v-model="selectedFood.category"
            id="category"
            placeholder="Danh mục"
          >
            <option
              v-for="category in categories"
              :key="category._id"
              :value="category.name"
            >
              {{ category.name }}
            </option>
          </select>

          <label for="price">Đơn giá:</label>
          <input
            v-model="selectedFood.price"
            type="number"
            id="price"
            placeholder="Đơn giá"
          />

          <button type="submit">Cập nhật</button>
          <button @click="closeUpdateModal" type="button">Hủy</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      categories: [],
      searchQuery: "",
      sortField: "",
      sortOrder: 1,
      selectedTab: "",
      foods: [],
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 10, // Số món ăn tối đa trên mỗi trang
      isModalOpen: false, // Biến điều khiển trạng thái mở/đóng modal
      newFood: {
        image: "",
        name: "",
        description: "",
        detailedDescription: "",
        category: "",
        price: 0,
      },
      isUpdateModalOpen: false, // Biến điều khiển modal cập nhật
      selectedFood: {}, // Chứa thông tin món ăn được chọn để cập nhật
      uploadedImageUrl: "",
      selectedImageName: "",
      selectedUpdateImageName: "",
    };
  },
  computed: {
    filteredFoods() {
      let filtered = this.foods.filter((food) =>
        food.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      if (this.sortField) {
        filtered.sort((a, b) => {
          let result = 0;
          if (a[this.sortField] < b[this.sortField]) result = -1;
          if (a[this.sortField] > b[this.sortField]) result = 1;
          return result * this.sortOrder;
        });
      }

      return filtered;
    },
    paginatedFoods() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredFoods.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredFoods.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(
          "http://localhost:3000/category/getCategory"
        );
        this.categories = response.data; // Lưu các danh mục vào biến categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    // Các phương thức khác...
    openModal() {
      this.fetchCategories(); // Lấy danh mục món ăn khi mở modal
      this.isModalOpen = true; // Mở modal thêm món ăn
    },
    openUpdateModal(food) {
      this.fetchCategories(); // Lấy danh mục món ăn khi mở modal cập nhật
      this.selectedFood = { ...food }; // Sao chép dữ liệu món ăn vào selectedFood
      this.isUpdateModalOpen = true; // Mở modal cập nhật
    },

    async handleFileUpload(event) {
      const file = event.target.files[0]; // Nhận file từ input
      if (file) {
        this.selectedImageName = file.name;
        const formData = new FormData();
        formData.append("image", file); // Gửi file đến API

        try {
          const response = await axios.post(
            "http://localhost:3000/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success) {
            this.uploadedImageUrl = response.data.data.url; // Lưu URL ảnh tải lên
            this.newFood.image = this.uploadedImageUrl; // Cập nhật URL vào trường image
          } else {
            console.error("Lỗi upload ảnh:", response.data.message);
          }
        } catch (error) {
          console.error("Lỗi upload ảnh:", error);
        }
      }
    },
    async fetchAverageRating(dishId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/review/getAverageRating/${dishId}`
        );
        return response.data.average; // Trả về giá trị đánh giá trung bình
      } catch (error) {
        console.error("Error fetching average rating:", error);
        return null; // Nếu lỗi, trả về null
      }
    },
    async fetchFoods(category = "") {
      try {
        // Gọi API để lấy danh sách món ăn dựa trên danh mục (nếu có)
        const response = await axios.get("http://localhost:3000/dish/getDish", {
          params: { category },
        });

        // Lấy danh sách món ăn và tính toán điểm đánh giá trung bình cho từng món ăn
        const foodsWithRatings = await Promise.all(
          response.data.map(async (food) => {
            const averageRating = await this.fetchAverageRating(food._id); // Gọi hàm fetchAverageRating với ID của món ăn
            return { ...food, averageRating }; // Thêm thuộc tính averageRating vào object món ăn
          })
        );

        // Cập nhật danh sách món ăn với điểm đánh giá trung bình
        this.foods = foodsWithRatings;
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    },

    sortBy(field) {
      if (this.sortField === field) {
        this.sortOrder *= -1;
      } else {
        this.sortField = field;
        this.sortOrder = 1;
      }
    },
    // openModal() {
    //   this.isModalOpen = true;
    // },
    closeModal() {
      this.isModalOpen = false;
    },
    async submitFood() {
      try {
        // Đảm bảo đã có URL ảnh trước khi gọi API thêm món ăn
        if (!this.newFood.image) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Vui lòng tải lên hình ảnh cho món ăn.",
          });
          return;
        }
        const response = await axios.post(
          "http://localhost:3000/dish/addDish",
          this.newFood
        );
        const averageRating = await this.fetchAverageRating(response.data._id);
        this.foods.push({ ...response.data, averageRating }); // Thêm món ăn mới cùng averageRating

        this.closeModal(); // Đóng modal sau khi thêm thành công

        // Hiển thị thông báo thành công bằng SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Món ăn đã được thêm thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error adding food:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi thêm món ăn.",
        });
      }
    },
    async handleUpdateFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedUpdateImageName = file.name; // Lưu tên file ảnh đã chọn

        const formData = new FormData();
        formData.append("image", file);

        try {
          const response = await axios.post(
            "http://localhost:3000/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success) {
            this.selectedFood.image = response.data.data.url; // Cập nhật URL ảnh vào selectedFood
          } else {
            console.error("Lỗi upload ảnh:", response.data.message);
          }
        } catch (error) {
          console.error("Lỗi upload ảnh:", error);
        }
      }
    },
    // Gửi yêu cầu cập nhật món ăn
    async submitUpdateFood() {
      try {
        await axios.put(
          `http://localhost:3000/dish/updateDish/${this.selectedFood._id}`,
          this.selectedFood
        );
        this.fetchFoods(); // Tải lại danh sách món ăn sau khi cập nhật
        this.closeUpdateModal(); // Đóng modal sau khi cập nhật thành công

        // Hiển thị thông báo thành công
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công",
          text: "Món ăn đã được cập nhật!",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error updating food:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi cập nhật món ăn.",
        });
      }
    },

    // Gửi yêu cầu xóa món ăn
    async deleteFood(foodId) {
      if (confirm("Bạn có chắc chắn muốn xóa món ăn này không?")) {
        try {
          await axios.delete(`http://localhost:3000/dish/deleteDish/${foodId}`);
          this.fetchFoods(); // Tải lại danh sách món ăn sau khi xóa

          // Hiển thị thông báo thành công
          Swal.fire({
            icon: "success",
            title: "Xóa thành công",
            text: "Món ăn đã được xóa!",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting food:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Đã xảy ra lỗi khi xóa món ăn.",
          });
        }
      }
    },
    selectTab(category) {
      this.selectedTab = category.name || ""; // Chọn danh mục hoặc tất cả
      this.currentPage = 1;
      this.fetchFoods(this.selectedTab); // Lấy danh sách món ăn theo danh mục
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // Mở modal cập nhật với thông tin của món ăn được chọn
    // openUpdateModal(food) {
    //   this.selectedFood = { ...food };
    //   this.isUpdateModalOpen = true;
    // },

    // Đóng modal cập nhật
    closeUpdateModal() {
      this.isUpdateModalOpen = false;
    },
  },
  mounted() {
    this.fetchCategories();
    this.fetchFoods();
  },
};
</script>

<style scoped>
.food-management {
  padding: 20px;
  background-color: #101827;
  color: #fff;
  width: 100%;
  height: 870px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  color: white;
}

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search {
  padding: 10px 10px 10px 35px;
  background-color: #1d283c;
  border-radius: 5px;
  border: 1px solid #444;
  width: 200px;
  color: white;
}

.add-button {
  background-color: #0084ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.food-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.food-table th,
.food-table td {
  padding: 10px;
  border-bottom: 1px solid #444;
}

.food-table th {
  cursor: pointer;
}

.food-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #0084ff;
  color: white;
  border: none;
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
}

.pagination span {
  margin: 0 10px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}
.modal-content select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 16px;
  color: #333;
  appearance: none; /* Xóa kiểu mũi tên mặc định trên một số trình duyệt */
  -webkit-appearance: none; /* Đảm bảo xóa trên trình duyệt Webkit */
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23333" d="M2 0L0 2h4z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px top 50%;
  background-size: 12px 12px;
}
.modal-content option {
  padding: 10px;
  color: #333;
  background-color: #fff;
  font-size: 14px;
}
.modal-content select:focus {
  border-color: #0084ff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 132, 255, 0.5);
}
.modal-content h2 {
  margin-bottom: 20px;
}

.modal-content label {
  display: block;
  margin-bottom: 5px;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.modal-content button {
  margin-right: 10px;
  padding: 10px 20px;
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.edit-icon {
  color: #4caf50;
  cursor: pointer;
  margin-right: 10px;
}

.delete-icon {
  color: #f44336;
  cursor: pointer;
}
.image-name {
  font-size: 14px;
  font-weight: bold;
  color: #4a4a4a;
  margin-top: 10px;
  background-color: #f9f9f9;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px;
  background-color: #1d283c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.tabs .active {
  background-color: #0084ff;
}
</style>
