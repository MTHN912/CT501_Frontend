<template>
  <div id="app">
    <Navbar />
    <OrderList />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import OrderList from "@/components/Payment/OrderList.vue";
export default {
  components: {
    Navbar,
    OrderList,
    Footer,
  },
};
</script>
