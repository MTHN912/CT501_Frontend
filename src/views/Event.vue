<template>
  <div id="app">
    <Navbar />
    <Event />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Event from "@/components/Event/Event.vue";
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
export default {
  components: {
    Navbar,
    Event,
    Footer,
  },
};
</script>
