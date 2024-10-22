<template>
  <div class="report">
    <h1 class="title">Thống kê Đặt tiệc</h1>

    <div class="statistics">
      <!-- Thống kê đơn tiệc -->
      <div class="stat-card">
        <div class="stat-header">
          <h3>Số đơn tiệc trong tháng:</h3>
          <span class="icon">📊</span>
        </div>
        <p class="stat-value">{{ totalOrders }}</p>
      </div>

      <!-- Thống kê doanh thu đơn tiệc -->
      <div class="stat-card">
        <div class="stat-header">
          <h3>Doanh thu từ đơn tiệc:</h3>
          <span class="icon">💰</span>
        </div>
        <p class="stat-value">{{ formatCurrency(totalOrderRevenue) }}</p>
      </div>

      <!-- Thống kê gói tiệc -->
      <div class="stat-card">
        <div class="stat-header">
          <h3>Số gói tiệc được chọn:</h3>
          <span class="icon">📦</span>
        </div>
        <p class="stat-value">{{ totalOrdersPackage }}</p>
      </div>

      <!-- Thống kê doanh thu gói tiệc -->
      <div class="stat-card">
        <div class="stat-header">
          <h3>Doanh thu từ gói tiệc:</h3>
          <span class="icon">💵</span>
        </div>
        <p class="stat-value">{{ formatCurrency(totalOrderPackageRevenue) }}</p>
      </div>

      <!-- Tổng số đơn -->
      <div class="stat-card highlight">
        <div class="stat-header">
          <h3>Tổng số đơn trong tháng:</h3>
          <span class="icon">📈</span>
        </div>
        <p class="stat-value">{{ totalAllOrders }}</p>
      </div>

      <!-- Tổng doanh thu -->
      <div class="stat-card highlight">
        <div class="stat-header">
          <h3>Tổng doanh thu:</h3>
          <span class="icon">💎</span>
        </div>
        <p class="stat-value highlight">
          {{ formatCurrency(totalAllOrderRevenue) }}
        </p>
      </div>

      <!-- Món ăn phổ biến -->
      <div class="stat-card wide">
        <h3>Các món ăn được chọn nhiều nhất:</h3>
        <ul class="popular-list">
          <li
            v-for="dish in popularDishes"
            :key="dish._id"
            class="popular-item"
          >
            <span class="item-name">{{ dish.name }}</span>
            <span class="item-count">{{ dish.orderCount }} lần</span>
          </li>
        </ul>
      </div>

      <!-- Gói tiệc phổ biến -->
      <!-- <div class="stat-card wide">
        <h3>Các gói tiệc được đặt nhiều nhất:</h3>
        <ul class="popular-list">
          <li
            v-for="package in popularPackages"
            :key="package.id"
            class="popular-item"
          >
            <span class="item-name">{{ package.name }}</span>
            <span class="item-count">{{ package.count }} lần</span>
          </li>
        </ul>
      </div> -->

      <!-- Biểu đồ tròn -->
      <div class="stat-card chart-container">
        <h3>Tỷ lệ đơn tiệc và gói tiệc:</h3>
        <div id="piechart"></div>
      </div>

      <!-- Biểu đồ cột -->
      <div class="stat-card chart-container">
        <h3>Doanh thu từ đơn tiệc và gói tiệc:</h3>
        <div id="barchart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      totalOrders: 0,
      totalOrderRevenue: 0,
      totalOrdersPackage: 0,
      totalOrderPackageRevenue: 0,
      totalAllOrders: 0,
      totalAllOrderRevenue: 0,
      popularDishes: [],
      popularPackages: [],
    };
  },
  mounted() {
    this.fetchStatistics();
    this.drawPieChart();
    this.drawBarChart();
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    async fetchStatistics() {
      try {
        const ordersResponse = await axios.get(
          "http://localhost:3000/order/getAllOrders"
        );
        const dishesResponse = await axios.get(
          "http://localhost:3000/statistical/popular?limit=5"
        );
        const packagesResponse = await axios.get(
          "http://localhost:3000/order/getAllPartyOrders"
        );

        this.totalOrders = ordersResponse.data.length;
        this.totalOrderRevenue = ordersResponse.data.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );
        this.popularDishes = dishesResponse.data;
        this.totalOrdersPackage = packagesResponse.data.length;
        this.totalOrderPackageRevenue = packagesResponse.data.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );
        this.totalAllOrders = this.totalOrders + this.totalOrdersPackage;
        this.totalAllOrderRevenue =
          this.totalOrderRevenue + this.totalOrderPackageRevenue;

        this.drawPieChart();
        this.drawBarChart();
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    },
    drawPieChart() {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        const data = google.visualization.arrayToDataTable([
          ["Loại", "Số lượng"],
          ["Đơn tiệc", this.totalOrders],
          ["Gói tiệc", this.totalOrdersPackage],
        ]);

        const options = {
          title: "Tỷ lệ đơn tiệc và gói tiệc",
          backgroundColor: "transparent",
          titleTextStyle: { color: "#fff" },
          legend: { textStyle: { color: "#fff" } },
          pieSliceTextStyle: { color: "#000" },
          colors: ["#3B82F6", "#EF4444"],
        };

        const chart = new google.visualization.PieChart(
          document.getElementById("piechart")
        );
        chart.draw(data, options);
      });
    },
    drawBarChart() {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        const data = google.visualization.arrayToDataTable([
          ["Loại", "Doanh thu (VND)"],
          ["Đơn tiệc", this.totalOrderRevenue],
          ["Gói tiệc", this.totalOrderPackageRevenue],
        ]);

        const options = {
          title: "Doanh thu từ đơn tiệc và gói tiệc",
          backgroundColor: "transparent",
          titleTextStyle: { color: "#fff" },
          legend: { textStyle: { color: "#fff" } },
          hAxis: {
            title: "Doanh thu (VND)",
            textStyle: { color: "#fff" },
            titleTextStyle: { color: "#fff" },
          },
          vAxis: {
            title: "Loại",
            textStyle: { color: "#fff" },
            titleTextStyle: { color: "#fff" },
          },
          colors: ["#3B82F6"],
        };

        const chart = new google.visualization.BarChart(
          document.getElementById("barchart")
        );
        chart.draw(data, options);
      });
    },
  },
};
</script>

<style scoped>
.report {
  font-family: "Inter", sans-serif;
  padding: 2rem;
  background-color: #101827;
  min-height: 100vh;
  color: #fff;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #fff;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.stat-card {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.icon {
  font-size: 1.5rem;
}

h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #94a3b8;
  margin: 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
  color: #fff;
}

.highlight {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1),
    rgba(147, 51, 234, 0.1)
  );
}

.stat-value.highlight {
  background: linear-gradient(90deg, #3b82f6, #9333ea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wide {
  grid-column: span 2;
}

.popular-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.popular-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.item-name {
  font-weight: 500;
}

.item-count {
  background-color: #3b82f6;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.chart-container {
  grid-column: span 2;
  height: 400px;
}

#piechart,
#barchart {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .wide,
  .chart-container {
    grid-column: span 1;
  }

  .statistics {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1rem;
  }
}
</style>
