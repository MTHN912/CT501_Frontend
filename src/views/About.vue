<template>
  <div id="app">
    <Navbar />
    <SearchModal />
    <About />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import About from "@/components/About/About.vue";
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import SearchModal from "@/components/Layout/SearchModal.vue";
export default {
  components: {
    Navbar,
    SearchModal,
    About,
    Footer,
  },
};
</script>
