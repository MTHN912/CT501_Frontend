<template>
  <div class="review-container">
    <!-- Tổng quan đánh giá -->
    <div class="review-summary">
      <h2>Đánh giá sản phẩm</h2>
      <div class="rating-overview">
        <div class="average-rating">
          <h2>{{ averageRating }} trên 5</h2>
          <div class="stars">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= averageRating }"
              >★</span
            >
          </div>
          <p>({{ totalReviews }} đánh giá)</p>
        </div>
      </div>
    </div>

    <!-- Tab chọn số sao -->
    <div class="tabs">
      <button
        :class="{ active: selectedTab === 'all' }"
        @click="
          selectedTab = 'all';
          fetchReviews(dishId);
        "
      >
        Tất cả
      </button>
      <button
        :class="{ active: selectedTab === 5 }"
        @click="
          selectedTab = 5;
          fetchReviews(dishId);
        "
      >
        5 Sao
      </button>
      <button
        :class="{ active: selectedTab === 4 }"
        @click="
          selectedTab = 4;
          fetchReviews(dishId);
        "
      >
        4 Sao
      </button>
      <button
        :class="{ active: selectedTab === 3 }"
        @click="
          selectedTab = 3;
          fetchReviews(dishId);
        "
      >
        3 Sao
      </button>
      <button
        :class="{ active: selectedTab === 2 }"
        @click="
          selectedTab = 2;
          fetchReviews(dishId);
        "
      >
        2 Sao
      </button>
      <button
        :class="{ active: selectedTab === 1 }"
        @click="
          selectedTab = 1;
          fetchReviews(dishId);
        "
      >
        1 Sao
      </button>
    </div>

    <!-- Danh sách đánh giá -->
    <div v-if="paginatedReviews.length > 0" class="reviews">
      <div
        v-for="review in paginatedReviews"
        :key="review._id"
        class="review-item"
      >
        <div class="review-header">
          <img :src="review.userId.AVATAR" alt="Avatar" class="avatar" />
          <h4>{{ review.userId.USERNAME }}</h4>
          <div class="review-rating">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= review.rating }"
              >★</span
            >
          </div>
          <p class="review-date">
            {{ new Date(review.date).toLocaleDateString() }}
          </p>
        </div>
        <p>{{ review.comment }}</p>
      </div>
    </div>
    <div class="pagination-container">
      <ul class="pagination">
        <!-- Nút trang trước -->
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click="changePage(currentPage - 1)">
            «
          </a>
        </li>

        <!-- Trang đầu -->
        <li class="page-item" v-if="currentPage > 3">
          <a class="page-link" href="#" @click="changePage(1)">1</a>
        </li>
        <li class="page-item" v-if="currentPage > 3">
          <span class="page-link">...</span>
        </li>

        <!-- Các trang xung quanh trang hiện tại -->
        <li
          v-for="page in pagesAroundCurrent"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click="changePage(page)">{{ page }}</a>
        </li>

        <!-- Trang cuối -->
        <li v-if="currentPage < totalPages - 2">
          <span class="page-link">...</span>
        </li>
        <li class="page-item" v-if="currentPage < totalPages - 2">
          <a class="page-link" href="#" @click="changePage(totalPages)">
            {{ totalPages }}
          </a>
        </li>

        <!-- Nút trang sau -->
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click="changePage(currentPage + 1)">
            »
          </a>
        </li>
      </ul>
    </div>

    <!-- Phần hiển thị đánh giá của người dùng -->
    <div v-if="hasReviewed" class="user-review">
      <h3>Đánh giá của bạn</h3>
      <div class="review-item">
        <div class="review-header">
          <div class="review-rating">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= userReview.rating }"
              >★</span
            >
          </div>
          <p class="review-date">
            {{ new Date(userReview.date).toLocaleDateString() }}
          </p>
        </div>
        <p>{{ userReview.comment }}</p>
        <!-- Nút xóa đánh giá chỉ hiện nếu người dùng đã đăng nhập -->
        <button
          v-if="isLoggedIn"
          @click="deleteReview(userReview._id)"
          class="delete-button"
        >
          Xóa đánh giá
        </button>
      </div>
    </div>

    <!-- Phần biểu mẫu thêm đánh giá -->
    <div v-if="isLoggedIn && !hasReviewed" class="review-form">
      <h3>Thêm đánh giá của bạn</h3>
      <form @submit.prevent="submitReview(dishId)">
        <div class="rating-input">
          <label for="rating">Số sao:</label>
          <div class="stars2">
            <span
              v-for="n in 5"
              :key="n"
              class="star2"
              :class="{ filled: n <= (hoverRating || newRating) }"
              @click="newRating = n"
              @mouseover="hoverRating = n"
              @mouseleave="hoverRating = 0"
              >★</span
            >
          </div>
        </div>

        <div class="comment-input">
          <label for="comment">Bình luận:</label>
          <textarea
            v-model="newComment"
            placeholder="Nhập bình luận của bạn..."
            required
          ></textarea>
        </div>

        <button type="submit">Gửi đánh giá</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      averageRating: 0,
      totalReviews: 0,
      reviews: [],
      selectedTab: "all", // Mặc định là tab tất cả
      newRating: 0,
      hoverRating: 0,
      newComment: "",
      newImage: null, // Lưu ảnh nếu có
      hasReviewed: false, // Kiểm tra nếu người dùng đã đánh giá
      userReview: null, // Thông tin đánh giá của người dùng nếu có
      successMessage: "",
      currentPage: 1,
      reviewsPerPage: 5,
    };
  },
  computed: {
    // Lọc đánh giá dựa trên tab được chọn
    filteredReviews() {
      if (this.selectedTab === "all") {
        return this.reviews;
      }
      return this.reviews.filter(
        (review) => review.rating === this.selectedTab
      );
    },
    pagesAroundCurrent() {
      let pages = [];
      let start = Math.max(this.currentPage - 2, 1);
      let end = Math.min(this.currentPage + 2, this.totalPages);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
    paginatedReviews() {
      const start = (this.currentPage - 1) * this.reviewsPerPage;
      const end = start + this.reviewsPerPage;
      return this.filteredReviews.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredReviews.length / this.reviewsPerPage);
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn; // Kiểm tra trạng thái đăng nhập
    },
    averageRating() {
      return this.$store.getters.averageRating; // Lấy điểm đánh giá trung bình từ store
    },
    totalReviews() {
      return this.$store.getters.totalReviews; // Lấy tổng số đánh giá từ store
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    // Lấy điểm đánh giá trung bình và tổng số đánh giá từ API
    async fetchAverageRating(dishId) {
      await this.$store.dispatch("fetchAverageRating", dishId); // Dispatch action từ store
    },

    // Lấy danh sách đánh giá từ API, có thể lọc theo số sao
    async fetchReviews(dishId) {
      try {
        const ratingFilter =
          this.selectedTab === "all" ? "" : `?rating=${this.selectedTab}`;
        const response = await axios.get(
          `http://localhost:3000/review/getReviews/${dishId}${ratingFilter}`
        );
        this.reviews = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
      }
    },

    async checkUserReview(dishId) {
      try {
        const userId = this.$store.getters.userInfo; // Lấy _id từ userInfo
        const response = await axios.get(
          `http://localhost:3000/review/checkUserReview/${dishId}`,
          {
            params: { userId }, // Truyền userId qua request
          }
        );
        if (response.data.review) {
          this.hasReviewed = true;
          this.userReview = response.data.review; // Lưu đánh giá của người dùng
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra đánh giá của người dùng:", error);
      }
    },
    async deleteReview(reviewId) {
      const dishId = this.$route.params.id;
      try {
        // Gửi yêu cầu xóa đánh giá
        await axios.delete(
          `http://localhost:3000/review/deleteReview/${reviewId}`
        );

        // Cập nhật lại trạng thái hasReviewed thành false và xóa userReview
        this.hasReviewed = false;
        this.userReview = null;

        // Cập nhật lại danh sách đánh giá và đánh giá trung bình
        this.fetchReviews(dishId);
        this.fetchAverageRating(dishId);
      } catch (error) {
        console.error("Lỗi khi xóa đánh giá:", error);
        alert("Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.");
      }
    },
    // Xử lý upload ảnh
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.newImage = file; // Lưu ảnh để gửi lên server
    },

    // Phương thức gửi đánh giá
    async submitReview() {
      const dishId = this.$route.params.id;

      // Kiểm tra trạng thái đăng nhập
      if (!this.isLoggedIn) {
        alert("Bạn cần đăng nhập để đánh giá.");
        return;
      }

      // Kiểm tra nếu thiếu bất kỳ trường bắt buộc nào
      if (!dishId || !this.newRating || !this.newComment) {
        alert("Vui lòng điền đầy đủ thông tin (số sao và bình luận).");
        return;
      }

      try {
        // Gửi request trực tiếp với rating và comment mà không qua reviewData
        const response = await axios.post(
          `http://localhost:3000/review/createReview/${dishId}`,
          {
            rating: this.newRating,
            comment: this.newComment,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Thông báo thành công
        this.successMessage = "Đánh giá của bạn đã được gửi thành công.";
        setTimeout(() => {
          this.successMessage = "";
        }, 3000);

        // Reset các trường sau khi gửi thành công
        this.newRating = null;
        this.newComment = "";
        this.newImage = null;

        // Cập nhật danh sách đánh giá
        this.fetchReviews(dishId);
        this.fetchAverageRating(dishId);
        this.checkUserReview(dishId);
      } catch (error) {
        console.error("Lỗi khi gửi đánh giá:", error);
        alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
      }
    },
  },
  watch: {
    // Theo dõi thay đổi của tab và gọi lại API khi tab thay đổi
    selectedTab() {
      const dishId = this.$route.params.id;
      this.fetchReviews(dishId);
      this.fetchAverageRating(dishId);
    },
  },
  mounted() {
    const dishId = this.$route.params.id;
    // Gọi API để lấy dữ liệu đánh giá khi component được mount
    this.fetchAverageRating(dishId);
    this.fetchReviews(dishId);
    this.checkUserReview(dishId);
  },
};
</script>

<style scoped>
.review-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.review-summary {
  text-align: center;
  margin-bottom: 20px;
}
.average-rating h2 {
  font-size: 2rem;
  font-weight: bold;
}
.stars {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.star {
  font-size: 1.5rem;
  color: #ddd;
  margin-right: 5px;
}
.star.filled {
  color: gold;
}
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.tabs button {
  padding: 10px 20px;
  border: none;
  background-color: #f1f1f1;
  cursor: pointer;
  margin-right: 5px;
  transition: background-color 0.3s;
}
.tabs button.active,
.tabs button:hover {
  background-color: #d4a762;
  color: white;
}
.reviews {
  display: flex;
  flex-direction: column;
}
.review-item {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  gap: 10px;
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.review-header h4 {
  font-size: 1.2rem;
  margin: 0;
  flex: 1;
}
.review-rating {
  display: flex;
  justify-content: flex-start;
  flex: 1;
  gap: 3px;
}
.review-date {
  color: #aaa;
  font-size: 0.9rem;
  text-align: right;
  flex: 1;
}
.review-images {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.review-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  flex-shrink: 0;
}

.review-form {
  margin-top: 30px;
}
.review-form h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}
.review-form form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.review-form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}
.review-form select,
.review-form input[type="file"],
.review-form button {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.review-form button {
  background-color: #d4a762;
  color: white;
  cursor: pointer;
}
.review-form button:hover {
  background-color: #c09759;
}
.stars2 {
  display: flex;
  gap: 5px;
  cursor: pointer;
}
.star2 {
  font-size: 2rem;
  color: #ddd; /* Màu xám cho sao chưa chọn */
  transition: color 0.3s;
}
.star2.filled {
  color: gold; /* Màu vàng cho sao đã chọn hoặc hover */
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.success-message {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  text-align: center;
  transition: opacity 0.3s ease;
}
.delete-button {
  background-color: #ff4d4f; /* Màu đỏ nổi bật */
  color: white; /* Màu chữ trắng */
  border: none; /* Không có viền */
  border-radius: 5px; /* Bo góc */
  padding: 10px 20px; /* Khoảng cách trong */
  font-size: 16px; /* Kích thước chữ */
  cursor: pointer; /* Hiển thị biểu tượng tay khi hover */
  transition: background-color 0.3s ease; /* Hiệu ứng chuyển màu */
  margin-top: 10px; /* Khoảng cách phía trên nút */
}

.delete-button:hover {
  background-color: #d43f40; /* Màu đỏ đậm hơn khi hover */
}

.delete-button:active {
  background-color: #b33636; /* Màu khi click */
  transform: scale(0.98); /* Hiệu ứng thu nhỏ nhẹ khi click */
}

.delete-button:focus {
  outline: none; /* Bỏ viền khi nút được focus */
  box-shadow: 0 0 5px rgba(255, 77, 79, 0.5); /* Hiệu ứng đổ bóng nhẹ khi focus */
}
h3 {
  margin-top: 15px;
}
.user-review {
  position: sticky;
  top: 0;
  background-color: white;
  padding: 15px;
  border: 1px solid #eee;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.page-item .page-link {
  color: #007bff;
  border: 1px solid #dee2e6;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
}

.page-item .page-link:hover {
  background-color: #007bff;
  color: white;
}

.page-item.active .page-link {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  cursor: not-allowed;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination .page-item .page-link {
  color: #d19b57; /* Màu chữ */
  background-color: white;
  border: 1px solid #dee2e6;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
  border-radius: 0;
}

.pagination .page-item .page-link:hover {
  background-color: #f0f0f0;
}

.pagination .page-item.active .page-link {
  background-color: #d19b57; /* Màu nền khi active */
  color: white;
  border-color: #d19b57;
}

.pagination .page-item.disabled .page-link {
  color: #ccc;
  pointer-events: none;
  background-color: white;
}

.pagination .page-item .page-link:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.pagination .page-item .page-link:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
