<template>
  <div id="app">
    <Navbar />
    <OrderFailed />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import OrderFailed from "@/components/Payment/OrderFailed.vue";
export default {
  components: {
    Navbar,
    OrderFailed,
    Footer,
  },
};
</script>
