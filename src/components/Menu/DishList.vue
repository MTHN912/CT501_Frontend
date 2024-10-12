<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>

  <div v-if="showMessage" class="success-message">
    {{ successMessage }}
  </div>

  <!-- Danh mục món ăn -->
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

  <!-- Danh sách món ăn -->
  <div class="menu-container">
    <div v-if="showMessage" class="success-message">
      {{ successMessage }}
    </div>

    <div class="dish-list" ref="dishList">
      <ul class="dish-grid">
        <li v-for="dish in paginatedDishes" :key="dish.id" class="dish-item">
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
                  <span
                    v-if="
                      ratings[dish._id] && ratings[dish._id].reviewCount > 0
                    "
                  >
                    <span class="average-rating">
                      {{ ratings[dish._id].averageRating.toFixed(1) }}
                    </span>
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
                    <span class="review-count">
                      | {{ ratings[dish._id].reviewCount }} đánh giá
                    </span>
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
              <div class="quantity-container">
                <div class="quantity-input">
                  <button
                    @click="decreaseQuantity(dish)"
                    class="quantity-button"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    v-model="dish.quantity"
                    min="1"
                    class="quantity-field no-arrows"
                  />
                  <button
                    @click="increaseQuantity(dish)"
                    class="quantity-button"
                  >
                    +
                  </button>
                </div>
                <button @click="selectDish(dish)" class="select-button">
                  Chọn món
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Thanh phân trang -->
    <nav aria-label="Dish pagination">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click.prevent="changePage(currentPage - 1)"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">
            {{ page }}
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="changePage(currentPage + 1)"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
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
      successMessage: "",
      showMessage: false,
      isLoading: false,
      // Phân trang
      currentPage: 1,
      itemsPerPage: 9,
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
    paginatedDishes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.filteredDishes.slice(start, end); // Phân trang trên danh sách đã lọc
    },
    totalPages() {
      return Math.ceil(this.filteredDishes.length / this.itemsPerPage);
    },
    // Truy cập giỏ hàng từ store
    cart() {
      return this.$store.state.cart;
    },
  },
  methods: {
    increaseQuantity(dish) {
      dish.quantity++;
    },
    decreaseQuantity(dish) {
      if (dish.quantity > 1) {
        dish.quantity--;
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.$nextTick(() => {
        const dishList = this.$refs.dishList;
        if (dishList) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    },
    // Lọc món ăn theo danh mục
    filterByCategory(category) {
      this.selectedCategory = category;
      this.currentPage = 1; // Đặt lại về trang đầu tiên khi đổi danh mục

      // Gọi lại API để lấy món ăn theo danh mục đã chọn
      this.fetchDishes(category);

      this.$nextTick(() => {
        const dishList = this.$refs.dishList;
        if (dishList) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    },
    // Điều hướng đến trang chi tiết món ăn
    goToDetail(id) {
      this.isLoading = true;
      setTimeout(() => {
        this.$router
          .push({ name: "DishDetail", params: { id: id } })
          .finally(() => {
            this.isLoading = false; // Tắt loading sau khi hoàn tất
          });
      }, 2000);
    },
    // Hiện/Ẩn danh sách danh mục
    toggleCategory() {
      this.showCategories = !this.showCategories;
    },
    // Thêm món vào giỏ hàng thông qua store
    selectDish(dish) {
      const cartItem = this.cart.items.find((item) => item.dishId === dish._id);

      if (cartItem) {
        // Nếu món đã có trong giỏ hàng
        const confirmMessage = `Món ${dish.name} đã có trong giỏ hàng với số lượng ${cartItem.quantity}. Bạn có muốn thêm ${dish.quantity} món này nữa không?`;

        if (confirm(confirmMessage)) {
          this.addToCart(dish, true);
        } else {
          // Người dùng hủy hành động, không làm gì cả
          return;
        }
      } else if (dish.quantity >= 2) {
        // Nếu số lượng lớn hơn hoặc bằng 2 và món chưa có trong giỏ hàng
        const confirmMessage = `Đây là chọn món cho một bàn tiệc, bạn có chắc muốn chọn ${dish.quantity} món này?`;

        if (confirm(confirmMessage)) {
          // Người dùng xác nhận, tiến hành thêm vào giỏ hàng
          this.addToCart(dish);
        } else {
          // Người dùng hủy hành động, không làm gì cả
          return;
        }
      } else {
        // Số lượng nhỏ hơn 2 và món chưa có trong giỏ hàng, không cần cảnh báo
        this.addToCart(dish);
      }
    },

    addToCart(dish, isAddingExtra = false) {
      let newQuantity = dish.quantity || 1;

      // Nếu món đã có trong giỏ hàng và đang thêm số lượng mới, cộng dồn số lượng
      if (isAddingExtra) {
        const cartItem = this.cart.items.find(
          (item) => item.dishId === dish._id
        );
        if (cartItem) {
          newQuantity += cartItem.quantity;
        }
      }

      this.$store
        .dispatch("addToCart", {
          dishId: dish._id,
          quantity: newQuantity,
        })
        .then(() => {
          // Hiển thị thông báo thành công
          this.successMessage = `Bạn đã thêm ${dish.quantity || 1} món ${
            dish.name
          } vào giỏ hàng thành công!`;
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
    // Gọi API để lấy danh sách món ăn có thể tìm kiếm theo danh mục
    async fetchDishes(category = "Tất cả") {
      try {
        // Tạo URL động, nếu danh mục không phải là "Tất cả" thì thêm tham số query
        let apiUrl = "http://localhost:3000/dish/getDish";
        if (category !== "Tất cả") {
          apiUrl += `?category=${category}`;
        }

        // Gọi API để lấy món ăn dựa trên danh mục đã chọn
        const response = await axios.get(apiUrl);
        this.dishes = response.data;

        // Gọi API để lấy đánh giá trung bình cho từng món ăn
        for (const dish of this.dishes) {
          const ratingResponse = await axios.get(
            `http://localhost:3000/review/getAverageRating/${dish._id}`
          );

          // Lưu trữ kết quả vào ratings
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
    window.scrollTo(0, 0);
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
  /* margin-bottom: 20px; */
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
  border: 1px solid #d4a762;
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
  margin-top: 5px;
  font-size: 1rem;
}
.front2 {
  margin-top: 5px;
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
.quantity-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  width: 100%; /* Đảm bảo container chiếm hết chiều ngang */
}

.quantity-input {
  display: flex;
  align-items: center;
  /* border: 1px solid #d4a762; */
  border-radius: 8px;
  overflow: hidden;
}

.quantity-field {
  width: 40px;
  padding: 4px;
  border: none;
  text-align: center;
  font-size: 1rem;
  background-color: #e6cca5;
  height: 100%;
}

.quantity-button {
  background-color: #d4a762;
  color: white;
  width: 30px;
  height: 100%;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, transform 0.2s;
}

.quantity-button:hover {
  background-color: #c09759; /* Đổi màu khi hover */
  transform: scale(1.1); /* Hiệu ứng phóng to nhẹ */
}

.quantity-button:first-child {
  border-right: 1px solid #fff; /* Viền giữa nút trừ và input */
}

.quantity-button:last-child {
  border-left: 1px solid #fff; /* Viền giữa nút cộng và input */
}
.select-button {
  background-color: #d4a762;
  color: white;
  padding: 5px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 15px; /* Khoảng cách giữa button và input */
  transition: background-color 0.3s, transform 0.2s;
}

.select-button:hover {
  background-color: #c09759;
  transform: scale(1.1);
}
.no-arrows::-webkit-outer-spin-button,
.no-arrows::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
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
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8); /* Màu nền overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.loading-spinner {
  border: 8px solid #f3f3f3; /* Màu nền của spinner */
  border-top: 8px solid #d4a762; /* Màu vàng theo tone chính */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1.5s linear infinite; /* Hiệu ứng xoay */
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.pagination {
  margin-top: 20px;
}

.page-item.active .page-link {
  background-color: #d4a762;
  border-color: #d4a762;
  color: white;
}

.page-link {
  color: #d4a762;
}

.page-link:hover {
  color: #d4a762;
}
</style>
