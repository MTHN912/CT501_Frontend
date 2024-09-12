<template>
  <div class="container-fluid menu bg-light py-6 my-6">
    <div class="container">
      <div class="text-center wow bounceInUp" data-wow-delay="0.1s">
        <small
          class="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-3"
          >Our Menu</small
        >
        <h1 class="display-5 mb-5">Most Popular Food in the World</h1>
      </div>
      <div class="tab-class text-center">
        <ul
          class="nav nav-pills d-inline-flex justify-content-center mb-5 wow bounceInUp"
          data-wow-delay="0.1s"
        >
          <li class="nav-item p-2" v-for="(tab, index) in tabs" :key="index">
            <a
              class="d-flex py-2 mx-2 border border-primary bg-white rounded-pill"
              :class="{ active: currentTab === tab.id }"
              @click="currentTab = tab.id"
              :href="'#' + tab.id"
            >
              <span class="text-dark" style="width: 150px">{{ tab.name }}</span>
            </a>
          </li>
        </ul>
        <div class="tab-content">
          <div v-for="(tab, index) in tabs" :key="index">
            <div
              :id="tab.id"
              class="tab-pane fade show p-0"
              :class="{ active: currentTab === tab.id }"
            >
              <div class="row g-4">
                <div
                  v-for="(item, itemIndex) in tab.items"
                  :key="itemIndex"
                  class="col-lg-6 wow bounceInUp"
                  :data-wow-delay="(itemIndex + 1) * 0.1 + 's'"
                >
                  <div class="menu-item d-flex align-items-center">
                    <img
                      class="flex-shrink-0 img-fluid rounded-circle"
                      :src="item.image"
                      alt=""
                    />
                    <div class="w-100 d-flex flex-column text-start ps-4">
                      <div
                        class="d-flex justify-content-between border-bottom border-primary pb-2 mb-2"
                      >
                        <h4>{{ item.name }}</h4>
                        <h4 class="text-primary">${{ item.price }}</h4>
                      </div>
                      <p class="mb-0">{{ item.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Placeholder data for tabs and menu items, replace with API data in the future
const tabs = ref([
  {
    id: "tab-6",
    name: "Starter",
    items: [
      {
        name: "Paneer",
        price: 90,
        description:
          "Consectetur adipiscing elit sed dwso eiusmod tempor incididunt ut labore.",
        image: "img/menu-01.jpg",
      },
      {
        name: "Sweet Potato",
        price: 90,
        description:
          "Consectetur adipiscing elit sed dwso eiusmod tempor incididunt ut labore.",
        image: "img/menu-02.jpg",
      },
      {
        name: "Sabudana Tikki",
        price: 90,
        description:
          "Consectetur adipiscing elit sed dwso eiusmod tempor incididunt ut labore.",
        image: "img/menu-03.jpg",
      },
      {
        name: "Pizza",
        price: 90,
        description:
          "Consectetur adipiscing elit sed dwso eiusmod tempor incididunt ut labore.",
        image: "img/menu-04.jpg",
      },
      {
        name: "Bacon",
        price: 90,
        description:
          "Consectetur adipiscing elit sed dwso eiusmod tempor incididunt ut labore.",
        image: "img/menu-05.jpg",
      },
      {
        name: "Chicken",
        price: 90,
        description:
          "Consectetur adipiscing elit sed dwso eiusmod tempor incididunt ut labore.",
        image: "img/menu-06.jpg",
      },
      {
        name: "Blooming",
        price: 90,
        description:
          "Consectetur adipiscing elit sed dwso eiusmod tempor incididunt ut labore.",
        image: "img/menu-07.jpg",
      },
      {
        name: "Sweet",
        price: 90,
        description:
          "Consectetur adipiscing elit sed dwso eiusmod tempor incididunt ut labore.",
        image: "img/menu-08.jpg",
      },
    ],
  },
  { id: "tab-7", name: "Main Course", items: [] },
  { id: "tab-8", name: "Drinks", items: [] },
  { id: "tab-9", name: "Offers", items: [] },
  { id: "tab-10", name: "Our Special", items: [] },
]);

const currentTab = ref("tab-6"); // Default active tab
</script>

<style scoped>
/* Add your component styles here */
</style>
