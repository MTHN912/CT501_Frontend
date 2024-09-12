<template>
  <div
    class="container-fluid footer py-6 my-6 mb-0 bg-light wow bounceInUp"
    data-wow-delay="0.1s"
  >
    <div class="container">
      <div class="row">
        <!-- Company Info -->
        <div class="col-lg-3 col-md-6">
          <div class="footer-item">
            <h1 class="text-primary">
              MTHN<span class="text-dark">Restaurant</span>
            </h1>
            <p class="lh-lg mb-4">
              There cursus massa at urnaaculis estieSed aliquamellus vitae ultrs
              condmentum leo massamollis its estiegittis miristum.
            </p>
            <div class="footer-icon d-flex">
              <a
                class="btn btn-primary btn-sm-square me-2 rounded-circle"
                href=""
                ><i class="fab fa-facebook-f"></i
              ></a>
              <a
                class="btn btn-primary btn-sm-square me-2 rounded-circle"
                href=""
                ><i class="fab fa-twitter"></i
              ></a>
              <a
                class="btn btn-primary btn-sm-square me-2 rounded-circle"
                href=""
                ><i class="fab fa-instagram"></i
              ></a>
              <a class="btn btn-primary btn-sm-square rounded-circle" href=""
                ><i class="fab fa-linkedin-in"></i
              ></a>
            </div>
          </div>
        </div>

        <!-- Special Facilities -->
        <div class="col-lg-3 col-md-6">
          <div class="footer-item">
            <h4 class="mb-4">Special Facilities</h4>
            <div class="d-flex flex-column align-items-start">
              <!-- Use FacilityItem component -->
              <FacilityItem
                v-for="(facility, index) in facilities"
                :key="index"
                :facility="facility"
              />
            </div>
          </div>
        </div>

        <!-- Contact Us -->
        <div class="col-lg-3 col-md-6">
          <div class="footer-item">
            <h4 class="mb-4">Contact Us</h4>
            <div class="d-flex flex-column align-items-start">
              <p>
                <i class="fa fa-map-marker-alt text-primary me-2"></i> 123
                Street, New York, USA
              </p>
              <p>
                <i class="fa fa-phone-alt text-primary me-2"></i> (+84)
                783361874
              </p>
              <p>
                <i class="fas fa-envelope text-primary me-2"></i>
                nguyenb2014678@student.ctu.edu.vn
              </p>
              <p>
                <i class="fa fa-clock text-primary me-2"></i> 26/7 Hours Service
              </p>
            </div>
          </div>
        </div>

        <!-- Social Gallery -->
        <div class="col-lg-3 col-md-6">
          <div class="footer-item">
            <h4 class="mb-4">Social Gallery</h4>
            <div class="row g-2">
              <div
                v-for="(image, index) in galleryImages"
                :key="index"
                class="col-4"
              >
                <img
                  :src="image"
                  class="img-fluid rounded-circle border border-primary p-2"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import FacilityItem component
import FacilityItem from "./FacilityItem.vue";

export default {
  name: "Footer",
  components: {
    FacilityItem,
  },
  data() {
    return {
      facilities: [
        "Cheese Burger",
        "Sandwich",
        "Panner Burger",
        "Special Sweets",
      ],
      galleryImages: [
        "img/menu-01.jpg",
        "img/menu-02.jpg",
        "img/menu-03.jpg",
        "img/menu-04.jpg",
        "img/menu-05.jpg",
        "img/menu-06.jpg",
      ],
    };
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
