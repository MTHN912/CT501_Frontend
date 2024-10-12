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
              Mình về ta chẳng cho về. Ta nắm lấy áo, ta đề câu thơ Câu thơ ba
              chữ sành sành. Chữ trung, chữ hiếu, chữ tình là ba. Chữ trung ta
              để phần cha. Chữ hiếu phần mẹ, đôi ta chữ tình
            </p>
            <div class="footer-icon d-flex">
              <a
                class="btn btn-primary btn-sm-square me-2 rounded-circle"
                href="https://www.facebook.com/maitranhoangnguyen"
                ><i class="fab fa-facebook-f"></i
              ></a>
              <a
                class="btn btn-primary btn-sm-square me-2 rounded-circle"
                href=""
                ><i class="fab fa-twitter"></i
              ></a>
              <a
                class="btn btn-primary btn-sm-square me-2 rounded-circle"
                href="https://www.instagram.com/nguyen_912?fbclid=IwY2xjawF17ABleHRuA2FlbQIxMAABHTl0jsOQs_C5bVrKZuFnsbSJL0strA1B9_l0zb_whoesg9dlrZ2ycqJ0aw_aem_0OatJLhvL9p9tyma4zRIAg"
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
            <h4 class="mb-4">Tiêu chí nhà hàng</h4>
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
            <h4 class="mb-4">Liên Hệ</h4>
            <div class="d-flex flex-column align-items-start">
              <p>
                <i class="fa fa-map-marker-alt text-primary me-2"></i> 147H2/18,
                An Khánh, Ninh Kiều, Cần Thơ
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
                <i class="fa fa-clock text-primary me-2"></i> Phục vụ mọi lúc
                mọi nơi
              </p>
            </div>
          </div>
        </div>

        <!-- Social Gallery -->
        <div class="col-lg-3 col-md-6">
          <div class="footer-item">
            <h4 class="mb-4">Các Món Tiêu Biểu</h4>
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
        "Nhân nghĩa làm gốc",
        "Trung quân ái quốc",
        "Hiếu thuận phụ mẫu",
        "Liêm chính thật thà",
      ],
      galleryImages: [
        "http://cdn.tgdd.vn/Files/2022/01/06/1409477/cach-lam-vit-quay-bac-kinh-thom-phuc-chuan-vi-nguoi-hoa-202201061633018730.jpg",
        "https://trivietphat.net/wp-content/uploads/2023/11/sun-ga-chien-gion.webp",
        "https://cdn.tgdd.vn/2020/12/CookProduct/Untitled-1-1200x676-10.jpg",
        "https://matika.vn/wp-content/uploads/2022/09/mon-ga-hap-la-sen.jpg",
        "https://bakafood.com/wp-content/uploads/2023/03/ba7.jpg",
        "https://monngonmoingay.com/wp-content/uploads/2015/08/lau-nam-chay-880.jpg",
      ],
    };
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
