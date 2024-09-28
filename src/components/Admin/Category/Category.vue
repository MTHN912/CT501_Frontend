<template>
  <div class="category-management">
    <div class="header">
      <h2>Category Management</h2>
      <input
        type="text"
        placeholder="Search..."
        v-model="searchQuery"
        class="search"
      />
      <button @click="openModal" class="add-button">Add Category</button>
    </div>

    <table class="category-table">
      <thead>
        <tr>
          <th @click="sortBy('name')">Tên danh mục ⬍</th>
          <th @click="sortBy('description')">Mô tả ⬍</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in paginatedCategories" :key="category._id">
          <td>{{ category.name }}</td>
          <td>{{ category.description }}</td>
          <td>
            <!-- Nút cập nhật -->
            <i
              @click="openUpdateModal(category)"
              class="fas fa-edit edit-icon"
            ></i>
            <!-- Nút xóa -->
            <i
              @click="deleteCategory(category._id)"
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

    <!-- Modal thêm danh mục -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h2>Thêm danh mục</h2>
        <form @submit.prevent="submitCategory">
          <label for="name">Tên danh mục:</label>
          <input
            v-model="newCategory.name"
            type="text"
            id="name"
            placeholder="Tên danh mục"
          />

          <label for="description">Mô tả:</label>
          <input
            v-model="newCategory.description"
            type="text"
            id="description"
            placeholder="Mô tả ngắn"
          />

          <button type="submit">Thêm danh mục</button>
          <button @click="closeModal" type="button">Hủy</button>
        </form>
      </div>
    </div>

    <!-- Modal cập nhật danh mục -->
    <div v-if="isUpdateModalOpen" class="modal">
      <div class="modal-content">
        <h2>Cập nhật danh mục</h2>
        <form @submit.prevent="submitUpdateCategory">
          <label for="name">Tên danh mục:</label>
          <input
            v-model="selectedCategory.name"
            type="text"
            id="name"
            placeholder="Tên danh mục"
          />

          <label for="description">Mô tả:</label>
          <input
            v-model="selectedCategory.description"
            type="text"
            id="description"
            placeholder="Mô tả ngắn"
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
      categories: [],
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 10, // Số danh mục tối đa trên mỗi trang
      isModalOpen: false, // Biến điều khiển trạng thái mở/đóng modal
      newCategory: {
        name: "",
        description: "",
      },
      isUpdateModalOpen: false, // Biến điều khiển modal cập nhật
      selectedCategory: {}, // Chứa thông tin danh mục được chọn để cập nhật
    };
  },
  computed: {
    filteredCategories() {
      let filtered = this.categories.filter((category) =>
        category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
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
    paginatedCategories() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCategories.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
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
    sortBy(field) {
      if (this.sortField === field) {
        this.sortOrder *= -1;
      } else {
        this.sortField = field;
        this.sortOrder = 1;
      }
    },
    openModal() {
      this.isModalOpen = true; // Mở modal thêm danh mục
    },
    closeModal() {
      this.isModalOpen = false;
    },
    async submitCategory() {
      try {
        const response = await axios.post(
          "http://localhost:3000/category/addCategory",
          this.newCategory
        );
        this.categories.push(response.data); // Thêm danh mục mới vào danh sách

        this.closeModal(); // Đóng modal sau khi thêm thành công

        // Hiển thị thông báo thành công bằng SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Danh mục đã được thêm thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error adding category:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi thêm danh mục.",
        });
      }
    },
    openUpdateModal(category) {
      this.selectedCategory = { ...category }; // Sao chép dữ liệu danh mục vào selectedCategory
      this.isUpdateModalOpen = true; // Mở modal cập nhật danh mục
    },
    closeUpdateModal() {
      this.isUpdateModalOpen = false;
    },
    async submitUpdateCategory() {
      try {
        await axios.put(
          `http://localhost:3000/category/updateCategory/${this.selectedCategory._id}`,
          this.selectedCategory
        );
        this.fetchCategories(); // Tải lại danh sách danh mục sau khi cập nhật
        this.closeUpdateModal(); // Đóng modal sau khi cập nhật thành công

        // Hiển thị thông báo thành công
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công",
          text: "Danh mục đã được cập nhật!",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error updating category:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi cập nhật danh mục.",
        });
      }
    },
    async deleteCategory(categoryId) {
      if (confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
        try {
          await axios.delete(
            `http://localhost:3000/category/deleteCategory/${categoryId}`
          );
          this.fetchCategories(); // Tải lại danh sách danh mục sau khi xóa

          // Hiển thị thông báo thành công
          Swal.fire({
            icon: "success",
            title: "Xóa thành công",
            text: "Danh mục đã được xóa!",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting category:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Đã xảy ra lỗi khi xóa danh mục.",
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
  },
  mounted() {
    this.fetchCategories();
  },
};
</script>

<style scoped>
.category-management {
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

.search {
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
}

.add-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
}

.category-table {
  width: 100%;
  border-collapse: collapse;
}

.category-table th,
.category-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.edit-icon,
.delete-icon {
  cursor: pointer;
  padding: 5px;
  color: #2196f3;
}

.delete-icon {
  color: red;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

.modal-content form label {
  display: block;
  margin-bottom: 5px;
}

.modal-content form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
}

.modal-content form button {
  margin-right: 10px;
  padding: 8px 15px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
}

.modal-content form button[type="button"] {
  background-color: #f44336;
}
</style>
