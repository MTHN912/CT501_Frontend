<template>
  <div id="app">
    <Navbar />
    <DishList />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import DishList from "@/components/Menu/DishList.vue";

export default {
  components: {
    Navbar,
    DishList,
    Footer,
  },
};
</script>
