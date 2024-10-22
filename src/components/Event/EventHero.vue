<template>
  <!-- Hero Start -->
  <div class="container-fluid hero-container">
    <div class="hero-background"></div>
    <div class="overlay"></div>
    <div class="container text-center animated bounceInDown hero-content">
      <h1 class="display-1 mb-4">{{ title }}</h1>
      <ol class="breadcrumb justify-content-center mb-0 animated bounceInDown">
        <li class="breadcrumb-item">
          <a href="http://localhost:3001/">{{ homeText }}</a>
        </li>
        <li class="breadcrumb-item text-white" aria-current="page">
          {{ currentPage }}
        </li>
      </ol>
    </div>
  </div>
  <!-- Hero End -->
</template>

<script>
export default {
  data() {
    return {
      title: "Gói Tiệc Ưu Đãi",
      homeText: "Home",
      currentPage: "Package",
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const scrollPosition = window.pageYOffset;
      const heroBackground = document.querySelector(".hero-background");
      heroBackground.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    },
  },
};
</script>

<style scoped>
.hero-container {
  position: relative;
  overflow: hidden;
  padding: 11.5rem 5rem;
  background-color: #f8f9fa; /* Fallback color */
  margin-bottom: 15px;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("/public/img/Screenshot 2024-10-05 122614.png");
  /* https://sikido.vn/uploads/source/tintuc/chu-p-a-nh2-1.jpg */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: translateY(0);
  will-change: transform;
  z-index: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
}

.display-1 {
  margin-top: 75px;
  font-size: 5rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.breadcrumb {
  background: transparent;
  margin-top: 20px;
}

.breadcrumb-item a {
  color: #ffcc00;
  transition: color 0.3s;
}

.breadcrumb-item a:hover {
  color: #ffaa00;
  text-decoration: none;
}

.text-white {
  color: #ffffff;
}
</style>
