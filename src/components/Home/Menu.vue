<template>
  <div class="container-fluid menu bg-light py-6 my-6">
    <div class="container">
      <div class="text-center wow bounceInUp" data-wow-delay="0.1s">
        <small
          class="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-3"
        >
          Món Ăn
        </small>
        <h1 class="display-5 mb-5">Các Món Ăn Nổi Bật Của Chúng Tôi</h1>
      </div>
      <div class="tab-class text-center">
        <ul
          class="nav nav-pills d-inline-flex justify-content-center mb-5 wow bounceInUp"
          data-wow-delay="0.1s"
        >
          <li
            class="nav-item p-2"
            v-for="(tab, index) in state.tabs"
            :key="tab.id"
          >
            <a
              class="d-flex py-2 mx-2 border border-primary bg-white rounded-pill"
              :class="{ active: state.currentTab === tab.id }"
              @click="
                async (event) => {
                  event.preventDefault(); // Ngăn cuộn lên đầu trang
                  if (tab.categoryName) {
                    state.currentTab = tab.id;
                    await fetchDishes(tab.categoryName);
                  } else {
                    console.error('Category name is undefined');
                  }
                }
              "
              href="#"
            >
              <span class="text-dark" style="width: 150px">{{ tab.name }}</span>
            </a>
          </li>
        </ul>

        <!-- Sử dụng v-if để kiểm tra dữ liệu trước khi render -->
        <div v-if="state.currentTab">
          <div
            v-for="(tab, index) in state.tabs"
            :key="tab.id"
            v-show="state.currentTab === tab.id"
          >
            <div class="row g-4">
              <div
                v-for="(item, itemIndex) in state.dishesByTab[tab.categoryName]"
                :key="item.id"
                class="col-lg-6 wow bounceInUp"
                :data-wow-delay="(itemIndex + 1) * 0.1 + 's'"
              >
                <div class="menu-item d-flex align-items-center">
                  <img
                    class="flex-shrink-0 img-fluid rounded-circle"
                    :src="item.image"
                    alt="Hình ảnh món ăn"
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

        <!-- Hiển thị thông báo nếu không có món ăn -->
        <div v-else>
          <p class="text-center">Không có dữ liệu để hiển thị</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, reactive } from "vue";

// Khởi tạo đối tượng reactive để chứa các trạng thái
const state = reactive({
  currentTab: "",
  tabs: [],
  dishesByTab: {},
});

// Hàm lấy danh mục từ API
const fetchCategories = async () => {
  try {
    const categoriesResponse = await axios.get(
      "http://localhost:3000/category/getCategory"
    );
    const categories = categoriesResponse.data.slice(0, 5); // Lấy tối đa 5 danh mục

    // Gán giá trị cho state.tabs từ dữ liệu API
    state.tabs = categories.map((category) => ({
      id: `tab-${category.name.replace(/[^a-zA-Z0-9]/g, "")}`, // Tạo id từ tên
      name: category.name,
      categoryName: category.name,
    }));

    // Chọn tab đầu tiên làm mặc định và tải món ăn
    if (state.tabs.length > 0) {
      state.currentTab = state.tabs[0].id; // Gán tab đầu tiên cho state.currentTab
      await fetchDishes(state.tabs[0].categoryName);
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
  }
};

// Hàm lấy món ăn cho tab hiện tại
const fetchDishes = async (categoryName) => {
  try {
    // Nếu chưa có món ăn cho danh mục hiện tại, gọi API để lấy
    if (!state.dishesByTab[categoryName]) {
      const dishesResponse = await axios.get(
        `http://localhost:3000/dish/getDish?category=${categoryName}`
      );
      state.dishesByTab[categoryName] = dishesResponse.data.slice(0, 8); // Lưu món ăn vào state
    }
  } catch (error) {
    console.error(`Lỗi khi lấy món ăn cho danh mục ${categoryName}:`, error);
  }
};

// Gọi API khi component được mounted
onMounted(fetchCategories);
</script>

<style scoped>
.menu-item img {
  width: 80px;
  height: 80px;
  object-fit: cover; /* Đảm bảo hình ảnh không bị méo */
}
</style>
