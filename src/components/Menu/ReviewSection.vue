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
          <img :src="review.userId.AVATAR" alt="Avatar" class="avatar" />
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
      </div>
    </div>
    <p v-else>Không có đánh giá nào cho tab này.</p>
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
  background-color: #ff6600;
  color: white;
  cursor: pointer;
}
.review-form button:hover {
  background-color: #e55a00;
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
</style>
