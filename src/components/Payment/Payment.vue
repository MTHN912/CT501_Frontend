<template>
  <div class="checkout-container">
    <h2 class="title">Xác nhận đơn hàng</h2>

    <div v-if="isLoading" class="loading">
      <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else class="checkout-details">
      <!-- Hiển thị chi tiết giỏ hàng với kiểu tương tự ảnh -->
      <ul class="order-summary">
        <li v-for="(item, index) in cart.items" :key="index" class="order-item">
          <div class="item-details">
            <!-- Hiển thị hình ảnh món ăn -->
            <img :src="item.dishImage" alt="Dish image" class="item-image" />
            <div class="item-info">
              <!-- Tên món ăn -->
              <h3 class="item-name">{{ item.dishName }}</h3>
              <p class="item-type">Danh mục: {{ item.dishCategory }}</p>
              <!-- <p class="item-note">Đổi ý miễn phí trong 15 ngày</p> -->
            </div>
            <!-- Giá và số lượng -->
            <div class="item-pricing">
              <p>
                Đơn giá: <strong>{{ item.dishPrice }} đ</strong>
              </p>
              <p>
                Số lượng: <strong>{{ item.quantity }}</strong>
              </p>
              <p>
                Thành tiền: <strong>{{ item.totalPriceForItem }} đ</strong>
              </p>
            </div>
          </div>
        </li>
      </ul>

      <!-- Người dùng chọn số lượng bàn -->
      <div class="table-selection">
        <label for="number-of-tables">Số bàn muốn đặt:</label>
        <input
          type="number"
          id="number-of-tables"
          v-model.number="numberOfTables"
          min="1"
        />
      </div>

      <!-- Phương thức thanh toán -->
      <div class="payment-method">
        <label>Phương thức thanh toán:</label>
        <select v-model="selectedPaymentMethod">
          <option value="cash">Thanh toán tiền mặt</option>
          <option value="credit-card">Thẻ tín dụng</option>
          <option value="momo">Ví Momo</option>
        </select>
      </div>

      <!-- Nếu khách chọn tổ chức tiệc tại nhà thì hiển thị các trường nhập -->
      <div class="home-party-details">
        <div class="form-group">
          <label for="party-address">Địa chỉ tổ chức tiệc:</label>
          <input
            type="text"
            id="party-address"
            v-model="partyAddress"
            placeholder="Nhập địa chỉ tổ chức tiệc"
          />
        </div>
        <div class="form-group">
          <label for="phone-number">Số điện thoại liên hệ:</label>
          <input
            type="tel"
            id="phone-number"
            v-model="phoneNumber"
            placeholder="Nhập số điện thoại"
          />
        </div>
        <div class="form-group">
          <label for="note">Ghi chú:</label>
          <textarea
            id="note"
            v-model="note"
            placeholder="Nhập thêm yêu cầu nếu có"
          ></textarea>
        </div>
      </div>

      <!-- Tổng kết và xác nhận -->
      <div class="checkout-summary">
        <p>
          Tổng số món: <strong>{{ totalQuantity }}</strong>
        </p>
        <p>
          Tổng tiền (cho {{ numberOfTables }} bàn):
          <strong>{{ totalPriceForTables }} đ</strong>
        </p>
        <button @click="confirmOrder" class="confirm-button">
          Xác nhận đặt bàn
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "CheckoutPage",
  data() {
    return {
      isLoading: true,
      numberOfTables: 1, // Số bàn muốn đặt, mặc định là 1
      selectedPaymentMethod: "cash", // Phương thức thanh toán mặc định
      isHomeParty: false, // Trạng thái người dùng chọn tổ chức tiệc tại nhà
      partyAddress: "", // Địa chỉ tổ chức tiệc
      phoneNumber: "", // Số điện thoại liên hệ
      note: "", // Ghi chú từ khách hàng
    };
  },
  computed: {
    ...mapState(["cart"]), // Lấy dữ liệu giỏ hàng từ Vuex Store

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

    // Tính tổng tiền dựa trên số lượng bàn
    totalPriceForTables() {
      return this.totalPrice * this.numberOfTables;
    },
  },
  methods: {
    ...mapActions(["fetchCart", "confirmOrder"]),

    async confirmOrder() {
      try {
        const orderDetails = {
          tables: this.numberOfTables,
          paymentMethod: this.selectedPaymentMethod,
          totalPrice: this.totalPriceForTables,
          isHomeParty: this.isHomeParty, // Trạng thái có tổ chức tiệc tại nhà
          partyAddress: this.partyAddress, // Địa chỉ tổ chức tiệc
          phoneNumber: this.phoneNumber, // Số điện thoại liên hệ
          note: this.note, // Ghi chú từ khách hàng
        };

        // Gửi dữ liệu đặt bàn và các chi tiết khác
        await this.confirmOrder(orderDetails);
        this.$router.push({ name: "OrderSuccess" });
      } catch (error) {
        console.error("Lỗi khi xác nhận đặt bàn:", error);
      }
    },
  },
  async mounted() {
    try {
      await this.fetchCart(); // Lấy lại dữ liệu giỏ hàng
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<style scoped>
.checkout-container {
  padding: 50px;
  max-width: 1200px;
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

.order-summary {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}

.order-item {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  display: flex;
  justify-content: space-between;
}

.item-details {
  display: flex;
  align-items: center;
  width: 100%;
}

.item-image {
  width: 80px;
  height: 80px;
  margin-right: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  object-fit: cover;
}

.item-info {
  flex-grow: 1;
}

.item-name {
  font-size: 18px;
  font-weight: bold;
}

.item-type {
  font-size: 14px;
  color: #666;
}

.item-note {
  font-size: 12px;
  color: #ff0000;
}

.item-pricing {
  text-align: right;
}

.item-pricing p {
  margin: 5px 0;
}
.table-selection,
.payment-method,
.home-party {
  margin-top: 20px;
}

.form-group {
  margin-top: 10px;
}

.form-group input,
.form-group textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.form-group input:focus,
.form-group textarea:focus,
select:focus {
  border-color: #28a745;
  box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
  outline: none;
}
select {
  appearance: none;
  background-color: #fff;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="none" stroke="%23999" stroke-width="0.8" d="M2 0L0 2h4L2 0zM2 5L0 3h4l-2 2z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 10px 10px;
}

select::-ms-expand {
  display: none;
}
.form-group input,
.form-group textarea,
select {
  margin-bottom: 15px;
}
.checkout-summary {
  margin-top: 20px;
  text-align: right;
}

.confirm-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #218838;
}
</style>
