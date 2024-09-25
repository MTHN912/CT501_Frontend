<template>
  <div class="food-management">
    <div class="header">
      <h2>Food Management</h2>
      <input
        type="text"
        placeholder="Search..."
        v-model="searchQuery"
        class="search"
      />
      <button @click="openModal" class="add-button">Add Food</button>
    </div>

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
        <tr v-for="food in paginatedFoods" :key="food._id">
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
          <input
            v-model="newFood.category"
            type="text"
            id="category"
            placeholder="Danh mục món ăn"
          />

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
          <input
            v-model="selectedFood.category"
            type="text"
            id="category"
            placeholder="Danh mục món ăn"
          />

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
      searchQuery: "",
      sortField: "",
      sortOrder: 1,
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
    async fetchFoods() {
      try {
        const response = await axios.get("http://localhost:3000/dish/getDish");
        const foodsWithRatings = await Promise.all(
          response.data.map(async (food) => {
            const averageRating = await this.fetchAverageRating(food._id);
            return { ...food, averageRating }; // Thêm thuộc tính averageRating vào món ăn
          })
        );
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
    openModal() {
      this.isModalOpen = true; // Mở modal
    },
    closeModal() {
      this.isModalOpen = false; // Đóng modal
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
    openUpdateModal(food) {
      this.selectedFood = { ...food }; // Sao chép dữ liệu món ăn vào selectedFood
      this.isUpdateModalOpen = true; // Mở modal cập nhật
    },

    // Đóng modal cập nhật
    closeUpdateModal() {
      this.isUpdateModalOpen = false;
    },
  },
  mounted() {
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

.search {
  padding: 10px;
  background-color: #1d283c;
  border-radius: 5px;
  border: none;
  width: 200px;
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
</style>
