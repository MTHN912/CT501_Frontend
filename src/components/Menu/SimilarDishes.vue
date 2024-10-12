<template>
  <div class="similar-dishes-container" v-if="similarDishes.length">
    <h2>Các món cùng danh mục</h2>
    <div class="row">
      <div v-for="dish in similarDishes" :key="dish._id" class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm">
          <img
            :src="dish.image"
            alt="dish image"
            class="card-img-top similar-dish-image"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-center">{{ dish.name }}</h5>
            <p class="card-text text-center mb-auto">
              Giá: {{ dish.price }} VNĐ
            </p>
            <router-link
              :to="`/${dish._id}`"
              class="btn btn-primary mt-2 align-self-center"
              @click.native="reloadPage"
            >
              Xem chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "SimilarDishes",
  data() {
    return {
      similarDishes: [],
    };
  },
  computed: {
    ...mapGetters(["category"]), // Lấy category từ Vuex Store
  },
  watch: {
    category: {
      immediate: true, // Gọi fetch ngay khi component được khởi tạo
      handler(newCategory) {
        if (newCategory) {
          this.fetchSimilarDishes(newCategory);
        }
      },
    },
  },
  methods: {
    reloadPage() {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
    async fetchSimilarDishes(category) {
      try {
        const response = await axios.get(
          `http://localhost:3000/dish/getDish?category=${category}`
        );
        this.similarDishes = response.data;
      } catch (error) {
        console.error("Lỗi khi tải các món cùng danh mục:", error);
      }
    },
  },
};
</script>

<style scoped>
.similar-dishes-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
}

.card {
  border-radius: 10px;
  overflow: hidden;
}

.similar-dish-image {
  object-fit: cover;
  width: 100%;
  height: 180px; /* Đảm bảo tất cả hình ảnh có chiều cao cố định */
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.card-text {
  font-size: 1rem;
  color: #333;
}

.btn-primary {
  width: 100%;
  margin-top: auto;
}

h3 {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
