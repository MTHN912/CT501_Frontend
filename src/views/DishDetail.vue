<template>
  <div id="app">
    <Navbar />
    <HeroDishDetail />
    <DishDetail class="dish-detail" />
    <ReviewSection class="review-section" />
    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import DishDetail from "@/components/Menu/DishDetail.vue";
import HeroDishDetail from "@/components/Menu/HeroDishDetail.vue";
import ReviewSection from "@/components/Menu/ReviewSection.vue";

export default {
  components: {
    Navbar,
    HeroDishDetail,
    DishDetail,
    Footer,
    ReviewSection,
  },
};
</script>
<style scoped>
.dish-detail {
  margin-bottom: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 10 4px 8px rgba(0, 0, 0, 0.1);
}

.review-section {
  margin-top: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 10 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
