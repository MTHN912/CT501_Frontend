<template>
  <div class="dish-detail-container" v-if="dish">
    <!-- Hình ảnh món ăn lớn bên trái -->
    <div class="image-section">
      <img :src="dish.image" alt="dish image" class="dish-image" />
    </div>

    <!-- Thông tin món ăn bên phải -->
    <div class="info-section">
      <h2 class="dish-name">{{ dish.name }}</h2>
      <div class="location-info">
        <p>{{ dish.description }}</p>
        <p>Danh mục: {{ dish.category }}</p>
        <p>Mô tả: {{ dish.detailedDescription }}</p>
        <p>
          Giá: <strong>{{ dish.price }} VNĐ</strong>
        </p>
      </div>

      <!-- Đánh giá món ăn -->
      <div class="dish-rating">
        <span
          v-for="n in 5"
          :key="n"
          class="star"
          :class="{ filled: n <= dish.rating }"
          >★</span
        >
        <span>({{ dish.reviewsCount || 0 }} đánh giá)</span>
      </div>

      <!-- Nút yêu thích -->
      <button @click="toggleFavorite" class="favorite-button">
        <i :class="dish.favorite ? 'fas fa-heart' : 'far fa-heart'"></i>
        <span>{{ dish.favorite ? "Đã yêu thích" : "Yêu thích" }}</span>
      </button>

      <!-- Nút chọn số lượng món -->
      <div class="quantity-selector">
        <label for="quantity">Số lượng: </label>
        <input
          type="number"
          id="quantity"
          v-model.number="quantity"
          min="1"
          :max="dish.stock || 10"
          step="1"
        />
      </div>

      <!-- Nút chọn món -->
      <button @click="selectDish" class="select-button">Chọn món</button>
    </div>
  </div>
  <div v-else>
    <p>Đang tải thông tin món ăn...</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DishDetail",
  props: ["id"],
  data() {
    return {
      dish: null, // Biến để lưu dữ liệu món ăn
      error: null, // Biến để lưu thông báo lỗi nếu có
      quantity: 1,
    };
  },
  created() {
    this.fetchDishDetails(); // Gọi hàm lấy thông tin món ăn khi component được tạo
  },
  methods: {
    async fetchDishDetails() {
      const dishId = this.$route.params.id;
      try {
        const response = await axios.get(
          `http://localhost:3000/dish/getDishById/${dishId}`
        );
        this.dish = response.data;
      } catch (error) {
        console.error("Lỗi khi tải thông tin món ăn:", error);
      }
    },
    toggleFavorite() {
      this.dish.favorite = !this.dish.favorite;
    },
    selectDish() {
      this.$store
        .dispatch("addToCart", {
          dishId: this.$route.params.id,
          quantity: this.quantity, // Lấy số lượng món từ input
        })
        .then(() => {
          alert(
            `Bạn đã thêm ${this.quantity} món ${this.dish.name} vào giỏ hàng`
          );
        })
        .catch((error) => {
          console.error("Lỗi khi thêm món vào giỏ hàng:", error);
        });
    },
  },
  created() {
    this.fetchDishDetails();
  },
};
</script>

<style scoped>
.dish-detail-container {
  display: flex;
  padding: 25px;
  background-color: #fff;
  max-width: 1300px;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: 500px;
}

.image-section {
  flex: 1;
}

.dish-image {
  width: 100%;
  height: 300px; /* Đặt chiều cao cố định */
  object-fit: cover; /* Giúp hình ảnh giữ tỷ lệ và cắt phần dư */
  border-radius: 10px;
}

.info-section {
  flex: 2;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
}

.dish-name {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.location-info p {
  margin: 5px 0;
  font-size: 1.1rem;
}

.dish-rating {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.star {
  color: #ddd;
  font-size: 1.5rem;
  margin-right: 5px;
}

.star.filled {
  color: gold;
}

.favorite-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #ff6666;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.favorite-button i {
  margin-right: 5px;
}

.select-button {
  background-color: #ff6600;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.select-button:hover {
  background-color: #ff4500;
}
.quantity-selector {
  margin-bottom: 10px;
}

.quantity-selector input {
  width: 60px;
  padding: 5px;
  margin-left: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}
</style>
