<template>
  <div id="app">
    <Navbar />
    <SearchModal />
    <Cart />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import SearchModal from "@/components/Layout/SearchModal.vue";
import Cart from "../components/Menu/Cart.vue";

export default {
  components: {
    Navbar,
    SearchModal,
    Cart,
    Footer,
  },
};
</script>
