<template>
  <div class="checkout-container">
    <h2 class="title">Xác nhận đơn tiệc</h2>

    <div v-if="isLoading" class="loading">
      <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else class="checkout-content">
      <!-- Danh sách món ăn -->
      <section class="order-section">
        <h3 class="section-title">Các món được chọn</h3>
        <div class="order-items">
          <div
            v-for="(item, index) in cart.items"
            :key="index"
            class="order-card"
          >
            <img
              :src="item.dishImage"
              :alt="item.dishName"
              class="order-image"
            />
            <div class="order-details">
              <h4 class="dish-name">{{ item.dishName }}</h4>
              <p class="dish-category">{{ item.dishCategory }}</p>
              <div class="price-details">
                <p class="price-item">
                  <span class="label">Đơn giá:</span>
                  <span class="value">{{ item.dishPrice }}đ</span>
                </p>
                <p class="price-item">
                  <span class="label">Số lượng:</span>
                  <span class="value">{{ item.quantity }}</span>
                </p>
                <p class="price-item total">
                  <span class="label">Thành tiền:</span>
                  <span class="value">{{ item.totalPriceForItem }}đ</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Thông tin tiệc -->
      <section class="party-info-section">
        <h3 class="section-title">Thông tin tiệc</h3>

        <div class="form-group">
          <label for="number-of-tables">Số bàn muốn đặt</label>
          <input
            type="number"
            id="number-of-tables"
            v-model.number="numberOfTables"
            min="1"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="party-type">Loại tiệc</label>
          <input
            type="text"
            id="party-type"
            v-model="selectedPartyType"
            placeholder="VD: Sinh nhật, Tiệc cưới..."
            class="form-input"
          />
        </div>

        <!-- Địa chỉ tổ chức tiệc -->
        <div class="address-section">
          <h4 class="subsection-title">Địa chỉ tổ chức tiệc</h4>
          <div class="address-grid">
            <div class="form-group">
              <label for="city">Tỉnh/Thành phố</label>
              <select
                v-model="selectedCity"
                @change="onCityChange"
                id="city"
                class="form-select"
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                <option v-for="city in cities" :key="city.Id" :value="city.Id">
                  {{ city.Name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="district">Quận/Huyện</label>
              <select
                v-model="selectedDistrict"
                @change="onDistrictChange"
                id="district"
                class="form-select"
              >
                <option value="">Chọn Quận/Huyện</option>
                <option
                  v-for="district in districts"
                  :key="district.Id"
                  :value="district.Id"
                >
                  {{ district.Name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="ward">Phường/Xã</label>
              <select v-model="selectedWard" id="ward" class="form-select">
                <option value="">Chọn Phường/Xã</option>
                <option v-for="ward in wards" :key="ward.Id" :value="ward.Id">
                  {{ ward.Name }}
                </option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="specific-address">Địa chỉ cụ thể</label>
              <input
                type="text"
                id="specific-address"
                v-model="specificAddress"
                placeholder="Số nhà, tên đường..."
                class="form-input"
              />
            </div>
          </div>
        </div>

        <!-- Thời gian -->
        <div class="datetime-section">
          <div class="form-group">
            <label for="party-date">Ngày tổ chức</label>
            <input
              type="date"
              id="party-date"
              v-model="partyDate"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="party-time">Giờ tổ chức</label>
            <input
              type="time"
              id="party-time"
              v-model="partyTime"
              class="form-input"
              required
            />
          </div>
        </div>

        <!-- Thông tin liên hệ và thanh toán -->
        <div class="contact-payment-section">
          <div class="form-group">
            <label for="phone-number">Số điện thoại liên hệ</label>
            <input
              type="tel"
              id="phone-number"
              v-model="phoneNumber"
              placeholder="Nhập số điện thoại"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="payment-method">Phương thức thanh toán</label>
            <select
              v-model="selectedPaymentMethod"
              id="payment-method"
              class="form-select"
            >
              <option value="cash">Thanh toán sau tiệc</option>
              <option value="credit-card">VN-Pay</option>
              <option value="momo">Ví Momo</option>
            </select>
          </div>

          <div v-if="selectedPaymentMethod !== 'cash'" class="payment-options">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="payFull"
                @change="handlePayFullChange"
              />
              <span>Trả hết</span>
            </label>
          </div>

          <div v-if="showDepositInput" class="form-group">
            <label for="deposit-amount">Số tiền đặt cọc</label>
            <input
              type="number"
              id="deposit-amount"
              v-model.number="depositAmount"
              :placeholder="`Tối thiểu ${calculatedDeposit}đ`"
              @input="handleDepositInput"
              class="form-input no-arrows"
            />
          </div>
        </div>

        <!-- Ghi chú -->
        <div class="form-group">
          <label for="note">Ghi chú</label>
          <textarea
            id="note"
            v-model="note"
            placeholder="Nhập thêm yêu cầu nếu có"
            class="form-textarea"
          ></textarea>
        </div>
      </section>

      <!-- Tổng kết -->
      <section class="summary-section">
        <div class="summary-details">
          <p class="summary-item">
            <span class="label">Tổng số món:</span>
            <span class="value">{{ totalQuantity }}</span>
          </p>
          <p class="summary-item">
            <span class="label">Tổng tiền ({{ numberOfTables }} bàn):</span>
            <span class="value highlight">{{ totalPriceForTables }}đ</span>
          </p>
          <p class="summary-item">
            <span class="label">Đặt cọc:</span>
            <span class="value">{{ depositAmount || calculatedDeposit }}đ</span>
          </p>
        </div>

        <button
          @click="confirmOrder"
          class="confirm-button"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Đang xử lý..." : "Xác nhận đặt tiệc" }}
        </button>
      </section>
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
      numberOfTables: 1,
      selectedPartyType: "",
      selectedPaymentMethod: "cash",
      // partyAddress: "",
      cities: [],
      districts: [],
      wards: [],
      selectedCity: "",
      selectedDistrict: "",
      selectedWard: "",
      specificAddress: "",
      phoneNumber: this.phoneNumberComputed,
      note: "",
      partyDate: "",
      partyTime: "",
      isSubmitting: false,
      depositAmount: 0,
      payFull: false,
    };
  },
  watch: {
    selectedCity(newCityId) {
      this.resetDistrictAndWard();
      if (newCityId) {
        this.loadDistricts(newCityId);
      }
    },
    selectedDistrict(newDistrictId) {
      this.wards = [];
      if (newDistrictId) {
        this.loadWards(newDistrictId);
      }
    },
  },
  computed: {
    ...mapState(["cart", "userInfo"]),
    phoneNumberComputed() {
      return this.userInfo && this.userInfo.PHONE ? this.userInfo.PHONE : "";
    },
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
    partyAddress() {
      const cityName =
        this.cities.find((c) => c.Id === this.selectedCity)?.Name || "";
      const districtName =
        this.districts.find((d) => d.Id === this.selectedDistrict)?.Name || "";
      const wardName =
        this.wards.find((w) => w.Id === this.selectedWard)?.Name || "";
      return `${this.specificAddress}, ${wardName}, ${districtName}, ${cityName}`;
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
        console.log("partyAddress:", this.partyAddress);
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
    async loadCities() {
      try {
        const response = await axios.get("/data.json");
        this.cities = response.data;
      } catch (error) {
        console.error("Lỗi khi tải danh sách tỉnh/thành phố:", error);
      }
    },
    loadDistricts(cityId) {
      const city = this.cities.find((c) => c.Id === cityId);
      if (city) {
        this.districts = city.Districts;
      }
    },
    loadWards(districtId) {
      const district = this.districts.find((d) => d.Id === districtId);
      if (district) {
        this.wards = district.Wards;
      }
    },
    resetDistrictAndWard() {
      this.districts = [];
      this.wards = [];
      this.selectedDistrict = "";
      this.selectedWard = "";
    },
  },

  async mounted() {
    try {
      await this.fetchCart();
      this.phoneNumber =
        this.userInfo && this.userInfo.PHONE ? this.userInfo.PHONE : "";
      this.loadCities();
    } finally {
      this.isLoading = false;
      window.scrollTo(0, 0);
    }
  },
};
</script>

<style scoped>
.checkout-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 30px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 32px;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
}

.checkout-content {
  display: grid;
  gap: 40px;
}

/* Section Styling */
.section-title {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
}

.subsection-title {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 15px;
}

/* Order Items Styling */
.order-items {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
}

.order-card {
  display: flex;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.order-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.order-details {
  padding: 15px;
  flex: 1;
}

.dish-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

.dish-category {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 10px;
}

.price-details {
  display: grid;
  gap: 5px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.price-item.total {
  font-weight: 600;
  color: #2c3e50;
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px dashed #dee2e6;
}

/* Form Styling */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  margin-bottom: 8px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #4dabf7;
  box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.1);
  outline: none;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

/* Address Section */
.address-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.full-width {
  grid-column: 1 / -1;
}

/* DateTime Section */
.datetime-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

/* Payment Section */
.payment-options {
  margin: 15px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

/* Summary Section */
.summary-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-top: 30px;
}

.summary-details {
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
}

.summary-item .highlight {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
}

.confirm-button {
  width: 100%;
  padding: 16px;
  background: #37b24d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.confirm-button:hover:not(:disabled) {
  background: #2f9e44;
}

.confirm-button:disabled {
  background: #adb5bd;
  cursor: not-allowed;
}

/* Utilities */
.no-arrows::-webkit-inner-spin-button,
.no-arrows::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.no-arrows {
  -moz-appearance: textfield;
}

/* Loading State */
.loading {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 18px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .checkout-container {
    margin: 20px;
    padding: 20px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 30px;
  }

  .order-card {
    flex-direction: column;
  }

  .order-image {
    width: 100%;
    height: 200px;
  }

  .address-grid {
    grid-template-columns: 1fr;
  }

  .datetime-section {
    grid-template-columns: 1fr;
  }

  .summary-item {
    font-size: 14px;
  }

  .summary-item .highlight {
    font-size: 18px;
  }
}

/* Enhanced Visual Feedback */
.form-input:hover,
.form-select:hover,
.form-textarea:hover {
  border-color: #ced4da;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #adb5bd;
}

/* Error States */
.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: #fa5252;
}

.error-message {
  color: #fa5252;
  font-size: 14px;
  margin-top: 5px;
}

/* Success States */
.form-input.success,
.form-select.success,
.form-textarea.success {
  border-color: #40c057;
}

/* Print Styles */
@media print {
  .checkout-container {
    box-shadow: none;
    margin: 0;
    padding: 20px;
  }

  .confirm-button {
    display: none;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.checkout-content {
  animation: fadeIn 0.3s ease-out;
}

/* Additional Helper Classes */
.text-muted {
  color: #6c757d;
}

.font-weight-bold {
  font-weight: 600;
}

.text-success {
  color: #40c057;
}

.text-danger {
  color: #fa5252;
}

.mb-0 {
  margin-bottom: 0;
}

.mt-2 {
  margin-top: 0.5rem;
}
</style>
