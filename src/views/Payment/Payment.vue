<template>
  <div id="app">
    <Navbar />
    <Payment />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import Payment from "@/components/Payment/Payment.vue";
export default {
  components: {
    Navbar,
    Payment,
    Footer,
  },
};
</script>
