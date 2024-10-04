<template>
  <div id="app">
    <Navbar />
    <SearchModal />
    <Hero />
    <DishList class="dishlist" />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import SearchModal from "@/components/Layout/SearchModal.vue";
import DishList from "@/components/Menu/DishList.vue";
import Hero from "@/components/Menu/Hero.vue";

export default {
  components: {
    Navbar,
    SearchModal,
    Hero,
    DishList,
    Footer,
  },
};
</script>
<style scoped>
/* .dishlist {
  margin-top: 50px;
} */
</style>
