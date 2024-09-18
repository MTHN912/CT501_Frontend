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
            <button @click="removeItem(item.dishId)" class="remove-button">
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
        <button @click="checkout" class="checkout-button">Đặt Bàn</button>
      </div>
    </div>

    <div v-else>
      <p>Thực đơn của bạn đang trống.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CartDetail",
  data() {
    return {
      cart: null, // Ban đầu cart là null, sẽ được gán dữ liệu từ server sau khi tải xong
      isLoading: true, // Trạng thái đang tải dữ liệu
    };
  },
  computed: {
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
    // Tăng số lượng: chỉ gửi số lượng +1 đến API addCart
    async increaseQuantity(item) {
      try {
        await axios.post("http://localhost:3000/cart/addCart", {
          dishId: item.dishId,
          quantity: 1, // Mỗi lần chỉ tăng 1
        });
        await this.fetchCart(); // Sau khi tăng, cập nhật lại giỏ hàng
      } catch (error) {
        console.error("Lỗi khi tăng số lượng:", error);
      }
    },

    // Giảm số lượng: gọi API removeCart để giảm 1 món
    async decreaseQuantity(item) {
      if (item.quantity > 1) {
        try {
          await axios.post("http://localhost:3000/cart/removeCart", {
            dishId: item.dishId,
          });
          await this.fetchCart(); // Sau khi giảm, cập nhật lại giỏ hàng
        } catch (error) {
          console.error("Lỗi khi giảm số lượng:", error);
        }
      }
    },

    async removeItem(dishId) {
      try {
        await axios.post("http://localhost:3000/cart/removeCart", {
          dishId: dishId,
        });
        await this.fetchCart();
      } catch (error) {
        console.error("Lỗi khi bỏ món:", error);
      }
    },

    async fetchCart() {
      try {
        const response = await axios.get("http://localhost:3000/cart/getCart");
        this.cart = response.data.cart;
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
      } finally {
        this.isLoading = false; // Dừng trạng thái tải sau khi dữ liệu đã lấy về
      }
    },

    checkout() {
      this.$router.push({ name: "Checkout" });
    },
  },

  mounted() {
    this.fetchCart();
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
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  transition: background-color 0.3s ease;
}

.cart-item:hover {
  background-color: #f1f1f1;
}

.cart-item-info {
  display: flex;
  align-items: center;
  width: 100%;
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
}

.cart-item-text button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cart-item-text button:hover:enabled {
  background-color: #0056b3;
}

.dish-image {
  width: 300px;
  height: 200px;
  object-fit: cover;
  margin-left: 40px;
  margin-right: 20px; /* Khoảng cách giữa hình ảnh và nút bỏ món */
  border-radius: 10px; /* Bo góc hình ảnh */
  object-fit: cover; /* Đảm bảo hình ảnh không bị biến dạng */
}

.remove-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #c82333;
}

.cart-summary {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 2px solid #ddd;
  text-align: right;
}

.cart-summary h3 {
  margin-bottom: 10px;
  font-size: 24px;
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
}

.checkout-button:hover {
  background-color: #218838;
}
</style>
