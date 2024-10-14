<template>
  <div class="container mt-4">
    <!-- Thanh trạng thái -->
    <div class="row progress-bar2">
      <div class="col step" :class="{ active: currentStatus >= 1 }">
        <div class="icon"><i class="fas fa-receipt"></i></div>
        <p>Chưa Xác Nhận</p>
        <small>{{
          order.partyStatusTimes[0]?.updatedAt
            ? formatDate(order.partyStatusTimes[0].updatedAt)
            : "Chưa cập nhật"
        }}</small>
      </div>
      <div class="col step" :class="{ active: currentStatus >= 2 }">
        <div class="icon"><i class="fas fa-clock"></i></div>
        <p>Chưa Diễn Ra</p>
        <small>{{
          order.partyStatusTimes[1]?.updatedAt
            ? formatDate(order.partyStatusTimes[1].updatedAt)
            : "Chưa cập nhật"
        }}</small>
      </div>
      <div class="col step" :class="{ active: currentStatus >= 3 }">
        <div class="icon"><i class="fas fa-tools"></i></div>
        <p>Chuẩn Bị</p>
        <small>{{
          order.partyStatusTimes[2]?.updatedAt
            ? formatDate(order.partyStatusTimes[2].updatedAt)
            : "Chưa cập nhật"
        }}</small>
      </div>
      <div class="col step" :class="{ active: currentStatus >= 4 }">
        <div class="icon"><i class="fas fa-hourglass-half"></i></div>
        <p>Đang Diễn Ra</p>
        <small>{{
          order.partyStatusTimes[3]?.updatedAt
            ? formatDate(order.partyStatusTimes[3].updatedAt)
            : "Chưa cập nhật"
        }}</small>
      </div>
      <div class="col step" :class="{ active: currentStatus >= 5 }">
        <div class="icon"><i class="fas fa-check-circle"></i></div>
        <p>Đã Kết Thúc</p>
        <small>{{
          order.partyStatusTimes[4]?.updatedAt
            ? formatDate(order.partyStatusTimes[4].updatedAt)
            : "Chưa cập nhật"
        }}</small>
      </div>
    </div>

    <!-- Chi tiết đơn tiệc -->
    <div class="order-details card p-3 mt-4">
      <h3>Chi tiết đơn tiệc #{{ order._id }}</h3>
      <p><strong>Loại Tiệc:</strong> {{ order.partyType }}</p>
      <p>
        <strong>Thời Gian Bắt Đầu:</strong> {{ formatDate(order.eventDate) }}
      </p>
      <p><strong>Địa Chỉ:</strong> {{ order.partyAddress }}</p>
      <p><strong>Trạng Thái:</strong> {{ order.partyStatus }}</p>
      <p><strong>Trạng Thái Thanh Toán:</strong> {{ order.status }}</p>
      <p><strong>Số Bàn:</strong> {{ order.tables }}</p>
      <p>
        <strong>Tổng Tiền:</strong> {{ order.totalPrice.toLocaleString() }} VND
      </p>
      <p>
        <strong>Đã Trả:</strong>
        {{ order.paidDepositAmount.toLocaleString() }} VND
      </p>
      <p><strong>Ghi Chú:</strong> {{ order.note }}</p>

      <!-- Danh sách món ăn -->
      <h4>Các món đã đặt</h4>
      <ul class="list-group">
        <li
          v-for="(item, index) in order.items"
          :key="index"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <span><strong>Món:</strong> {{ item.name }}</span>
          <span><strong>Giá:</strong> {{ item.price.toLocaleString() }} đ</span>
          <span><strong>Số lượng:</strong> {{ item.quantity }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderDetail",
  props: {
    order: Object,
  },
  computed: {
    currentStatus() {
      switch (this.order.partyStatus) {
        case "Chưa Xác Nhận":
          return 1;
        case "Chưa Diễn Ra":
          return 2;
        case "Chuẩn Bị":
          return 3;
        case "Đang Diễn Ra":
          return 4;
        case "Đã Kết Thúc":
          return 5;
        default:
          return 0;
      }
    },
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleString("vi-VN");
    },
  },
};
</script>

<style scoped>
.progress-bar2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.step {
  text-align: center;
  width: 20%;
  position: relative;
  padding: 10px;
}

.step .icon {
  background-color: #fff;
  border: 3px solid #e0e0e0;
  border-radius: 50%;
  height: 60px;
  width: 60px;
  line-height: 60px;
  margin: 0 auto 10px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e0e0e0;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.step.active .icon {
  background-color: #fff;
  color: #4caf50;
  border: 3px solid #4caf50;
}

.step p {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.step small {
  font-size: 14px;
  color: #9e9e9e;
}

.step.active p {
  color: #4caf50;
}

.step::after {
  content: "";
  position: absolute;
  top: 40px;
  left: 10%;
  width: calc(100% + 10px);
  height: 3px;
  background-color: #e0e0e0;
  z-index: -1;
  transform: translateX(-50%);
}

.step.active::after {
  background-color: #4caf50;
}

.step:first-child::after {
  display: none;
}

.order-details {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}

.order-details h3 {
  margin-bottom: 20px;
}

.order-details p {
  margin: 5px 0;
}

.order-details ul {
  list-style-type: none;
  padding-left: 0;
}

.order-details ul li {
  margin-bottom: 10px;
}

.order-details ul li strong {
  color: #333;
}
</style>
