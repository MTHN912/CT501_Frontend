<template>
  <div id="app">
    <Navbar />
    <contact />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import contact from "@/components/contact/contact.vue";
export default {
  components: {
    Navbar,
    contact,
    Footer,
  },
};
</script>
