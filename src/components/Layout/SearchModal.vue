<template>
  <!-- Modal Search Start -->
  <div
    class="modal fade"
    id="searchModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="searchModal"
  >
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content rounded-0">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Tìm món bạn muốn</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body d-flex flex-column align-items-center">
          <div class="input-group w-75 mx-auto d-flex">
            <input
              type="search"
              class="form-control bg-transparent p-3"
              placeholder="Nhập món bạn cần tìm"
              v-model="searchQuery"
              @input="debouncedSearch"
              aria-describedby="search-icon-1"
            />
            <span id="search-icon-1" class="input-group-text p-3">
              <i class="fa fa-search"></i>
            </span>
          </div>

          <!-- Loading Spinner -->
          <div v-if="isLoading" class="spinner-border mt-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>

          <!-- Danh sách kết quả tìm kiếm -->
          <ul
            v-if="!isLoading && searchResults.length > 0"
            class="search-results mt-3"
          >
            <li
              v-for="dish in searchResults"
              :key="dish._id"
              class="search-item"
              @click="goToDishDetail(dish._id)"
            >
              <img :src="dish.image" alt="dish image" class="dish-image" />
              <div class="dish-details">
                <h5>{{ dish.name }}</h5>
                <p>{{ dish.description }}</p>
                <span>Giá: {{ dish.price }} đ</span>
              </div>
            </li>
          </ul>

          <p v-if="!isLoading && searchResults.length === 0" class="mt-3">
            Chưa có món ăn nào được tìm thấy.
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal Search End -->
</template>

<script>
import axios from "axios";
import debounce from "lodash.debounce";

export default {
  data() {
    return {
      searchQuery: "", // Biến để lưu giá trị từ input
      searchResults: [], // Biến để lưu kết quả tìm kiếm
      isLoading: false, // Biến để hiển thị loading
      detailLoading: false, // Loading khi chuyển sang trang chi tiết món ăn
    };
  },
  methods: {
    // Gọi API khi người dùng nhập từ khóa
    async onSearch() {
      if (this.searchQuery.trim() === "") {
        this.searchResults = [];
        this.isLoading = false;
        return;
      }

      this.isLoading = true; // Bắt đầu loading
      try {
        const response = await axios.get(`http://localhost:3000/dish/getDish`, {
          params: {
            name: this.searchQuery,
            category: this.searchQuery,
          },
        });

        this.searchResults = response.data;
        this.isLoading = false; // Kết thúc loading
      } catch (error) {
        console.error("Lỗi khi tìm kiếm món ăn:", error);
        this.isLoading = false;
      }
    },

    // Tạo hàm debounce cho tìm kiếm
    debouncedSearch: debounce(function () {
      this.onSearch();
    }, 500), // Chờ 500ms sau khi người dùng ngừng nhập

    async goToDishDetail(id) {
      // Bắt đầu hiệu ứng loading
      this.detailLoading = true;

      const modal = new bootstrap.Modal(this.$refs.searchModal);
      modal.hide();

      // Xóa modal-backdrop nếu nó vẫn tồn tại
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());

      // Gỡ bỏ thuộc tính overflow: hidden khỏi body
      document.body.style.overflow = "auto";

      // Simulate a delay for loading effect before navigating to the dish detail
      setTimeout(() => {
        this.$router.push({ name: "DishDetail", params: { id: id } });
        this.detailLoading = false; // Tắt loading khi điều hướng xong
      }, 0); // Giả lập loading với 1 giây
    },
  },
  beforeDestroy() {
    // Hủy bỏ debounce khi component bị phá hủy
    this.debouncedSearch.cancel();
  },
};
</script>
<style scoped>
.search-results {
  list-style: none;
  padding: 0;
  width: 75%;
}

.search-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.dish-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
}

.dish-details {
  display: flex;
  flex-direction: column;
}

/* Loading spinner */
.spinner-border {
  width: 3rem;
  height: 3rem;
  color: #6c757d;
}
</style>
