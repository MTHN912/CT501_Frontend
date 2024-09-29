<template>
  <div id="app">
    <Navbar />
    <OrderSuccess />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import OrderSuccess from "@/components/Payment/OrderSuccess.vue";
export default {
  components: {
    Navbar,
    OrderSuccess,
    Footer,
  },
};
</script>
