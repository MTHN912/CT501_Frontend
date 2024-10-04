<template>
  <!-- <h3 @click="toggleCategory">
    Danh mục<span v-if="!showCategories">▼</span><span v-else>▲</span>
  </h3> -->
  <aside class="category-list">
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
  <div class="menu-container">
    <!-- Danh mục món ăn -->

    <!-- Danh sách món ăn -->
    <div class="dish-list" ref="dishList">
      <ul class="dish-grid">
        <li v-for="dish in filteredDishes" :key="dish.id" class="dish-item">
          <div class="dish-info">
            <img
              :src="dish.image"
              alt="dish image"
              class="dish-image"
              @click="goToDetail(dish._id)"
            />
            <div class="dish-details">
              <h3 @click="goToDetail(dish._id)">{{ dish.name }}</h3>
              <p class="front1">{{ dish.description }}</p>
              <p class="front2">{{ dish.detailedDescription }}</p>
              <span>Giá: {{ dish.price }} đ</span>

              <!-- Nút yêu thích và đánh giá -->
              <div class="dish-controls">
                <div class="dish-rating">
                  <!-- Kiểm tra nếu có dữ liệu đánh giá cho món ăn -->
                  <span
                    v-if="
                      ratings[dish._id] && ratings[dish._id].reviewCount > 0
                    "
                  >
                    <!-- Hiển thị điểm đánh giá trung bình -->
                    <span class="average-rating">{{
                      ratings[dish._id].averageRating.toFixed(1)
                    }}</span>

                    <!-- Hiển thị số sao dựa trên đánh giá trung bình -->
                    <span class="stars">
                      <span
                        v-for="n in 5"
                        :key="n"
                        class="star"
                        :class="{
                          filled:
                            n <= Math.round(ratings[dish._id].averageRating),
                        }"
                        >★</span
                      >
                    </span>

                    <!-- Hiển thị số lượt đánh giá -->
                    <span class="review-count"
                      >| {{ ratings[dish._id].reviewCount }} đánh giá</span
                    >
                  </span>
                  <span v-else>Chưa có đánh giá</span>
                </div>

                <!-- Nút yêu thích -->
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
  </div>
</template>

<script>
import axios from "axios"; // Import axios

