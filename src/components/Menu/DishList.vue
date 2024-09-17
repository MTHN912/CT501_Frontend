<template>
  <div class="menu-container">
    <!-- Danh mục món ăn -->
    <aside class="category-list">
      <h3 @click="toggleCategory">
        Danh mục<span v-if="!showCategories">▼</span><span v-else>▲</span>
      </h3>
      <ul v-show="showCategories">
        <li
          @click="filterByCategory('Tất cả')"
          :class="{ active: selectedCategory === 'Tất cả' }"
        >
          Tất cả
        </li>
        <li
          v-for="category in categories"
          :key="category"
          @click="filterByCategory(category)"
          :class="{ active: selectedCategory === category }"
        >
          {{ category }}
        </li>
      </ul>
    </aside>

    <!-- Danh sách món ăn -->
    <div class="dish-list">
      <h2 class="title">Danh sách món ăn</h2>
      <ul class="dish-grid">
        <li v-for="dish in filteredDishes" :key="dish.id" class="dish-item">
          <div class="dish-info">
            <img
              :src="dish.image"
              alt="dish image"
              class="dish-image"
              @click="goToDetail(dish.id)"
            />
            <div class="dish-details">
              <h3 @click="goToDetail(dish.id)">{{ dish.name }}</h3>
              <p>{{ dish.description }}</p>
              <p>{{ dish.detailedDescription }}</p>
              <span>Giá: {{ dish.price }} đ</span>

              <!-- Nút yêu thích và đánh giá -->
              <div class="dish-controls">
                <div class="dish-rating">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="star"
                    :class="{ filled: n <= dish.rating }"
                    >★</span
                  >
                  <span>({{ dish.rating }})</span>
                </div>
                <button @click="toggleFavorite(dish)" class="favorite-button">
                  <i
                    :class="dish.favorite ? 'fas fa-heart' : 'far fa-heart'"
                    aria-hidden="true"
                  ></i>
                </button>
              </div>

              <!-- Số lượng và nút chọn món -->
              <div class="quantity-input">
                <label for="quantity">Số lượng:</label>
                <input
                  type="number"
                  id="quantity"
                  v-model="dish.quantity"
                  min="1"
                  class="quantity-field"
                />
              </div>
              <button @click="selectDish(dish)" class="select-button">
                Chọn món
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Thông tin giỏ hàng tóm tắt -->
    <div class="cart-summary" v-if="cart.items.length > 0">
      <p>Bạn đã chọn {{ cartTotalQuantity }} món</p>
      <button @click="goToCart">Xem Thực Đơn</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DishList",
  data() {
    return {
      selectedCategory: "Tất cả",
      showCategories: true,
      categories: [], // Lấy từ API
      dishes: [], // Lấy từ API
      cart: { items: [] }, // Lưu giỏ hàng
    };
  },
  computed: {
    filteredDishes() {
      if (this.selectedCategory === "Tất cả") {
        return this.dishes;
      }
      return this.dishes.filter(
        (dish) => dish.category === this.selectedCategory
      );
    },
    cartTotalQuantity() {
      return this.cart.items.reduce((total, item) => total + item.quantity, 0);
    },
  },
  methods: {
    filterByCategory(category) {
      this.selectedCategory = category;
    },
    goToDetail(id) {
      this.$router.push({ name: "DishDetail", params: { id: id } });
    },
    toggleCategory() {
      this.showCategories = !this.showCategories;
    },

    // Chọn món và thêm vào giỏ hàng
    async selectDish(dish) {
      try {
        const response = await axios.post(
          "http://localhost:3000/cart/addCart",
          {
            dishId: dish._id,
            quantity: dish.quantity,
          }
        );
        this.cart = response.data.cart;
        alert(`Đã thêm ${dish.quantity} món ${dish.name} vào giỏ hàng`);
      } catch (error) {
        console.error("Lỗi khi thêm món vào giỏ hàng:", error);
      }
    },

    // Lấy giỏ hàng từ server
    async fetchCart() {
      try {
        const response = await axios.get("http://localhost:3000/cart/getCart");
        this.cart = response.data.cart;
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
      }
    },

    // Điều hướng đến trang xem giỏ hàng
    goToCart() {
      this.$router.push({ name: "Cart" });
    },

    // Yêu thích món ăn
    toggleFavorite(dish) {
      dish.favorite = !dish.favorite;
    },

    // Phương thức gọi API lấy danh mục
    async fetchCategories() {
      try {
        const response = await axios.get(
          "http://localhost:3000/category/getCategory"
        );
        this.categories = response.data.map((category) => category.name);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    },

    // Phương thức gọi API lấy danh sách món ăn
    async fetchDishes() {
      try {
        const response = await axios.get("http://localhost:3000/dish/getDish");
        this.dishes = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách món ăn:", error);
      }
    },
  },
  mounted() {
    // Gọi API khi component được mount
    this.fetchCategories();
    this.fetchDishes();
    this.fetchCart();
  },
};
</script>

<style scoped>
.menu-container {
  display: flex;
  padding: 20px;
  background-color: #f5f5f5;
}

.category-list {
  width: 220px;
  margin-right: 25px;
}

.category-list h3 {
  cursor: pointer;
  background-color: #f8f8f8;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.category-list h3:hover {
  background-color: #e0e0e0;
}

.category-list ul {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.category-list li {
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  text-align: center;
  transition: background-color 0.3s;
}

.category-list li.active {
  background-color: #f5f5f5;
  font-weight: bold;
}

.category-list li:hover {
  background-color: #e0e0e0;
}

.dish-list {
  flex: 1;
}

.title {
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
}

.dish-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 35px;
}

.dish-item {
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: #fff; /* Nền màu trắng cho từng món */
}

.dish-item:hover {
  transform: scale(1.05); /* Hiệu ứng phóng to khi hover */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Thêm hiệu ứng bóng đổ khi hover */
}

.dish-info {
  text-align: center;
}

.dish-image {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.dish-details p {
  margin: 5px 0;
  color: #666;
}

.dish-details h3 {
  font-size: 1.6rem;
  color: #333;
  font-weight: bold; /* Đậm hơn */
}

.dish-details span {
  font-weight: bold;
  color: #000;
  margin-top: 10px;
  display: block;
}

.dish-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.dish-rating {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.star {
  color: #ddd;
  font-size: 1.2rem;
  margin-right: 5px;
}

.star.filled {
  color: gold;
}

.favorite-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: red;
  margin-left: 5px;
  transition: color 0.3s, transform 0.3s;
}

.favorite-button.active i {
  color: red; /* Màu khi đã được yêu thích */
}

.favorite-button:hover i {
  color: #ff6666; /* Màu khi hover */
  transform: scale(1.1); /* Hiệu ứng phóng to vừa phải khi hover */
}

.quantity-input {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quantity-field {
  width: 60px;
  padding: 5px;
  margin-left: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.select-button {
  background-color: #ff6600;
  color: white;
  padding: 10px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s, transform 0.2s;
  font-size: 1rem;
}

.select-button:hover {
  background-color: #ff4500;
  transform: scale(1.1); /* Phóng to hơn khi hover */
}
</style>
