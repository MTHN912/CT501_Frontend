<template>
  <div class="food-management">
    <div class="header">
      <h2>Food Management</h2>
      <input
        type="text"
        placeholder="Search..."
        v-model="searchQuery"
        class="search"
      />
      <button @click="openModal" class="add-button">Add Food</button>
    </div>

    <table class="food-table">
      <thead>
        <tr>
          <th @click="sortBy('name')">Tên món ⬍</th>
          <th @click="sortBy('description')">Mô tả ⬍</th>
          <th @click="sortBy('category')">Danh mục ⬍</th>
          <th @click="sortBy('rating')">Đánh Giá ⬍</th>
          <th @click="sortBy('price')">Đơn Giá ⬍</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="food in filteredFoods" :key="food._id">
          <td>
            <img :src="food.image" alt="Food image" class="food-image" />{{
              food.name
            }}
          </td>
          <td>{{ food.description }}</td>
          <td>{{ food.category }}</td>
          <td>{{ food.rating }}</td>
          <td>${{ food.price }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal thêm món ăn -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h2>Thêm món ăn</h2>
        <form @submit.prevent="submitFood">
          <label for="image">Hình Ảnh:</label>
          <input
            v-model="newFood.image"
            type="text"
            id="image"
            placeholder="URL hình ảnh"
          />

          <label for="name">Tên món:</label>
          <input
            v-model="newFood.name"
            type="text"
            id="name"
            placeholder="Tên món ăn"
          />

          <label for="description">Mô tả:</label>
          <input
            v-model="newFood.description"
            type="text"
            id="description"
            placeholder="Mô tả ngắn"
          />

          <label for="detailedDescription">Mô tả chi tiết:</label>
          <textarea
            v-model="newFood.detailedDescription"
            id="detailedDescription"
            placeholder="Mô tả chi tiết"
          ></textarea>

          <label for="category">Danh mục:</label>
          <input
            v-model="newFood.category"
            type="text"
            id="category"
            placeholder="Danh mục món ăn"
          />

          <label for="price">Đơn giá:</label>
          <input
            v-model="newFood.price"
            type="number"
            id="price"
            placeholder="Đơn giá"
          />

          <button type="submit">Thêm món</button>
          <button @click="closeModal" type="button">Hủy</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: "",
      sortField: "",
      sortOrder: 1,
      foods: [],
      isModalOpen: false, // Biến điều khiển trạng thái mở/đóng modal
      newFood: {
        image: "",
        name: "",
        description: "",
        detailedDescription: "",
        category: "",
        price: 0,
      },
    };
  },
  computed: {
    filteredFoods() {
      let filtered = this.foods.filter((food) =>
        food.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      if (this.sortField) {
        filtered.sort((a, b) => {
          let result = 0;
          if (a[this.sortField] < b[this.sortField]) result = -1;
          if (a[this.sortField] > b[this.sortField]) result = 1;
          return result * this.sortOrder;
        });
      }

      return filtered;
    },
  },
  methods: {
    sortBy(field) {
      if (this.sortField === field) {
        this.sortOrder *= -1;
      } else {
        this.sortField = field;
        this.sortOrder = 1;
      }
    },
    openModal() {
      this.isModalOpen = true; // Mở modal
    },
    closeModal() {
      this.isModalOpen = false; // Đóng modal
    },
    async submitFood() {
      try {
        const response = await axios.post(
          "http://localhost:3000/dish/addDish",
          this.newFood
        );
        this.foods.push(response.data); // Thêm món ăn mới vào danh sách
        this.closeModal(); // Đóng modal sau khi thêm thành công
      } catch (error) {
        console.error("Error adding food:", error);
      }
    },
    async fetchFoods() {
      try {
        const response = await axios.get("http://localhost:3000/dish/getDish");
        this.foods = response.data;
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    },
  },
  mounted() {
    this.fetchFoods();
  },
};
</script>

<style scoped>
.food-management {
  padding: 20px;
  background-color: #101827;
  color: #fff;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search {
  padding: 10px;
  background-color: #1d283c;
  border-radius: 5px;
  border: none;
  width: 200px;
}

.add-button {
  background-color: #0084ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.food-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.food-table th,
.food-table td {
  padding: 10px;
  border-bottom: 1px solid #444;
}

.food-table th {
  cursor: pointer;
}

.food-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;
}

.active-status {
  color: #2ba972;
}

.disabled-status {
  color: #59719d;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}

.modal-content h2 {
  margin-bottom: 20px;
}

.modal-content label {
  display: block;
  margin-bottom: 5px;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.modal-content button {
  margin-right: 10px;
  padding: 10px 20px;
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
