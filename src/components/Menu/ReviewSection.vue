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
    <div v-if="filteredReviews.length > 0" class="reviews">
      <div
        v-for="review in filteredReviews"
        :key="review._id"
        class="review-item"
      >
        <div class="review-header">
          <h4>{{ review.userId.USERNAME }}</h4>
          <!-- Hiển thị tên người dùng -->
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
          <!-- Định dạng ngày -->
        </div>
        <p>{{ review.comment }}</p>

        <!-- Hình ảnh review -->
        <div
          v-if="review.images && review.images.length > 0"
          class="review-images"
        >
          <img
            v-for="image in review.images"
            :src="image"
            :alt="'Hình ảnh đánh giá'"
            class="review-image"
          />
        </div>
      </div>
    </div>
    <p v-else>Không có đánh giá nào cho tab này.</p>
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
  },
  methods: {
    // Phương thức lấy điểm đánh giá trung bình và tổng số đánh giá từ API
    async fetchAverageRating(dishId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/review/getAverageRating/${dishId}`
        );
        this.averageRating = response.data.average;
        this.totalReviews = response.data.totalReviews;
      } catch (error) {
        console.error("Lỗi khi lấy điểm đánh giá trung bình:", error);
      }
    },

    // Phương thức lấy danh sách đánh giá từ API, có thể lọc theo số sao
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
  },
  watch: {
    // Theo dõi thay đổi của tab và gọi lại API khi tab thay đổi
    selectedTab() {
      const dishId = this.$route.params.dishId;
      this.fetchReviews(dishId);
    },
  },
  mounted() {
    const dishId = this.$route.params.id;
    // Gọi API để lấy dữ liệu đánh giá khi component được mount
    this.fetchAverageRating(dishId);
    this.fetchReviews(dishId);
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
  background-color: #ff6600;
  color: white;
}
.reviews {
  display: flex;
  flex-direction: column;
}
.review-item {
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
</style>
