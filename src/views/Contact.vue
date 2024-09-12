<template>
  <div id="app">
    <Navbar />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
export default {
  components: {
    Navbar,
    Footer,
  },
};
</script>
