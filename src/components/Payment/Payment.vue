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
        <input
          type="text"
          id="party-type"
          v-model="selectedPartyType"
          placeholder="Nhập loại tiệc (VD: Sinh nhật, Tiệc cưới...)"
        />
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

        <div v-if="showDepositInput" class="deposit-section">
          <label for="deposit-amount">Số tiền đặt cọc:</label>
          <input
            type="number"
            id="deposit-amount"
            v-model.number="depositAmount"
            :placeholder="`Số tiền đặt cọc tối thiểu là ${calculatedDeposit} đ`"
            @input="handleDepositInput"
            class="no-arrows"
          />
        </div>

        <div class="payment-method">
          <label>Phương thức thanh toán:</label>
          <select v-model="selectedPaymentMethod">
            <option value="cash">Thanh toán sau tiệc</option>
            <option value="credit-card">VN-Pay</option>
            <option value="momo">Ví Momo</option>
          </select>
        </div>

        <div
          v-if="
            selectedPaymentMethod === 'credit-card' ||
            selectedPaymentMethod === 'momo'
          "
        >
          <label>
            <input
              type="checkbox"
              v-model="payFull"
              @change="handlePayFullChange"
            />
            Trả hết
          </label>
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
        <p>
          Số tiền đặt cọc:
          <strong>{{ depositAmount || calculatedDeposit }} đ</strong>
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
      selectedPartyType: "", // Loại tiệc mặc định
      selectedPaymentMethod: "cash", // Phương thức thanh toán mặc định
      partyAddress: "", // Địa chỉ tổ chức tiệc
      phoneNumber: "", // Số điện thoại liên hệ
      note: "", // Ghi chú từ khách hàng
      partyDate: "",
      partyTime: "",
      isSubmitting: false,
      depositAmount: 0,
      payFull: false,
    };
  },
  computed: {
    ...mapState(["cart"]), // Lấy dữ liệu giỏ hàng từ Vuex Store
    computedDepositAmount: {
      get() {
        return this.depositAmount === 0 ? "" : this.depositAmount;
      },
      set(value) {
        // Chỉ cập nhật nếu giá trị là số hợp lệ hoặc chuỗi trống
        if (value === "") {
          this.depositAmount = 0; // Nếu giá trị nhập là chuỗi trống, đặt về 0
        } else if (!isNaN(value)) {
          this.depositAmount = Number(value); // Chuyển đổi giá trị nhập thành số
        }
      },
    },
    showDepositInput() {
      return (
        this.selectedPaymentMethod === "cash" ||
        ((this.selectedPaymentMethod === "credit-card" ||
          this.selectedPaymentMethod === "momo") &&
          !this.payFull)
      );
    },
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

    handlePayFullChange() {
      if (this.payFull) {
        this.depositAmount = this.totalPriceForTables;
      } else {
        this.depositAmount = this.calculatedDeposit;
      }
    },
    handleDepositInput() {
      if (this.depositAmount === "") {
        this.depositAmount = 0;
      }
      // Đảm bảo số tiền đặt cọc không vượt quá tổng số tiền
      if (this.depositAmount > this.totalPriceForTables) {
        this.depositAmount = this.totalPriceForTables;
      }
    },
    async confirmOrder() {
      this.isSubmitting = true;

      try {
        // Kiểm tra ngày và giờ tiệc
        if (!this.partyDate || !this.partyTime) {
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: "Ngày và giờ tiệc không được để trống.",
          });
          this.isSubmitting = false;
          return;
        }

        // Dữ liệu đặt hàng
        const orderDetails = {
          tables: this.numberOfTables,
          partyType: this.selectedPartyType,
          paymentMethod: this.selectedPaymentMethod,
          totalPrice: Math.floor(this.totalPriceForTables), // Chuyển đổi thành số nguyên
          depositAmount: Math.floor(this.depositAmount),
          payFull: this.payFull,
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

        // Lưu đơn hàng
        const response = await axios.post(
          "http://localhost:3000/order/orders",
          orderDetails
        );

        // Kiểm tra xem đơn hàng có thực sự được tạo thành công hay không
        if (!response.data || !response.data.order) {
          throw new Error("Đơn hàng không được tạo thành công.");
        }

        const orderId = response.data.order._id;

        // Nếu người dùng chọn "Thanh Toán Sau Tiệc" nhưng có yêu cầu đặt cọc
        if (
          this.selectedPaymentMethod === "cash" &&
          this.calculatedDeposit > 0
        ) {
          // Hiển thị yêu cầu thanh toán đặt cọc
          Swal.fire({
            title: "Bạn cần đặt cọc bằng hình thức thanh toán online",
            text: "Vui lòng chọn phương thức thanh toán để tiếp tục.",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "VNPay",
            cancelButtonText: "Ví Momo",
          }).then(async (result) => {
            if (result.isConfirmed) {
              // Thanh toán qua VNPay với số tiền đặt cọc
              const paymentData = {
                amount: this.depositAmount, // Số tiền đặt cọc
                orderId: orderId, // Truyền orderId vào dữ liệu thanh toán
                bankCode: "", // Có thể để trống nếu không chọn ngân hàng cụ thể
                language: "vn", // hoặc 'en' tùy theo ngôn ngữ bạn muốn sử dụng
              };

              try {
                const vnpayResponse = await axios.post(
                  "http://localhost:3000/order/create_payment_url",
                  paymentData
                );

                // Chuyển hướng đến URL thanh toán của VNPay
                if (vnpayResponse.data && vnpayResponse.data.paymentUrl) {
                  window.location.href = vnpayResponse.data.paymentUrl;
                } else {
                  throw new Error("Không thể tạo URL thanh toán.");
                }
              } catch (error) {
                console.error("Lỗi khi tạo URL thanh toán VNPay:", error);
                Swal.fire({
                  icon: "error",
                  title: "Lỗi tạo URL thanh toán",
                  text:
                    error.message ||
                    "Không thể tạo URL thanh toán. Vui lòng thử lại sau.",
                });
              }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire({
                icon: "warning",
                title: "Chức năng thanh toán Ví Momo chưa được hỗ trợ.",
                text: "Vui lòng chọn phương thức khác hoặc thử lại sau.",
              });
            }
          });

          // Dừng lại để không hiển thị thông báo "Đặt hàng thành công"
          return;
        }
        if (
          this.selectedPaymentMethod === "credit-card" &&
          this.calculatedDeposit > 0
        ) {
          const paymentData = {
            amount: this.depositAmount, // Đảm bảo đây là số nguyên
            orderId: orderId, // Truyền orderId vào dữ liệu thanh toán
            bankCode: "", // Có thể để trống nếu không chọn ngân hàng cụ thể
            language: "vn", // hoặc 'en' tùy theo ngôn ngữ bạn muốn sử dụng
          };

          try {
            const vnpayResponse = await axios.post(
              "http://localhost:3000/order/create_payment_url",
              paymentData
            );

            // Chuyển hướng đến URL thanh toán của VNPay
            if (vnpayResponse.data && vnpayResponse.data.paymentUrl) {
              window.location.href = vnpayResponse.data.paymentUrl;
            } else {
              throw new Error("Không thể tạo URL thanh toán.");
            }
          } catch (error) {
            console.error("Lỗi khi tạo URL thanh toán VNPay:", error);
            Swal.fire({
              icon: "error",
              title: "Lỗi tạo URL thanh toán",
              text:
                error.message ||
                "Không thể tạo URL thanh toán. Vui lòng thử lại sau.",
            });
          }

          // Dừng lại để không hiển thị thông báo "Đặt hàng thành công"
          return;
        }

        // Nếu phương thức thanh toán là VNPay (credit-card), tạo URL thanh toán sau khi lưu đơn
        if (this.selectedPaymentMethod === "credit-card") {
          const paymentData = {
            amount: this.totalPriceForTables, // Đảm bảo đây là số nguyên
            orderId: orderId, // Truyền orderId vào dữ liệu thanh toán
            bankCode: "", // Có thể để trống nếu không chọn ngân hàng cụ thể
            language: "vn", // hoặc 'en' tùy theo ngôn ngữ bạn muốn sử dụng
          };

          try {
            const vnpayResponse = await axios.post(
              "http://localhost:3000/order/create_payment_url",
              paymentData
            );

            // Chuyển hướng đến URL thanh toán của VNPay
            if (vnpayResponse.data && vnpayResponse.data.paymentUrl) {
              window.location.href = vnpayResponse.data.paymentUrl;
            } else {
              throw new Error("Không thể tạo URL thanh toán.");
            }
          } catch (error) {
            console.error("Lỗi khi tạo URL thanh toán VNPay:", error);
            Swal.fire({
              icon: "error",
              title: "Lỗi tạo URL thanh toán",
              text:
                error.message ||
                "Không thể tạo URL thanh toán. Vui lòng thử lại sau.",
            });
          }

          // Dừng lại để không hiển thị thông báo "Đặt hàng thành công"
          return;
        }

        // Nếu không có yêu cầu đặt cọc, hiển thị thông báo đặt hàng thành công
        await this.fetchCart(); // Làm trống giỏ hàng

        Swal.fire({
          icon: "success",
          title: "Đặt Tiệc thành công!",
          text: "Cảm ơn bạn đã đặt tiệc.",
          showConfirmButton: false,
          timer: 3000,
        });

        setTimeout(() => {
          this.$router.push({ name: "OrderSuccess" });
        }, 1000);
      } catch (error) {
        console.error("Lỗi khi xác nhận đặt bàn:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: error.response?.data?.message || "Đã có lỗi xảy ra.",
        });
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
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.title {
  margin-top: 120px;
  font-size: 30px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
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
  margin-top: 25px;
}
.form-group {
  margin-top: 10px;
}
.form-group label {
  font-size: 16px;
  font-weight: bold;
  color: #34495e;
  display: block;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
select:focus {
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
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

.checkout-summary p {
  font-size: 16px;
  color: #2c3e50;
  font-weight: bold;
}

.confirm-button {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 15px 25px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #2ecc71;
}
.party-datetime-selection,
.party-time-selection {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.party-datetime-selection label,
.party-time-selection label {
  font-size: 16px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 8px;
}

.party-datetime-selection input,
.party-time-selection input {
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="%23999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>')
    no-repeat right 15px center;
  background-color: #f9f9f9;
}

.party-time-selection input {
  background: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="%23999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>')
    no-repeat right 15px center;
}

.party-datetime-selection input:focus,
.party-time-selection input:focus {
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
  outline: none;
}
.deposit-section {
  margin-top: 20px;
}

.deposit-section label {
  font-size: 16px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 8px;
  display: block;
}

.deposit-section input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: #f9f9f9;
}

.deposit-section input::placeholder {
  font-style: italic;
  color: #999;
}

.deposit-section input:focus {
  border-color: #e67e22;
  box-shadow: 0 0 5px rgba(230, 126, 34, 0.5);
  outline: none;
}
.no-arrows::-webkit-outer-spin-button,
.no-arrows::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.party-type-selection input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.party-type-selection input:focus {
  border-color: #28a745;
  box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
  outline: none;
}
</style>
