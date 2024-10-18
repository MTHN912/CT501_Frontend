<template>
  <div id="app">
    <Navbar />
    <PaymentOrder />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import PaymentOrder from "@/components/Payment/PaymentPackage.vue";
export default {
  components: {
    Navbar,
    PaymentOrder,
    Footer,
  },
};
</script>
