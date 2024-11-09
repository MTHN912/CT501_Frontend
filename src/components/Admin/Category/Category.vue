<template>
  <div class="category-management">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <a href="/admin">Dashboard</a>
      <i class="fas fa-chevron-right"></i>
      <span>Quản Lý Danh Mục</span>
    </div>
    <div class="header">
      <h2 class="title">Quản Lý Danh Mục</h2>
      <div class="header-actions">
        <div class="search-container">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search categories..."
            v-model="searchQuery"
            class="search"
          />
        </div>

        <!-- Nút thêm danh mục thay đổi theo loại tab đang chọn -->
        <button @click="openModal" class="add-button">
          <i class="fas fa-plus"></i>
          Thêm Danh Mục
        </button>
      </div>
    </div>
    <!-- Thay bộ chọn loại danh mục bằng hai tab -->
    <div class="tabs">
      <button
        :class="{ active: selectedTab === 'food' }"
        @click="selectTab('food')"
      >
        Danh mục món ăn
      </button>
      <button
        :class="{ active: selectedTab === 'package' }"
        @click="selectTab('package')"
      >
        Danh mục tiệc
      </button>
    </div>
    <div class="table-container">
      <h3 v-if="selectedTab === 'food'">Danh Mục Món Ăn</h3>
      <h3 v-else>Danh Mục Tiệc</h3>

      <table class="category-table">
        <thead>
          <tr>
            <th>Tên danh mục</th>
            <th>Loại danh mục</th>
            <th class="action-column">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in selectedTab === 'food'
              ? paginatedCategoriesFood
              : paginatedCategoriesPackage"
            :key="category._id"
          >
            <td>{{ category.name }}</td>
            <td>{{ selectedTab === "food" ? "Món ăn" : "Tiệc" }}</td>
            <td class="actions">
              <button
                class="action-btn edit"
                @click="openUpdateModal(category)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="action-btn delete"
                @click="deleteCategory(category._id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Modal cập nhật danh mục (hiện ra khi click vào nút chỉnh sửa) -->
      <div v-if="isUpdateModalOpen" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Cập nhật danh mục</h2>
            <button @click="closeUpdateModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="updateCategory">
            <div class="form-group">
              <label for="update-name">
                Tên danh mục {{ selectedTab === "food" ? "món ăn" : "tiệc" }}:
              </label>
              <input
                v-model="newCategoryName"
                type="text"
                id="update-name"
                placeholder="Nhập tên mới cho danh mục"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-btn">Cập nhật</button>
              <button
                @click="closeUpdateModal"
                type="button"
                class="cancel-btn"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Nút phân trang -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Trước</button>
        <span>
          {{ selectedTab === "food" ? currentPageFood : currentPagePackage }} /
          {{
            selectedTab === "food" ? totalPagesFood : totalPagesPackage
          }}</span
        >
        <button
          @click="nextPage"
          :disabled="
            selectedTab === 'food'
              ? currentPageFood === totalPagesFood
              : currentPagePackage === totalPagesPackage
          "
        >
          Tiếp
        </button>
      </div>
    </div>

    <!-- Modal thêm danh mục -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Thêm danh mục</h2>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form @submit.prevent="submitCategoryByTab">
          <div class="form-group">
            <label for="name"
              >Tên danh mục
              {{ selectedTab === "food" ? "món ăn" : "tiệc" }}:</label
            >
            <input
              v-model="newCategory.name"
              type="text"
              id="name"
              placeholder="Nhập tên danh mục"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">Thêm danh mục</button>
            <button @click="closeModal" type="button" class="cancel-btn">
              Hủy
            </button>
          </div>
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
      categoryPackages: [],
      currentPageFood: 1, // Sử dụng biến này cho phân trang tab món ăn
      currentPagePackage: 1, // Sử dụng biến này cho phân trang tab tiệc
      itemsPerPage: 10,
      isModalOpen: false,
      newCategory: {
        name: "",
        description: "",
      },
      newCategoryPackage: {
        name: "",
        description: "",
      },
      isUpdateModalOpen: false,
      selectedCategory: {},
      selectedCategoryPackage: {},
      selectedTab: "food",
      selectedCategory: { name: "", _id: "" },
      selectedCategoryPackage: { name: "", _id: "" },
      newCategoryName: "",
    };
  },
  computed: {
    categoryName: function () {
      return this.selectedTab === "food"
        ? this.selectedCategory.name
        : this.selectedCategoryPackage.name;
    },
    filteredCategoriesFood() {
      return this.categories.filter(
        (category) =>
          category.name &&
          category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    filteredCategoriesPackage() {
      return this.categoryPackages.filter(
        (category) =>
          category.name &&
          category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedCategoriesFood() {
      const start = (this.currentPageFood - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCategoriesFood.slice(start, end);
    },
    paginatedCategoriesPackage() {
      const start = (this.currentPagePackage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCategoriesPackage.slice(start, end);
    },
    totalPagesFood() {
      return Math.ceil(this.filteredCategoriesFood.length / this.itemsPerPage);
    },
    totalPagesPackage() {
      return Math.ceil(
        this.filteredCategoriesPackage.length / this.itemsPerPage
      );
    },
  },
  methods: {
    submitCategoryByTab() {
      if (this.selectedTab === "food") {
        this.submitCategory();
      } else if (this.selectedTab === "package") {
        this.submitCategoryPackage();
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get(
          "http://localhost:3000/category/getCategory"
        );
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async fetchCategoryPackages() {
      try {
        const response = await axios.get(
          "http://localhost:3000/categorypackage/getCategoryPackage"
        );
        this.categoryPackages = response.data.data;
      } catch (error) {
        console.error("Error fetching category packages:", error);
      }
    },
    selectTab(tab) {
      this.selectedTab = tab;
      if (tab === "food") {
        this.currentPageFood = 1;
        this.fetchCategories();
      } else if (tab === "package") {
        this.currentPagePackage = 1;
        this.fetchCategoryPackages();
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
      this.isModalOpen = true;
      this.resetNewCategory();
      this.newCategory = { name: "", description: "" };
      this.newCategoryPackage = { name: "", description: "" };
    },
    closeModal() {
      this.isModalOpen = false;
    },
    async submitCategory() {
      try {
        const response = await axios.post(
          "http://localhost:3000/category/addCategory",
          this.newCategory // Gửi dữ liệu từ newCategory
        );
        this.categories.push(response.data); // Cập nhật danh sách danh mục món ăn
        this.closeModal(); // Đóng modal

        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Danh mục món ăn đã được thêm thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error adding category:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi thêm danh mục món ăn.",
        });
      } finally {
        this.resetNewCategory(); // Làm mới dữ liệu sau khi thêm
      }
    },

    // Hàm submit cho danh mục tiệc
    async submitCategoryPackage() {
      try {
        const response = await axios.post(
          "http://localhost:3000/categorypackage/addCategoryPackage",
          this.newCategory // Gửi dữ liệu từ newCategory
        );
        this.categoryPackages.push(response.data); // Cập nhật danh sách danh mục tiệc
        this.closeModal(); // Đóng modal

        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Danh mục tiệc đã được thêm thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error adding category package:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi thêm danh mục tiệc.",
        });
      } finally {
        this.resetNewCategory();
        this.fetchCategoryPackages();
      }
    },
    async updateCategory() {
      try {
        if (this.selectedTab === "food") {
          await axios.put(
            `http://localhost:3000/category/updateCategory/${this.selectedCategory._id}`,
            { name: this.newCategoryName }
          );
          this.fetchCategories(); // Cập nhật danh sách món ăn sau khi thêm
        } else if (this.selectedTab === "package") {
          await axios.put(
            `http://localhost:3000/categorypackage/updateCategoryPackage/${this.selectedCategoryPackage._id}`,
            { name: this.newCategoryName }
          );
          this.fetchCategoryPackages(); // Cập nhật danh sách tiệc sau khi thêm
        }

        // Thông báo thành công
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công",
          text: "Danh mục đã được cập nhật!",
          timer: 1500,
          showConfirmButton: false,
        });
        this.closeUpdateModal(); // Đóng modal sau khi hoàn tất
      } catch (error) {
        console.error("Error updating category:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi cập nhật danh mục.",
        });
      }
    },
    resetNewCategory() {
      this.newCategory = { name: "", description: "" };
    },
    openUpdateModal(category) {
      this.isUpdateModalOpen = true;
      if (this.selectedTab === "food") {
        this.selectedCategory = category;
        this.newCategoryName = category.name;
      } else {
        this.selectedCategoryPackage = category;
        this.newCategoryName = category.name;
      }
    },
    closeUpdateModal() {
      this.isUpdateModalOpen = false;
      this.newCategoryName = ""; // Reset giá trị khi đóng modal
    },
    async deleteCategory(categoryId) {
      if (confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
        try {
          if (this.selectedTab === "food") {
            await axios.delete(
              `http://localhost:3000/category/deleteCategory/${categoryId}`
            );
            this.fetchCategories(); // Cập nhật danh sách món ăn sau khi xóa
          } else if (this.selectedTab === "package") {
            await axios.delete(
              `http://localhost:3000/categorypackage/deleteCategoryPackage/${categoryId}`
            );
            this.fetchCategoryPackages(); // Cập nhật danh sách tiệc sau khi xóa
          }

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
      if (this.selectedTab === "food") {
        if (this.currentPageFood < this.totalPagesFood) {
          this.currentPageFood++;
        }
      } else if (this.selectedTab === "package") {
        if (this.currentPagePackage < this.totalPagesPackage) {
          this.currentPagePackage++;
        }
      }
    },
    prevPage() {
      if (this.selectedTab === "food") {
        if (this.currentPageFood > 1) {
          this.currentPageFood--;
        }
      } else if (this.selectedTab === "package") {
        if (this.currentPagePackage > 1) {
          this.currentPagePackage--;
        }
      }
    },
  },
  mounted() {
    this.fetchCategories(); // Tải danh mục món ăn khi khởi động (tab mặc định là "food")
  },
};
</script>

<style scoped>
.category-management {
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
.title {
  color: #f8fafc;
  font-size: 2rem;
  font-weight: 600;
}
h3 {
  color: #f8fafc;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.search {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  font-size: 0.9rem;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  background-color: #1f2937;
  color: #fff;
  width: 300px;
  transition: all 0.3s ease;
}

.search:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-button:hover {
  background-color: #059669;
  transform: translateY(-1px);
}

.table-container {
  background-color: #1f2937;
  border-radius: 0.5rem;
  overflow: hidden;
}

.category-table {
  width: 100%;
  border-collapse: collapse;
}

.category-table th {
  background-color: #374151;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

.sortable {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-icon {
  font-size: 0.8rem;
  color: #9ca3af;
}

.category-table td {
  padding: 1rem;
  border-bottom: 1px solid #374151;
}

.category-table tr:hover {
  background-color: #283548;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.edit {
  background-color: #3b82f6;
  color: white;
}

.action-btn.edit:hover {
  background-color: #2563eb;
}

.action-btn.delete {
  background-color: #ef4444;
  color: white;
}

.action-btn.delete:hover {
  background-color: #dc2626;
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

.page-info {
  font-size: 0.9rem;
  color: #9ca3af;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: #1f2937;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 500px;
  animation: slideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #fff;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #9ca3af;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #374151;
  background-color: #283548;
  color: #fff;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn,
.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.submit-btn {
  background-color: #10b981;
  color: white;
}

.submit-btn:hover {
  background-color: #059669;
}

.cancel-btn {
  background-color: #ef4444;
  color: white;
}

.cancel-btn:hover {
  background-color: #dc2626;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
}

.pagination span {
  margin: 0 10px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  background: #1e293b;
  padding: 15px;
  border-radius: 12px;
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
</style>
