<template>
  <div id="app">
    <Navbar />
    <About />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import About from "@/components/About/About.vue";
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
export default {
  components: {
    Navbar,
    About,
    Footer,
  },
};
</script>
