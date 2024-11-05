<template>
  <div class="favorite-dishes-container">
    <h2 class="title">Danh sách món ăn yêu thích</h2>
    <div v-if="favoriteDishes.length > 0" class="dishes-list">
      <div
        v-for="dish in favoriteDishes"
        :key="dish._id"
        class="dish-card"
        @click="goToDetail(dish._id)"
      >
        <img :src="dish.image" alt="Dish image" class="dish-image" />
        <h3>{{ dish.name }}</h3>
        <p>{{ dish.description }}</p>
        <p>
          Giá: <strong>{{ dish.price }} VNĐ</strong>
        </p>
        <button @click.stop="removeFavorite(dish._id)" class="remove-button">
          Xóa khỏi yêu thích
        </button>
      </div>
    </div>
    <div v-else>
      <p>Bạn chưa có món ăn yêu thích nào.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FavoriteDishes",
  data() {
    return {
      favoriteDishes: [],
    };
  },
  created() {
    this.fetchFavoriteDishes();
  },
  methods: {
    async fetchFavoriteDishes() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            "http://localhost:3000/dish/getFavoriteDish",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          this.favoriteDishes = response.data; // Lưu dữ liệu món ăn yêu thích
        }
      } catch (error) {
        console.error("Error fetching favorite dishes:", error);
      }
    },
    async removeFavorite(dishId) {
      try {
        const token = localStorage.getItem("token");
        await axios.patch(
          `http://localhost:3000/dish/dishes/${dishId}/favorite`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Loại bỏ món ăn khỏi danh sách hiện tại
        this.favoriteDishes = this.favoriteDishes.filter(
          (dish) => dish._id !== dishId
        );
      } catch (error) {
        console.error("Error removing favorite dish:", error);
      }
    },
    goToDetail(id) {
      this.isLoading = true;
      setTimeout(() => {
        this.$router
          .push({ name: "DishDetail", params: { id: id } })
          .finally(() => {
            this.isLoading = false;
          });
      }, 500);
    },
  },
};
</script>

<style scoped>
.favorite-dishes-container {
  text-align: center;
}
.title {
  margin-top: 120px;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
}
.dishes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center; /* Căn giữa các card */
}

.dish-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 30px;
  width: 300px; /* Đảm bảo tất cả các card có cùng chiều rộng */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.dish-image {
  width: 100%; /* Chiếm toàn bộ chiều rộng card */
  height: 150px; /* Đặt chiều cao cố định để đồng nhất */
  object-fit: cover; /* Cắt hình ảnh nếu cần để phù hợp với khung */
  border-radius: 8px;
}

.dish-card h3 {
  font-size: 18px;
  margin: 10px 0;
}

.dish-card p {
  font-size: 14px;
  margin: 5px 0;
}

.remove-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: auto; /* Đẩy nút xuống đáy card */
}

.remove-button:hover {
  background-color: #d43f3a;
}
</style>
