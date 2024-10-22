<template>
  <div id="app">
    <Navbar />
    <SearchModal />
    <contact />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import contact from "@/components/contact/contact.vue";
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import SearchModal from "@/components/Layout/SearchModal.vue";
export default {
  components: {
    Navbar,
    SearchModal,
    contact,
    Footer,
  },
};
</script>
