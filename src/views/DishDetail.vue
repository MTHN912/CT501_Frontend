<template>
  <div id="app">
    <Navbar />
    <DishDetail />
    <ReviewSection />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import DishDetail from "@/components/Menu/DishDetail.vue";
import ReviewSection from "@/components/Menu/ReviewSection.vue";

export default {
  components: {
    Navbar,
    DishDetail,
    Footer,
    ReviewSection,
  },
};
</script>
