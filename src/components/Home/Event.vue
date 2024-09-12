<template>
  <!-- Events Start -->
  <div class="container-fluid event py-6">
    <div class="container">
      <div class="text-center wow bounceInUp" data-wow-delay="0.1s">
        <small
          class="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-3"
        >
          Latest Events
        </small>
        <h1 class="display-5 mb-5">Our Social & Professional Events Gallery</h1>
      </div>
      <div class="tab-class text-center">
        <ul
          class="nav nav-pills d-inline-flex justify-content-center mb-5 wow bounceInUp"
          data-wow-delay="0.1s"
        >
          <li class="nav-item p-2" v-for="(tab, index) in tabs" :key="index">
            <a
              class="d-flex mx-2 py-2 border border-primary bg-light rounded-pill"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
              href="#"
            >
              <span class="text-dark" style="width: 150px">{{ tab.name }}</span>
            </a>
          </li>
        </ul>
        <div class="tab-content">
          <div
            v-for="(tab, index) in tabs"
            :key="index"
            :class="[
              'tab-pane fade show p-0',
              { active: activeTab === tab.id },
            ]"
          >
            <div class="row g-4">
              <div class="col-lg-12">
                <div class="row g-4">
                  <div
                    v-for="(event, eventIndex) in tab.events"
                    :key="eventIndex"
                    class="col-md-6 col-lg-3 wow bounceInUp"
                    :data-wow-delay="event.delay"
                  >
                    <div class="event-img position-relative">
                      <img
                        class="img-fluid rounded w-100"
                        :src="event.image"
                        :alt="event.name"
                      />
                      <div class="event-overlay d-flex flex-column p-4">
                        <h4 class="me-auto">{{ event.name }}</h4>
                        <a
                          :href="event.image"
                          :data-lightbox="event.lightboxId"
                          class="my-auto"
                        >
                          <i class="fas fa-search-plus text-dark fa-2x"></i>
                        </a>
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
  </div>
  <!-- Events End -->
</template>

<script>
export default {
  data() {
    return {
      activeTab: "tab-1",
      tabs: [
        {
          id: "tab-1",
          name: "All Events",
          events: [
            {
              name: "Wedding",
              image: "img/event-1.jpg",
              delay: "0.1s",
              lightboxId: "event-1",
            },
            {
              name: "Corporate",
              image: "img/event-2.jpg",
              delay: "0.3s",
              lightboxId: "event-2",
            },
            {
              name: "Wedding",
              image: "img/event-3.jpg",
              delay: "0.5s",
              lightboxId: "event-3",
            },
            {
              name: "Buffet",
              image: "img/event-4.jpg",
              delay: "0.7s",
              lightboxId: "event-4",
            },
            {
              name: "Cocktail",
              image: "img/event-5.jpg",
              delay: "0.1s",
              lightboxId: "event-5",
            },
            {
              name: "Wedding",
              image: "img/event-6.jpg",
              delay: "0.3s",
              lightboxId: "event-6",
            },
            {
              name: "Buffet",
              image: "img/event-7.jpg",
              delay: "0.5s",
              lightboxId: "event-7",
            },
            {
              name: "Corporate",
              image: "img/event-8.jpg",
              delay: "0.7s",
              lightboxId: "event-8",
            },
          ],
        },
        {
          id: "tab-2",
          name: "Wedding",
          events: [
            {
              name: "Wedding",
              image: "img/event-1.jpg",
              delay: "0.1s",
              lightboxId: "event-9",
            },
            {
              name: "Wedding",
              image: "img/event-2.jpg",
              delay: "0.3s",
              lightboxId: "event-10",
            },
          ],
        },
        {
          id: "tab-3",
          name: "Corporate",
          events: [
            {
              name: "Corporate",
              image: "img/event-3.jpg",
              delay: "0.5s",
              lightboxId: "event-11",
            },
            {
              name: "Corporate",
              image: "img/event-4.jpg",
              delay: "0.7s",
              lightboxId: "event-12",
            },
          ],
        },
        {
          id: "tab-4",
          name: "Cocktail",
          events: [
            {
              name: "Cocktail",
              image: "img/event-5.jpg",
              delay: "0.1s",
              lightboxId: "event-13",
            },
            {
              name: "Cocktail",
              image: "img/event-6.jpg",
              delay: "0.3s",
              lightboxId: "event-14",
            },
          ],
        },
        {
          id: "tab-5",
          name: "Buffet",
          events: [
            {
              name: "Buffet",
              image: "img/event-7.jpg",
              delay: "0.5s",
              lightboxId: "event-15",
            },
            {
              name: "Buffet",
              image: "img/event-8.jpg",
              delay: "0.7s",
              lightboxId: "event-16",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped>
.tab-content {
  margin-top: 20px;
}
.event-img {
  position: relative;
}
.event-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: none;
}
.event-img:hover .event-overlay {
  display: flex;
}
</style>
