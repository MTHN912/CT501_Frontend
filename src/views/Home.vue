<template>
  <div id="app">
    <Navbar />
    <Hero />
    <About />
    <Fact />
    <Service />
    <Event />
    <Menu />
    <Blog />
    <Footer />
    <!-- Other components or content -->
  </div>
</template>

<script>
import About from "@/components/Home/About.vue";
import Blog from "@/components/Home/Blog.vue";
import Event from "@/components/Home/Event.vue";
import Fact from "@/components/Home/Fact.vue";
import Hero from "@/components/Home/Hero.vue";
import Menu from "@/components/Home/Menu.vue";
import Service from "@/components/Home/Service.vue";
import Footer from "@/components/Layout/Footer.vue";
import Navbar from "@/components/Layout/Navbar.vue";
export default {
  components: {
    Navbar,
    Hero,
    About,
    Fact,
    Service,
    Event,
    Menu,
    Blog,
    Footer,
  },
};
</script>
