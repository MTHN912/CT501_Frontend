<template>
  <div class="cart-container">
    <h2 class="title">Thực Đơn của Bạn</h2>

    <!-- Hiển thị thông báo đang tải nếu dữ liệu chưa tải xong -->
    <div v-if="isLoading" class="loading">
      <p>Đang tải dữ liệu...</p>
    </div>

    <!-- Hiển thị giỏ hàng khi dữ liệu đã tải xong -->
    <div
      v-if="cart && cart.items && cart.items.length > 0"
      class="cart-details"
    >
      <ul class="cart-item-list">
        <li v-for="(item, index) in cart.items" :key="index" class="cart-item">
          <div class="cart-item-info">
            <!-- Hiển thị thông tin món ăn -->
            <div class="cart-item-text">
              <h3>{{ item.dishName }}</h3>
              <p>
                Số lượng:
                <!-- Nút Giảm số lượng -->
                <button
                  @click="decreaseQuantity(item)"
                  :disabled="item.quantity === 1"
                >
                  -
                </button>
                <strong>{{ item.quantity }}</strong>
                <!-- Nút Tăng số lượng -->
                <button @click="increaseQuantity(item)">+</button>
              </p>
              <p>
                Đơn giá: <strong>{{ item.dishPrice }} đ</strong>
              </p>
              <p>
                Tổng giá: <strong>{{ item.totalPriceForItem }} đ</strong>
              </p>
            </div>
            <img :src="item.dishImage" alt="dish image" class="dish-image" />
            <button
              @click="handleRemoveItem(item.dishId)"
              class="remove-button"
            >
              Bỏ món
            </button>
          </div>
        </li>
      </ul>

      <div class="cart-summary">
        <h3>Tổng cộng</h3>
        <p>
          Tổng số món: <strong>{{ totalQuantity }}</strong>
        </p>
        <p>
          Tổng giá tất cả: <strong>{{ totalPrice }} đ</strong>
        </p>
        <button @click="checkout" class="checkout-button">Đặt Tiệc</button>
      </div>
    </div>

    <div v-else>
      <p>Thực đơn của bạn đang trống.</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "CartDetail",
  data() {
    return {
      isLoading: true, // Trạng thái đang tải dữ liệu
    };
  },
  computed: {
    ...mapState(["cart"]), // Lấy giỏ hàng từ state trong store

    totalQuantity() {
      if (this.cart && this.cart.items) {
        return this.cart.items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      }
      return 0;
    },
    totalPrice() {
      if (this.cart && this.cart.items) {
        return this.cart.items.reduce(
          (total, item) => total + item.totalPriceForItem,
          0
        );
      }
      return 0;
    },
  },
  methods: {
    ...mapActions(["fetchCart", "addToCart", "removeItem"]), // Liên kết các hành động từ store

    async increaseQuantity(item) {
      try {
        await this.addToCart({ dishId: item.dishId, quantity: 1 });
        await this.fetchCart(); // Cập nhật lại giỏ hàng sau khi tăng số lượng
      } catch (error) {
        console.error("Lỗi khi tăng số lượng:", error);
      }
    },

    async decreaseQuantity(item) {
      if (item.quantity > 1) {
        try {
          await this.addToCart({ dishId: item.dishId, quantity: -1 });
          await this.fetchCart(); // Cập nhật lại giỏ hàng sau khi giảm số lượng
        } catch (error) {
          console.error("Lỗi khi giảm số lượng:", error);
        }
      }
    },

    async handleRemoveItem(dishId) {
      try {
        // Gọi action từ Vuex store
        await this.$store.dispatch("removeItem", dishId);
      } catch (error) {
        console.error("Lỗi khi bỏ món:", error);
      }
    },

    checkout() {
      this.$router.push({ name: "Checkout" });
    },
  },
  async mounted() {
    try {
      await this.fetchCart(); // Tải dữ liệu giỏ hàng từ store
    } finally {
      this.isLoading = false; // Dừng trạng thái tải sau khi dữ liệu đã lấy về
    }
  },
};
</script>

<style scoped>
.cart-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  margin-top: 120px;
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #777;
}

.cart-item-list {
  list-style: none;
  padding: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  transition: background-color 0.3s ease;
  min-height: 150px; /* Cố định chiều cao tối thiểu cho các mục */
}

.cart-item:hover {
  background-color: #f1f1f1;
}

.cart-item-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.cart-item-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100px; /* Cố định chiều cao cho thông tin món ăn */
}
.cart-item-text button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  width: 40px; /* Cố định kích thước cho nút */
  height: 40px;
  text-align: center;
}

.cart-item-text button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cart-item-text button:hover:enabled {
  background-color: #0056b3;
}

.dish-image {
  width: 300px; /* Cố định kích thước ảnh */
  height: 200px;
  object-fit: cover;
  margin-left: 40px;
  margin-right: 20px;
  border-radius: 10px;
  align-self: center; /* Đảm bảo hình ảnh được căn giữa theo trục dọc */
}
.remove-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.remove-button:hover {
  background-color: #c82333;
}

.cart-summary {
  position: fixed;
  right: 20px; /* Khoảng cách từ bên phải */
  bottom: 20px; /* Khoảng cách từ dưới cùng */
  padding: 20px;
  background-color: #fff; /* Nền trắng để dễ đọc */
  border: 1px solid #ddd; /* Đường viền mỏng */
  border-radius: 10px; /* Bo góc */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
  max-width: 300px; /* Chiều rộng tối đa để không chiếm quá nhiều diện tích */
  z-index: 1000; /* Đảm bảo phần "Tổng Cộng" luôn ở trên cùng */
  text-align: right;
}

.cart-summary h3,
.cart-summary p {
  margin-left: 20px; /* Khoảng cách giữa các dòng */
}
.checkout-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  /* width: 100%; Cố định chiều rộng cho nút */
}

.checkout-button:hover {
  background-color: #218838;
}
</style>
