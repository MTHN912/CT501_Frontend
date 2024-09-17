<template>
  <div class="dish-detail-container">
    <!-- Hình ảnh món ăn lớn bên trái -->
    <div class="image-section">
      <img :src="dish.image" alt="dish image" class="dish-image" />
    </div>

    <!-- Thông tin món ăn bên phải -->
    <div class="info-section">
      <h2 class="dish-name">{{ dish.name }}</h2>
      <div class="location-info">
        <p>{{ dish.location }}</p>
        <p>Giờ mở cửa: {{ dish.openingTime }}</p>
        <p>Giá: {{ dish.price }} đ</p>
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
        <span>({{ dish.reviewsCount }} đánh giá)</span>
      </div>

      <!-- Nút yêu thích -->
      <button @click="toggleFavorite" class="favorite-button">
        <i :class="dish.favorite ? 'fas fa-heart' : 'far fa-heart'"></i>
        <span>{{ dish.favorite ? "Đã yêu thích" : "Yêu thích" }}</span>
      </button>

      <!-- Nút chọn món -->
      <button @click="selectDish" class="select-button">Chọn món</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "DishDetail",
  props: ["id"],
  data() {
    return {
      dish: null,
    };
  },
  created() {
    const dishId = this.id;
    const dishes = [
      {
        id: 1,
        name: "Phở bò",
        location: "392 - 394 Hoàng Văn Thụ, Tân Bình, TP. HCM",
        openingTime: "10:00 - 21:50",
        price: "40.000 - 200.000",
        rating: 4.5,
        reviewsCount: 999,
        image:
          "https://deliciousvietnam.net/wp-content/uploads/2020/05/Delicious-Vietnam-pho-bo-vietnamese-beef-noodle-soup-1870x1233.jpeg",
        favorite: false,
      },
      // Các món ăn khác...
    ];

    this.dish = dishes.find((dish) => dish.id === parseInt(dishId));
  },
  methods: {
    toggleFavorite() {
      this.dish.favorite = !this.dish.favorite;
    },
    selectDish() {
      alert(`Bạn đã chọn món ${this.dish.name}`);
    },
  },
};
</script>
<style scoped>
.dish-detail-container {
  display: flex;
  padding: 20px;
  background-color: #fff;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.image-section {
  flex: 1;
}

.dish-image {
  width: 100%;
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
</style>
