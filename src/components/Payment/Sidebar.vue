<template>
  <div class="sidebar">
    <ul>
      <li
        :class="{ active: activeMenuItem === 'Profile' }"
        @click="navigateTo('Profile')"
      >
        Thông Tin Cá Nhân
      </li>
      <li
        :class="{ active: activeMenuItem === 'OrderList' }"
        @click="navigateTo('OrderList')"
      >
        Tiệc Của Bạn
      </li>
      <li
        :class="{ active: activeMenuItem === 'OrderListPackage' }"
        @click="navigateTo('OrderListPackage')"
      >
        Gói Của Bạn
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["activeMenuItem"],
  methods: {
    navigateTo(component) {
      this.$emit("navigate", component);
    },
  },
};
</script>

<style scoped>
.sidebar {
  flex: 1;
  border-left: 1px solid #ddd;
  padding-left: 20px;
  width: 300px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar ul li {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.sidebar ul li:hover {
  background-color: #f0f0f0;
}
.sidebar li.active {
  background-color: #d4a762;
  color: white;
  font-weight: bold;
}
</style>
