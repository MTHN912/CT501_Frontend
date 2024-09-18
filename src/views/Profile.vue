<template>
  <div id="app">
    <Navbar />
    <Profile />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import Profile from "@/components/Profie/Profile.vue";

export default {
  components: {
    Navbar,
    Profile,
    Footer,
  },
};
</script>
