<template>
  <div class="checkout-container">
    <h2 class="title">Xác nhận đơn tiệc</h2>

    <div v-if="isLoading" class="loading">
      <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else class="checkout-details">
      <ul class="order-summary">
        <li v-for="(item, index) in cart.items" :key="index" class="order-item">
          <div class="item-details">
            <img :src="item.dishImage" alt="Dish image" class="item-image" />
            <div class="item-info">
              <h3 class="item-name">{{ item.dishName }}</h3>
              <p class="item-type">Danh mục: {{ item.dishCategory }}</p>
            </div>
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

      <div class="table-selection">
        <label for="number-of-tables">Số bàn muốn đặt:</label>
        <input
          type="number"
          id="number-of-tables"
          v-model.number="numberOfTables"
          min="1"
        />
      </div>

      <div class="party-type-selection">
        <label for="party-type">Loại tiệc:</label>
        <select v-model="selectedPartyType">
          <option value="birthday">Sinh nhật</option>
          <option value="wedding">Tiệc cưới</option>
          <option value="company">Tiệc công ty</option>
        </select>
      </div>
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
        <div class="party-datetime-selection">
          <label for="party-date">Ngày diễn ra tiệc:</label>
          <input type="date" id="party-date" v-model="partyDate" required />
        </div>

        <div class="party-time-selection">
          <label for="party-time">Giờ diễn ra tiệc:</label>
          <input type="time" id="party-time" v-model="partyTime" required />
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
        <div class="deposit-section">
          <label for="deposit-amount"> Số tiền đặt cọc: </label>
          <input
            type="number"
            id="deposit-amount"
            v-model.number="depositAmount"
            :placeholder="`Số tiền đặt cọc tối thiểu là
          ${calculatedDeposit} đ`"
          />
        </div>

        <div class="payment-method">
          <label>Phương thức thanh toán:</label>
          <select v-model="selectedPaymentMethod">
            <option value="cash">Thanh toán tiền mặt</option>
            <option value="credit-card">Thẻ tín dụng</option>
            <option value="momo">Ví Momo</option>
          </select>
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

      <div class="checkout-summary">
        <p>
          Tổng số món: <strong>{{ totalQuantity }}</strong>
        </p>
        <p>
          Tổng tiền (cho {{ numberOfTables }} bàn):
          <strong>{{ totalPriceForTables }} đ</strong>
        </p>
        <button
          @click="confirmOrder"
          class="confirm-button"
          :disabled="isSubmitting"
        >
          Xác nhận đặt tiệc
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { mapActions, mapState } from "vuex";
export default {
  name: "CheckoutPage",
  data() {
    return {
      isLoading: true,
      numberOfTables: 1, // Số bàn muốn đặt, mặc định là 1
      selectedPartyType: "birthday", // Loại tiệc mặc định
      selectedPaymentMethod: "cash", // Phương thức thanh toán mặc định
      partyAddress: "", // Địa chỉ tổ chức tiệc
      phoneNumber: "", // Số điện thoại liên hệ
      note: "", // Ghi chú từ khách hàng
      partyDate: "",
      partyTime: "",
      isSubmitting: false,
      depositAmount: 0,
    };
  },
  computed: {
    ...mapState(["cart"]), // Lấy dữ liệu giỏ hàng từ Vuex Store
    calculatedDeposit() {
      if (this.totalPriceForTables >= 20000000) {
        return this.totalPriceForTables * 0.5;
      } else if (this.totalPriceForTables >= 10000000) {
        return this.totalPriceForTables * 0.4;
      } else if (this.totalPriceForTables >= 5000000) {
        return this.totalPriceForTables * 0.3;
      }
      return this.depositAmount || 0; // Đặt cọc tùy chọn
    },

    totalQuantity() {
      return this.cart && this.cart.items
        ? this.cart.items.reduce((total, item) => total + item.quantity, 0)
        : 0;
    },

    totalPrice() {
      return this.cart && this.cart.items
        ? this.cart.items.reduce(
            (total, item) => total + item.totalPriceForItem,
            0
          )
        : 0;
    },

    // Tính tổng tiền dựa trên số lượng bàn
    totalPriceForTables() {
      return this.totalPrice * this.numberOfTables;
    },
  },
  methods: {
    ...mapActions(["fetchCart", "confirmOrder"]),

    async confirmOrder() {
      this.isSubmitting = true;
      try {
        const orderDetails = {
          tables: this.numberOfTables,
          partyType: this.selectedPartyType,
          paymentMethod: this.selectedPaymentMethod,
          totalPrice: this.totalPriceForTables,
          depositAmount: this.depositAmount, // Số tiền đặt cọc người dùng nhập
          partyAddress: this.partyAddress || null,
          phoneNumber: this.phoneNumber || null,
          note: this.note || null,
          partyDateTime: `${this.partyDate}T${this.partyTime}:00`, // Kết hợp ngày và giờ tiệc
          items: this.cart.items.map((item) => ({
            dishId: item.dishId,
            dishName: item.dishName,
            dishPrice: item.dishPrice,
            quantity: item.quantity,
            totalPriceForItem: item.totalPriceForItem,
          })),
        };

        // Gọi API tạo đơn hàng với thông tin đã chuẩn bị
        const response = await axios.post(
          "http://localhost:3000/order/orders",
          orderDetails
        );

        // Lấy mã đơn hàng sau khi tạo thành công
        const orderId = response.data.order._id;

        // Làm trống giỏ hàng sau khi đơn hàng thành công
        await this.fetchCart();

        // Thông báo đặt hàng thành công
        Swal.fire({
          icon: "success",
          title: "Đặt hàng thành công!",
          text: "Cảm ơn bạn đã đặt hàng.",
          showConfirmButton: false,
          timer: 3000,
        });

        // Điều hướng người dùng tới trang thành công sau khi hoàn tất
        setTimeout(() => {
          if (orderId) {
            this.$router.push({
              name: "OrderSuccess",
              params: { id: orderId },
            });
          }
        }, 1000);
      } catch (error) {
        // Xử lý các lỗi trả về từ API, ví dụ lỗi 400
        if (error.response && error.response.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: error.response.data.message,
            showConfirmButton: true,
          });
        } else {
          console.error("Lỗi khi xác nhận đặt bàn:", error);
        }
      } finally {
        this.isSubmitting = false;
      }
    },
  },
  async mounted() {
    try {
      await this.fetchCart(); // Lấy lại dữ liệu giỏ hàng
    } finally {
      this.isLoading = false;
      window.scrollTo(0, 0);
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
  margin-top: 110px;
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
