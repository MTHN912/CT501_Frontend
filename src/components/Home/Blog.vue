<template>
  <div class="container-fluid blog py-6">
    <div class="container">
      <div class="text-center wow bounceInUp" data-wow-delay="0.1s">
        <small
          class="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-3"
        >
          Our Blog
        </small>
        <h1 class="display-5 mb-5">Be First Who Read News</h1>
      </div>
      <div class="row gx-4 justify-content-center">
        <div
          v-for="(blog, index) in blogs"
          :key="index"
          :class="`col-md-6 col-lg-4 wow bounceInUp`"
          :data-wow-delay="blog.delay"
        >
          <div class="blog-item">
            <div class="overflow-hidden rounded">
              <img :src="blog.image" class="img-fluid w-100" alt="" />
            </div>
            <div class="blog-content mx-4 d-flex rounded bg-light">
              <div class="text-dark bg-primary rounded-start">
                <div
                  class="h-100 p-3 d-flex flex-column justify-content-center text-center"
                >
                  <p class="fw-bold mb-0">{{ blog.date }}</p>
                  <p class="fw-bold mb-0">{{ blog.month }}</p>
                </div>
              </div>
              <a href="#" class="h5 lh-base my-auto h-100 p-3">{{
                blog.title
              }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlogSection",
  data() {
    return {
      blogs: [
        {
          image: "img/blog-1.jpg",
          date: "16",
          month: "Sep",
          title: "How to get more test in your food from",
          delay: "0.1s",
        },
        {
          image: "img/blog-2.jpg",
          date: "16",
          month: "Sep",
          title: "How to get more test in your food from",
          delay: "0.3s",
        },
        {
          image: "img/blog-3.jpg",
          date: "16",
          month: "Sep",
          title: "How to get more test in your food from",
          delay: "0.5s",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
