<template>
  <div class="checkout-container">
    <h2 class="title">Xác nhận đơn tiệc với gói</h2>

    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else class="checkout-content">
      <!-- Package Summary Card -->
      <div class="summary-card">
        <div class="package-info">
          <img
            :src="selectedPackage.image"
            :alt="selectedPackage.name"
            class="package-image"
          />
          <div class="package-details">
            <h3>{{ selectedPackage.name }}</h3>
            <p class="description">{{ selectedPackage.description }}</p>
            <div class="price-info">
              <p class="original-price">
                Giá gốc: {{ selectedPackage.price }} đ
              </p>
              <p v-if="selectedPackage.promotion" class="promotion-price">
                Giá khuyến mãi: {{ calculatedPrice }} đ
              </p>
            </div>
          </div>
        </div>

        <div class="basic-details">
          <div class="form-group">
            <label for="number-of-tables">Số bàn:</label>
            <input
              type="number"
              id="number-of-tables"
              v-model.number="numberOfTables"
              disabled
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="party-type">Loại tiệc:</label>
            <input
              type="text"
              id="party-type"
              v-model="selectedPackage.category"
              readonly
              class="form-control"
            />
          </div>
        </div>
      </div>

      <!-- Party Details Form -->
      <form class="party-details-form" @submit.prevent="confirmOrder">
        <!-- Address Section -->
        <div class="form-section">
          <h4 class="section-title">Địa Chỉ Tổ Chức Tiệc</h4>
          <div class="address-grid">
            <div class="form-group">
              <label for="city">Tỉnh/Thành phố:</label>
              <select
                v-model="selectedCity"
                @change="onCityChange"
                class="form-control"
                id="city"
                required
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                <option v-for="city in cities" :key="city.Id" :value="city.Id">
                  {{ city.Name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="district">Quận/Huyện:</label>
              <select
                v-model="selectedDistrict"
                @change="onDistrictChange"
                class="form-control"
                id="district"
                required
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
              <label for="ward">Phường/Xã:</label>
              <select
                v-model="selectedWard"
                class="form-control"
                id="ward"
                required
              >
                <option value="">Chọn Phường/Xã</option>
                <option v-for="ward in wards" :key="ward.Id" :value="ward.Id">
                  {{ ward.Name }}
                </option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="specific-address">Địa chỉ cụ thể:</label>
              <input
                type="text"
                id="specific-address"
                v-model="specificAddress"
                class="form-control"
                placeholder="Số nhà, tên đường..."
                required
              />
            </div>
          </div>
        </div>

        <!-- Date and Time Section -->
        <div class="form-section">
          <h4 class="section-title">Thời Gian Tổ Chức</h4>
          <div class="datetime-grid">
            <div class="form-group">
              <label for="party-date">Ngày diễn ra:</label>
              <input
                type="date"
                id="party-date"
                v-model="partyDate"
                class="form-control"
                required
              />
            </div>

            <div class="form-group">
              <label for="party-time">Giờ bắt đầu:</label>
              <input
                type="time"
                id="party-time"
                v-model="partyTime"
                class="form-control"
                required
              />
            </div>
          </div>
        </div>

        <!-- Contact and Payment Section -->
        <div class="form-section">
          <h4 class="section-title">Thông Tin Thanh Toán</h4>
          <div class="payment-grid">
            <div class="form-group">
              <label for="phone-number">Số điện thoại liên hệ:</label>
              <input
                type="tel"
                id="phone-number"
                v-model="phoneNumber"
                class="form-control"
                placeholder="0xxxxxxxxx"
                required
                pattern="[0-9]{10}"
              />
            </div>

            <div class="form-group">
              <label for="payment-method">Phương thức thanh toán:</label>
              <select
                v-model="selectedPaymentMethod"
                class="form-control"
                id="payment-method"
                required
              >
                <option value="cash">Thanh toán sau tiệc</option>
                <option value="credit-card">VN-Pay</option>
                <option value="momo">Ví Momo</option>
              </select>
            </div>

            <div v-if="showDepositInput" class="form-group">
              <label for="deposit-amount">Số tiền đặt cọc:</label>
              <input
                type="number"
                id="deposit-amount"
                v-model.number="depositAmount"
                class="form-control"
                :placeholder="`Tối thiểu ${calculatedDeposit} đ`"
                @input="handleDepositInput"
              />
            </div>

            <div
              v-if="selectedPaymentMethod !== 'cash'"
              class="form-group checkbox-group"
            >
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="payFull"
                  @change="handlePayFullChange"
                />
                <span>Thanh toán toàn bộ</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Note Section -->
        <div class="form-section">
          <h4 class="section-title">Ghi Chú</h4>
          <div class="form-group">
            <textarea
              v-model="note"
              class="form-control"
              rows="4"
              placeholder="Nhập thêm yêu cầu đặc biệt nếu có..."
            ></textarea>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <div class="summary-row">
            <span>Tổng tiền:</span>
            <strong>{{ totalPriceForTables }} đ</strong>
          </div>
          <div class="summary-row">
            <span>Số tiền đặt cọc:</span>
            <strong>{{ depositAmount || calculatedDeposit }} đ</strong>
          </div>
          <button type="submit" class="confirm-button" :disabled="isSubmitting">
            {{ isSubmitting ? "Đang xử lý..." : "Xác nhận đặt tiệc" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { mapState } from "vuex";
export default {
  data() {
    return {
      selectedPackage: null,
      numberOfTables: 1, // Khởi tạo số bàn
      // partyAddress: "",
      cities: [],
      districts: [],
      wards: [],
      selectedCity: "",
      selectedDistrict: "",
      selectedWard: "",
      specificAddress: "",
      partyDate: "",
      partyTime: "",
      phoneNumber: this.phoneNumberComputed,
      note: "",
      depositAmount: 0,
      selectedPaymentMethod: "cash",
      payFull: false,
      isSubmitting: false,
      isLoading: true,
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
    totalPriceForTables() {
      return this.calculatedPrice;
    },
    calculatedPrice() {
      return this.selectedPackage.promotion
        ? this.selectedPackage.price *
            (1 - this.selectedPackage.promotion / 100)
        : this.selectedPackage.price;
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
    async getPackageDetails() {
      try {
        const packageId = this.$route.params.id; // Giả sử bạn truyền id qua URL
        const response = await axios.get(
          `http://localhost:3000/package/getPackageById/${packageId}`
        );

        // Truy cập vào thuộc tính `data` trong response để lấy thông tin gói tiệc
        this.selectedPackage = response.data.data; // Lưu ý phải là `response.data.data`
        this.numberOfTables = this.selectedPackage.tables; // Lấy số bàn từ API
      } catch (error) {
        console.error("Lỗi khi lấy thông tin gói tiệc:", error);
      } finally {
        this.isLoading = false; // Kết thúc trạng thái loading
      }
    },
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
      try {
        this.isSubmitting = true;
        const orderData = {
          packageId: this.selectedPackage._id,
          tables: this.numberOfTables,
          partyType: this.selectedPackage.category, // Loại tiệc không thay đổi
          paymentMethod: this.selectedPaymentMethod,
          totalPrice: this.totalPriceForTables,
          depositAmount: Math.floor(this.depositAmount),
          partyAddress: this.partyAddress || null,
          phoneNumber: this.phoneNumber || null,
          note: this.note,
          partyDateTime: `${this.partyDate}T${this.partyTime}`,
        };

        // Gọi API tạo đơn tiệc
        const response = await axios.post(
          "http://localhost:3000/order/ordersPackage",
          orderData
        );

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
                  "http://localhost:3000/order/orderPaymentPackage",
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
              "http://localhost:3000/order/orderPaymentPackage",
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
              "http://localhost:3000/order/orderPaymentPackage",
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
  mounted() {
    this.getPackageDetails(); // Gọi API khi component được tạo
    this.loadCities();
    this.phoneNumber =
      this.userInfo && this.userInfo.PHONE ? this.userInfo.PHONE : "";
  },
};
</script>

<style scoped>
.checkout-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a365d;
  text-align: center;
  margin-bottom: 2rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.checkout-content {
  display: grid;
  gap: 2rem;
}

/* Package Summary Card */
.summary-card {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.package-info {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.package-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.package-details h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.description {
  color: #4a5568;
  margin-bottom: 1rem;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.original-price {
  color: #718096;
  text-decoration: line-through;
}

.promotion-price {
  color: #2f855a;
  font-weight: 600;
  font-size: 1.25rem;
}

/* Form Sections */
.form-section {
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

/* Grid Layouts */
.address-grid,
.datetime-grid,
.payment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.full-width {
  grid-column: 1 / -1;
}

/* Form Controls */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-control:focus {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  outline: none;
}

.form-control::placeholder {
  color: #a0aec0;
}

/* Checkbox Styling */
.checkbox-group {
  margin-top: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

/* Order Summary */
.order-summary {
  background-color: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-top: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.summary-row:last-child {
  border-bottom: none;
}

/* Button Styling */
.confirm-button {
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  background-color: #2f855a;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-button:hover:not(:disabled) {
  background-color: #276749;
}

.confirm-button:disabled {
  background-color: #9ae6b4;
  cursor: not-allowed;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .checkout-container {
    padding: 1rem;
    margin: 1rem;
  }

  .package-info {
    grid-template-columns: 1fr;
  }

  .package-image {
    width: 100%;
    height: auto;
  }
}
</style>
