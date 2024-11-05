<template>
  <div class="food-management">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span>Dashboard</span>
      <i class="fas fa-chevron-right"></i>
      <span>Quản Lý Món Ăn</span>
    </div>
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
      <!-- Dropdown chọn danh mục -->
      <div class="dropdown">
        <button class="dropbtn">
          {{ selectedTab === "" ? "Tất cả" : selectedTab }}
          <i class="fas fa-chevron-down"></i>
        </button>
        <div class="dropdown-content">
          <a @click="selectTab('')" class="dropdown-item">Tất cả</a>
          <a
            v-for="category in categories"
            :key="category._id"
            @click="selectTab(category)"
            class="dropdown-item"
          >
            {{ category.name }}
          </a>
        </div>
      </div>
      <!-- Tab riêng cho các món bị xóa -->
      <button
        :class="{ active: selectedTab === 'Deleted' }"
        @click="selectTab('Deleted')"
      >
        Món Đã Xóa
      </button>
    </div>

    <!-- Danh sách món ăn -->
    <table class="food-table">
      <thead>
        <tr>
          <th @click="sortBy('name')" class="sortable-header">
            <div class="header-content">
              Tên món <i class="fas fa-sort"></i>
            </div>
          </th>
          <th @click="sortBy('description')" class="sortable-header">
            <div class="header-content">Mô tả <i class="fas fa-sort"></i></div>
          </th>
          <th @click="sortBy('category')" class="sortable-header">
            <div class="header-content">
              Danh mục <i class="fas fa-sort"></i>
            </div>
          </th>
          <th @click="sortBy('averageRating')" class="sortable-header">
            <div class="header-content">
              Đánh Giá <i class="fas fa-sort"></i>
            </div>
          </th>
          <th @click="sortBy('price')" class="sortable-header">
            <div class="header-content">
              Đơn Giá <i class="fas fa-sort"></i>
            </div>
          </th>
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
            <!-- Kiểm tra nếu ở tab "Deleted" thì hiển thị nút "Khôi phục" -->
            <template v-if="selectedTab === 'Deleted'">
              <button @click="restoreFood(food._id)" class="restore-button">
                Khôi phục
              </button>
            </template>
            <!-- Nếu không thì hiển thị nút cập nhật và xóa -->
            <template v-else>
              <i
                @click="openUpdateModal(food)"
                class="fas fa-edit edit-icon"
              ></i>
              <i
                @click="deleteFood(food._id)"
                class="fas fa-trash delete-icon"
              ></i>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Phân trang -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        <i class="fas fa-chevron-left"></i> Trước
      </button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Tiếp <i class="fas fa-chevron-right"></i>
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
        const filteredFoods = response.data.filter((food) => !food.isDeleted);
        // Lấy danh sách món ăn và tính toán điểm đánh giá trung bình cho từng món ăn
        const foodsWithRatings = await Promise.all(
          filteredFoods.map(async (food) => {
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
    async fetchDeletedFoods() {
      this.selectedTab = "Deleted";
      try {
        const response = await axios.get(
          "http://localhost:3000/dish/getDishDelete"
        );
        this.foods = response.data;
        // Gọi đánh giá nếu cần
      } catch (error) {
        console.error("Lỗi khi tải danh sách món ăn bị xóa:", error);
      }
    },
    async restoreFood(foodId) {
      try {
        const response = await fetch(
          `http://localhost:3000/dish/restoreDish/${foodId}`,
          {
            method: "PUT",
          }
        );
        if (response.ok) {
          alert("Món ăn đã được khôi phục thành công.");
          this.fetchDeletedFoods(); // Tải lại danh sách món ăn sau khi khôi phục
        } else {
          alert("Không thể khôi phục món ăn.");
        }
      } catch (error) {
        console.error("Lỗi khôi phục món ăn:", error);
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
          await axios.put(`http://localhost:3000/dish/deleteDish/${foodId}`);
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
      if (category === "Deleted") {
        this.selectedTab = "Deleted";
        this.currentPage = 1;
        this.fetchDeletedFoods(); // Gọi hàm để lấy món bị xóa
      } else {
        this.selectedTab = category.name || ""; // Gán danh mục được chọn hoặc "Tất cả"
        this.currentPage = 1;
        this.fetchFoods(this.selectedTab); // Gọi hàm fetchFoods với danh mục
      }
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

.header h2 {
  color: #f8fafc;
  font-size: 2rem;
  font-weight: 600;
}
.header h1 {
  color: #f8fafc;
  font-size: 2.5rem;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search {
  padding: 12px 12px 12px 40px;
  background-color: #1e293b;
  border-radius: 8px;
  border: 1px solid #334155;
  width: 100%;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.search:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
.add-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #2563eb;
}

.food-table {
  width: 100%;
  background: #1e293b;
  border-radius: 12px;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
}

.food-table th,
.food-table td {
  padding: 25px;
  text-align: left;
}

.food-table th {
  background: #262f3f;
  font-weight: 600;
  color: #94a3b8;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.food-table tr {
  transition: all 0.3s ease;
}

.food-table tr:hover {
  background-color: #334155;
}

.food-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  vertical-align: middle;
  object-fit: cover;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button,
.pagination select {
  margin: 0 5px;
  padding: 8px 12px;
  background-color: #1d283c;
  color: white;
  border: 1px solid #444;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination select {
  appearance: none;
  padding-right: 25px;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23ffffff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 5px;
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
  background-color: #1e293b;
  padding: 30px;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  color: #f8fafc;
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
  font-size: 1.5rem;
}
.modal-content label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #4b5563;
  border-radius: 8px;
  background-color: #374151;
  color: #f8fafc;
  font-size: 1rem;
}
.modal-content input:focus,
.modal-content textarea:focus,
.modal-content select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
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
.modal-content button {
  margin-right: 10px;
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #2563eb;
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
  gap: 15px;
  margin-bottom: 30px;
  background: #1e293b;
  padding: 15px;
  border-radius: 12px;
}
.dropdown {
  position: relative; /* Đặt vị trí cho dropdown */
  margin-right: 1rem; /* Khoảng cách giữa dropdown và nút tab khác */
}

.dropbtn {
  background-color: #4caf50; /* Màu nền của nút dropdown */
  color: white; /* Màu chữ */
  padding: 10px 15px; /* Khoảng cách bên trong nút */
  font-size: 16px; /* Kích thước chữ */
  border: none; /* Không viền */
  cursor: pointer; /* Con trỏ khi di chuột */
  border-radius: 4px; /* Bo tròn góc */
}

.dropbtn:hover {
  background-color: #45a049; /* Màu nền khi hover */
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white; /* Màu nền của dropdown */
  min-width: 160px; /* Độ rộng tối thiểu */
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2); /* Đổ bóng cho dropdown */
  z-index: 1; /* Đưa nội dung lên trên */
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-item {
  color: black; /* Màu chữ của các mục trong dropdown */
  padding: 12px 16px; /* Khoảng cách bên trong mục dropdown */
  text-decoration: none; /* Không gạch chân */
  display: block; /* Hiển thị các mục như block */
}

.dropdown-item:hover {
  background-color: #f1f1f1; /* Màu nền khi hover vào mục dropdown */
}

.tabs button {
  padding: 12px 24px;
  background-color: transparent;
  color: #f8fafc;
  border: 1px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabs button:hover {
  background: #334155;
}

.tabs button.active {
  background: #2563eb;
  border-color: #2563eb;
}
.restore-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sortable-header {
  cursor: pointer;
  transition: color 0.2s;
}

.sortable-header:hover {
  color: #f8fafc;
}
</style>
