<template>
  <!-- Service Start -->
  <div class="container-fluid service py-6">
    <div class="container">
      <div class="text-center wow bounceInUp" data-wow-delay="0.1s">
        <small
          class="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-3"
          >Our Services</small
        >
        <h1 class="display-5 mb-5">What We Offer</h1>
      </div>
      <div class="row g-4">
        <div
          v-for="(service, index) in services"
          :key="index"
          class="col-lg-3 col-md-6 col-sm-12 wow bounceInUp"
          :data-wow-delay="service.delay"
        >
          <div class="bg-light rounded service-item">
            <div
              class="service-content d-flex align-items-center justify-content-center p-4"
            >
              <div class="service-content-icon text-center">
                <i :class="service.icon + ' fa-7x text-primary mb-4'"></i>
                <h4 class="mb-3">{{ service.title }}</h4>
                <p class="mb-4">{{ service.description }}</p>
                <a href="#" class="btn btn-primary px-4 py-2 rounded-pill"
                  >Read More</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Service End -->
</template>

<script>
export default {
  name: "Service",
  data() {
    return {
      services: [
        {
          icon: "fas fa-cheese",
          title: "Wedding Services",
          description:
            "Contrary to popular belief, ipsum is not simply random.",
          delay: "0.1s",
        },
        {
          icon: "fas fa-pizza-slice",
          title: "Corporate Catering",
          description:
            "Contrary to popular belief, ipsum is not simply random.",
          delay: "0.3s",
        },
        {
          icon: "fas fa-hotdog",
          title: "Cocktail Reception",
          description:
            "Contrary to popular belief, ipsum is not simply random.",
          delay: "0.5s",
        },
        {
          icon: "fas fa-hamburger",
          title: "Bento Catering",
          description:
            "Contrary to popular belief, ipsum is not simply random.",
          delay: "0.7s",
        },
        {
          icon: "fas fa-wine-glass-alt",
          title: "Pub Party",
          description:
            "Contrary to popular belief, ipsum is not simply random.",
          delay: "0.1s",
        },
        {
          icon: "fas fa-walking",
          title: "Home Delivery",
          description:
            "Contrary to popular belief, ipsum is not simply random.",
          delay: "0.3s",
        },
        {
          icon: "fas fa-wheelchair",
          title: "Sit-down Catering",
          description:
            "Contrary to popular belief, ipsum is not simply random.",
          delay: "0.5s",
        },
        {
          icon: "fas fa-utensils",
          title: "Buffet Catering",
          description:
            "Contrary to popular belief, ipsum is not simply random.",
          delay: "0.7s",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Add your custom CSS styles for the Service component here */
</style>