export default {
  name: "DishList",
  data() {
    return {
      selectedCategory: "Tất cả",
      showCategories: true,
      categories: [], // Danh mục lấy từ API
      dishes: [], // Danh sách món ăn lấy từ API
      ratings: {},
    };
  },
  computed: {
    // Lọc món ăn dựa trên danh mục được chọn
    filteredDishes() {
      if (this.selectedCategory === "Tất cả") {
        return this.dishes;
      }
      return this.dishes.filter(
        (dish) => dish.category === this.selectedCategory
      );
    },
    // Tổng số lượng món trong giỏ hàng
    cartTotalQuantity() {
      return this.$store.state.cart.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
    // Truy cập giỏ hàng từ store
    cart() {
      return this.$store.state.cart;
    },
  },
  methods: {
    // Lọc món ăn theo danh mục
    filterByCategory(category) {
      this.selectedCategory = category;

      this.$nextTick(() => {
        const dishList = this.$refs.dishList;
        if (dishList) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    },
    // Điều hướng đến trang chi tiết món ăn
    goToDetail(id) {
      this.$router.push({ name: "DishDetail", params: { id: id } });
    },
    // Hiện/Ẩn danh sách danh mục
    toggleCategory() {
      this.showCategories = !this.showCategories;
    },
    // Thêm món vào giỏ hàng thông qua store
    selectDish(dish) {
      this.$store
        .dispatch("addToCart", {
          dishId: dish._id,
          quantity: dish.quantity || 1, // Số lượng mặc định là 1 nếu không có
        })
        .then(() => {
          alert(
            `Bạn muốn thêm ${dish.quantity || 1} món ${dish.name} vào giỏ hàng`
          );
        })
        .catch((error) => {
          console.error("Lỗi khi thêm món vào giỏ hàng:", error);
        });
    },
    // Lấy giỏ hàng từ store
    fetchCart() {
      this.$store
        .dispatch("fetchCart")
        .then(() => {
          console.log("Giỏ hàng đã được tải thành công");
        })
        .catch((error) => {
          console.error("Lỗi khi tải giỏ hàng:", error);
        });
    },
    // Điều hướng đến trang giỏ hàng
    goToCart() {
      this.$router.push({ name: "Cart" });
    },
    // Yêu thích món ăn
    toggleFavorite(dish) {
      dish.favorite = !dish.favorite;
    },
    // Gọi API để lấy danh mục món ăn
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
    // Gọi API để lấy danh sách món ăn
    async fetchDishes() {
      try {
        const response = await axios.get("http://localhost:3000/dish/getDish");
        this.dishes = response.data;

        // Gọi API để lấy đánh giá trung bình cho từng món ăn
        for (const dish of this.dishes) {
          const ratingResponse = await axios.get(
            `http://localhost:3000/review/getAverageRating/${dish._id}`
          );

          // Lưu trữ kết quả vào ratings, đồng thời đổi tên thuộc tính cho phù hợp với template
          this.ratings[dish._id] = {
            averageRating: parseFloat(ratingResponse.data.average), // Đổi thành số thực
            reviewCount: ratingResponse.data.totalReviews,
          };
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách món ăn:", error);
      }
    },
  },
  mounted() {
    // Gọi API khi component được mount
    this.fetchCategories();
    this.fetchDishes();
    this.fetchCart(); // Lấy giỏ hàng từ store khi component mount
  },
};
</script>

<style scoped>
.menu-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
}

.category-list {
  display: flex;
  justify-content: center; /* Căn giữa các mục danh mục */
  margin-bottom: 20px; /* Tạo khoảng cách giữa danh mục và phần còn lại của nội dung */
  width: 100%; /* Đảm bảo danh mục chiếm toàn bộ chiều ngang */
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
  display: flex;
  gap: 15px; /* Khoảng cách giữa các tab */
  list-style: none;
  padding: 0;
  margin-top: 10px;
  justify-content: center;
}

.category-list li {
  cursor: pointer;
  padding: 10px 20px; /* Điều chỉnh kích thước tab */
  border: 1px solid #d4a762; /* Đường viền rõ ràng hơn */
  border-radius: 25px; /* Tạo hình dạng bo tròn */
  margin-bottom: 0; /* Loại bỏ khoảng cách không cần thiết */
  text-align: center;
  transition: background-color 0.3s, transform 0.3s, border-color 0.3s;
  background-color: #f8f8f8; /* Màu nền mặc định */
  font-size: 1rem; /* Điều chỉnh kích thước font */
  font-weight: bold;
  color: rgb(5, 7, 9); /* Màu chữ mặc định */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Thêm bóng nhẹ cho tab */
}

.category-list li.active {
  background-color: #d4a762; /* Màu nền khi tab được chọn */
  color: white; /* Màu chữ khi được chọn */
  border-color: #d4a762; /* Đổi màu viền khi được chọn */
  transform: scale(1.1); /* Phóng to nhẹ tab được chọn */
}

.category-list li:hover {
  background-color: #c09759; /* Màu nền khi hover */
  border-color: #c09759; /* Màu viền khi hover */
  transform: scale(1.05); /* Hiệu ứng phóng to nhẹ khi hover */
  color: #333;
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
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 400px;
  height: 100%;
}

.dish-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.dish-info {
  text-align: center;
  margin-bottom: 10px;
}

.dish-image {
  margin-top: 15px;
  width: 350px;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.dish-details p {
  margin: 3px 0; /* Giảm khoảng cách giữa các đoạn văn */
  color: #666;
  /* font-size: 0.8rem; */
  max-height: 50px; /* Giới hạn chiều cao để tránh nội dung quá dài */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.front1 {
  font-size: 1rem;
}
.front2 {
  font-size: 0.8rem;
}
.dish-details h3 {
  font-size: 1.4rem; /* Thu nhỏ kích thước tiêu đề */
  color: #333;
  font-weight: bold;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 5px 0; /* Giảm khoảng cách trên dưới */
}

.dish-details span {
  font-weight: bold;
  color: #000;
  margin-top: 7px; /* Giảm khoảng cách trên */
  font-size: 0.95rem; /* Giảm nhẹ kích thước chữ của giá */
}

.dish-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-top: 7px; */
}

.dish-rating {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
}

.average-rating {
  font-weight: bold;
  margin-right: 5px;
  font-size: 1rem; /* Giảm kích thước chữ đánh giá */
}

.stars {
  display: inline-flex; /* Đảm bảo các sao nằm ngang */
  margin-right: 5px;
}

.star {
  font-size: 1.5rem;
  color: #ddd;
  margin-right: 3px;
}

.star.filled {
  color: gold;
}

.review-count {
  font-size: 0.85rem; /* Giảm kích thước chữ số lượt đánh giá */
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
  color: red;
}

.favorite-button:hover i {
  color: #ff6666;
  transform: scale(1.1);
}

.quantity-input {
  margin-top: 7px;
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
  background-color: #d4a762;
  color: white;
  padding: 5px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s, transform 0.2s;
  font-size: 1rem;
}

.select-button:hover {
  background-color: #c09759;
  transform: scale(1.1);
}
</style>
