<template>
  <div class="dish-detail-container" v-if="dish">
    <!-- Thông báo thành công -->
    <div v-if="showMessage" class="success-message">
      {{ successMessage }}
    </div>

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
          :class="{ filled: n <= averageRating }"
          >★</span
        >
        <span>({{ totalReviews || 0 }} đánh giá)</span>
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
      dish: null,
      error: null,
      quantity: 1,
      averageRating: 0,
      totalReviews: 0,
      successMessage: "",
      showMessage: false,
    };
  },
  created() {
    this.fetchDishDetails();
    this.fetchAverageRating();
  },
  computed: {
    averageRating() {
      return this.$store.getters.averageRating; // Lấy điểm đánh giá trung bình từ store
    },
    totalReviews() {
      return this.$store.getters.totalReviews; // Lấy tổng số đánh giá từ store
    },
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
    async fetchAverageRating(dishId) {
      await this.$store.dispatch("fetchAverageRating", dishId); // Dispatch action từ store
    },
    toggleFavorite() {
      this.dish.favorite = !this.dish.favorite;
    },
    selectDish() {
      const cartItem = this.$store.state.cart.items.find(
        (item) => item.dishId === this.dish._id
      );

      if (cartItem) {
        // Nếu món đã có trong giỏ hàng
        const confirmMessage = `Món ${this.dish.name} đã có trong giỏ hàng với số lượng ${cartItem.quantity}. Bạn có muốn thêm ${this.quantity} món này nữa không?`;

        if (confirm(confirmMessage)) {
          this.addToCart(this.quantity, true); // Truyền thêm cờ để biết đây là thêm số lượng
        } else {
          return;
        }
      } else if (this.quantity >= 2) {
        // Nếu số lượng lớn hơn hoặc bằng 2 và món chưa có trong giỏ hàng
        const confirmMessage = `Đây là chọn món cho một bàn tiệc, bạn có chắc muốn chọn ${this.quantity} món này?`;

        if (confirm(confirmMessage)) {
          this.addToCart(this.quantity);
        } else {
          return;
        }
      } else {
        // Số lượng nhỏ hơn 2 và món chưa có trong giỏ hàng
        this.addToCart(this.quantity);
      }
    },

    addToCart(quantity, isAddingExtra = false) {
      let newQuantity = quantity || 1;

      if (isAddingExtra) {
        const cartItem = this.$store.state.cart.items.find(
          (item) => item.dishId === this.dish._id
        );
        if (cartItem) {
          newQuantity += cartItem.quantity;
        }
      }

      this.$store
        .dispatch("addToCart", {
          dishId: this.$route.params.id,
          quantity: newQuantity,
        })
        .then(() => {
          // Hiển thị thông báo thành công
          this.successMessage = `Bạn đã thêm ${newQuantity} món ${this.dish.name} vào giỏ hàng thành công!`;
          this.showMessage = true;

          // Ẩn thông báo sau 3 giây
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
        })
        .catch((error) => {
          console.error("Lỗi khi thêm món vào giỏ hàng:", error);
        });
    },
  },
  created() {
    this.fetchDishDetails();
    this.fetchAverageRating();
  },
};
</script>

<style scoped>
.success-message {
  background-color: #c09759;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

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
  background-color: #d4a762;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.select-button:hover {
  background-color: #c09759;
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
