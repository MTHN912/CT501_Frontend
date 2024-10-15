<template>
  <div id="app">
    <Navbar />
    <OrderDetail :id="$route.params.id" />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import OrderDetail from "@/components/Payment/OrderDetail.vue";
export default {
  components: {
    Navbar,
    OrderDetail,
    Footer,
  },
};
</script>
