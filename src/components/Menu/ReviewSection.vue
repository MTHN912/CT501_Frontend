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
        @click="selectedTab = 'all'"
      >
        Tất cả
      </button>
      <button :class="{ active: selectedTab === 5 }" @click="selectedTab = 5">
        5 Sao
      </button>
      <button :class="{ active: selectedTab === 4 }" @click="selectedTab = 4">
        4 Sao
      </button>
      <button :class="{ active: selectedTab === 3 }" @click="selectedTab = 3">
        3 Sao
      </button>
      <button :class="{ active: selectedTab === 2 }" @click="selectedTab = 2">
        2 Sao
      </button>
      <button :class="{ active: selectedTab === 1 }" @click="selectedTab = 1">
        1 Sao
      </button>
    </div>

    <!-- Danh sách đánh giá -->
    <div v-if="filteredReviews.length > 0" class="reviews">
      <div
        v-for="review in filteredReviews"
        :key="review.id"
        class="review-item"
      >
        <div class="review-header">
          <h4>{{ review.username }}</h4>
          <div class="review-rating">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= review.rating }"
              >★</span
            >
          </div>
          <p class="review-date">{{ review.date }}</p>
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
            :alt="'Review image'"
            class="review-image"
          />
        </div>
      </div>
    </div>
    <p v-else>Không có đánh giá nào cho tab này.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedTab: "all",
      reviews: [
        // Dữ liệu đánh giá mẫu
        {
          id: 1,
          username: "NguyenThuyAnhDuongCute",
          rating: 5,
          date: "2023-11-08",
          comment: "Hàng OK giao rất nhanh...",
          images: ["/images/review1.png", "/images/review2.png"],
        },
        {
          id: 2,
          username: "TranVanA",
          rating: 4,
          date: "2023-09-15",
          comment: "Sản phẩm đúng như mô tả...",
          images: [],
        },
        {
          id: 3,
          username: "LeThiB",
          rating: 3,
          date: "2023-08-10",
          comment: "Chất lượng ổn, giá hợp lý...",
          images: [],
        },
      ],
    };
  },
  computed: {
    averageRating() {
      const totalStars = this.reviews.reduce(
        (total, review) => total + review.rating,
        0
      );
      return (totalStars / this.reviews.length).toFixed(1);
    },
    totalReviews() {
      return this.reviews.length;
    },
    filteredReviews() {
      if (this.selectedTab === "all") {
        return this.reviews;
      }
      return this.reviews.filter(
        (review) => review.rating === this.selectedTab
      );
    },
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
