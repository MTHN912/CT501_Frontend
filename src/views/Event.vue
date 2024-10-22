<template>
  <div id="app">
    <Navbar />
    <EventHero />
    <SearchModal />
    <Event />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import Event from "@/components/Event/Event.vue";
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
import SearchModal from "@/components/Layout/SearchModal.vue";
import EventHero from "@/components/Event/EventHero.vue";
export default {
  components: {
    Navbar,
    EventHero,
    SearchModal,
    Event,
    Footer,
  },
};
</script>
