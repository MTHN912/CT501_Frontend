import { message } from "ant-design-vue";
import axios from "axios";
import { createStore } from "vuex";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Thêm token vào header Authorization cho tất cả các yêu cầu
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Xử lý lỗi trước khi yêu cầu được gửi đi
    return Promise.reject(error);
  }
);
const store = createStore({
  state: {
    isLoggedIn: false,
    userInfo: null,
    editingMode: false,
    packages: [],
    deletedPackages: [],
    users: [],
    cart: { items: [] },
    averageRating: 0,
    totalReviews: 0,
    category: null,
  },
  mutations: {
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
    },
    SET_LOGIN_STATE(state, userInfo) {
      state.isLoggedIn = true;
      state.userInfo = userInfo;
    },
    LOGOUT(state) {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
    SET_CART(state, cart) {
      state.cart = cart;
    },
    ADD_TO_CART(state, payload) {
      const item = state.cart.items.find(item => item.dishId === payload.dishId);
      if (item) {
        item.quantity += payload.quantity;
      } else {
        state.cart.items.push(payload);
      }
    },
    // Cập nhật danh sách các gói trong state
    SET_PACKAGES(state, packages) {
      state.packages = packages;
    },
    SET_DELETED_PACKAGES(state, deletedPackages) {
      state.deletedPackages = deletedPackages;
    },
    UPDATE_PACKAGE(state, updatedPackage) {
      // Cập nhật gói trong state
      const index = state.packages.findIndex(
        (pkg) => pkg._id === updatedPackage._id
      );
      if (index !== -1) {
        state.packages[index] = updatedPackage;
      }
    },
    DELETE_PACKAGE(state, packageId) {
      state.packages = state.packages.filter((pkg) => pkg._id !== packageId);
    },
    blockUser(state, userId) {
      const user = state.users.find((user) => user.id === userId);
      if (user) {
        user.IS_BLOCKED = true;
      }
    },
    UnblockUser(state, userId) {
      const user = state.users.find((user) => user.id === userId);
      if (user) {
        user.IS_BLOCKED = false;
      }
    },
    SET_EDITING_MODE(state, mode) {
      state.editingMode = mode;
    },
    SET_AVERAGE_RATING(state, { averageRating, totalReviews }) {
      state.averageRating = averageRating;
      state.totalReviews = totalReviews;
    },
    setCategory(state, category) {
      state.category = category;
    },
    
  },
  actions: {
    async fetchPackages({ commit }) {
      try {
        const response = await axios.get("/package/getData");
        if (response.data.success) {
          const notDeletedPackages = response.data.data.filter(pkg => !pkg.IS_DELETE);
          const deletedPackages = response.data.data.filter(pkg => pkg.IS_DELETE);
          commit('SET_PACKAGES', notDeletedPackages);
          commit('SET_DELETED_PACKAGES', deletedPackages); 
        } else {
          throw new Error("Failed to fetch packages");
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        throw error;
      }
    },
    async updatePackage({ commit }, updatedPackage) {
      try {
        const { _id, IS_DELETE, ...updatedData } = updatedPackage;

        const response = await axios.put(`/package/update/${_id}`, updatedData);
        if (response.status === 200) {
          commit("UPDATE_PACKAGE", updatedPackage);
          message.success("Cập nhật gói thàng công!");
        } else {
          throw new Error("Update package failed");
        }
      } catch (error) {
        console.error("Error updating package:", error);
        throw error;
      }
    },
    async deletePackage({ commit }, packageId) {
      try {
        const response = await axios.delete(`/package/delete/${packageId}`);
        if (response.status === 200) {
          commit("DELETE_PACKAGE", packageId);
          message.success("Đã xóa gói thành công!");
        } else {
          // Xử lý trường hợp server trả về mã lỗi khác với 200
          const errorMessage = response.data.message || "Delete package failed";
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error("Error deleting package:", error);
        message.error("Lỗi khi xóa gói: " + error.message);
        throw error;
      }
    },
    async blockUser({ commit }, userId) {
      try {
        const response = await axios.post(`http://localhost:3000/user/blockUser`, {
          userId: userId,
          IS_BLOCKED: true,
        });
        console.log(response);
        if (response.status === 200) {
          commit("blockUser", userId);
          message.success("User has been blocked successfully");
        } else {
          throw new Error("Failed to block user: " + response.statusText);
        }
      } catch (error) {
        console.error("Error blocking user:", error);
        message.error("Error blocking user");
      }
    },
    async UnblockUser({ commit }, userId) {
      try {
        const response = await axios.post(`http://localhost:3000/user/blockUser`, {
          userId: userId,
          IS_BLOCKED: false,
        });
        if (response.status === 200) {
          commit("UnblockUser", userId);
          message.success("User has been unblocked successfully");
        } else {
          throw new Error("Failed to unblock user: " + response.statusText);
        }
      } catch (error) {
        console.error("Error unblocking user:", error);
        message.error("Error unblocking user");
        throw error;
      }
    },

    async login({ commit, dispatch }, credentials) {
      try {
        const response = await axios.post("http://localhost:3000/user/loginUser", {
          USERNAME: credentials.username,
          PASSWORD: credentials.password,
        });

        if (response.status >= 200 && response.status <= 300) {
          const user = response.data.message;
          const token = response.data.metadata;

          // Lưu token vào localStorage
          localStorage.setItem("token", token);
          console.log("Token saved to localStorage:", token);

          // Lưu trạng thái đăng nhập vào Vuex
          commit("SET_LOGIN_STATE", user);

          // Gọi hàm getUserInfo để lấy thông tin người dùng chi tiết
          await dispatch("getUserInfo");

          // Kiểm tra vai trò người dùng để điều hướng
          if (user.ROLE.IS_ADMIN) {
            return "admin";
          } else if (user.ROLE.IS_STAFF) {
            return "staff";
          } else {
            return 'unauthorized';
          }
        }
      } catch (error) {
        alert(
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập." +
            error.toString()
        );
        return "error";
      }
    },
    
    async googleLogin({ commit, dispatch }) {
      try {
        // Bước 1: Gọi API để lấy URL OAuth từ backend và chuyển hướng người dùng đến Google
        const response = await axios.get("http://localhost:3000/user/auth/google");
        const authUrl = response.data.authUrl;
        window.location.href = authUrl;
    
        // Sau khi người dùng quay lại từ Google, xử lý token ở bước khác trong app, không cần xử lý ở đây nữa
    
      } catch (error) {
        console.error("Google login failed:", error);
        return "error";
      }
    },
    
    async facebookLogin({ commit, dispatch }) {
      try {
        // Bước 1: Gọi API để lấy URL OAuth từ backend và chuyển hướng người dùng đến Facebook
        const response = await axios.get("http://localhost:3000/user/auth/facebook");
        const authUrl = response.data.authUrl;
        window.location.href = authUrl;

        // Sau khi người dùng quay lại từ Facebook, xử lý token ở bước khác trong app, không cần xử lý ở đây nữa
        
      } catch (error) {
        console.error("Facebook login failed:", error);
        return "error";
      }
    },
    
    async getUserInfo({ commit }) {
      try {
        console.log("Starting getUserInfo action");

        // Gọi API lấy thông tin người dùng mà không cần thêm token vào header vì interceptor đã lo việc này
        const response = await axios.get("http://localhost:3000/user/info");
        
        console.log("API response:", response);

        if (response.status >= 200 && response.status < 300) {
          const userInfo = response.data;
          console.log("User info:", userInfo);

          // Lưu thông tin người dùng vào Vuex
          commit("SET_LOGIN_STATE", userInfo);
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error while getting user info:", error);
      }
    },
    
    async updateUserInfo({ commit, state }, updatedInfo) {
      try {
        // Perform update request, for example:
        const response = await axios.put("http://localhost:3000/user/updateUser", updatedInfo);
        if (response.status >= 200 && response.status < 300) {
          // Optionally update local state if needed
          commit("SET_USER_INFO", updatedInfo);
          commit("SET_EDITING_MODE", false); // Turn off editing mode after successful update
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error while updating user info:", error);
        throw error; // Re-throw the error for handling in components
      }
    },
    async logout({ commit }) {
      console.log("Token before removal:", localStorage.getItem("token"));
      localStorage.removeItem("token");
      commit("LOGOUT");
      console.log("Token after removal:", localStorage.getItem("token"));
    },
    async checkToken({ commit, dispatch }) {
      // Không cần lấy token thủ công từ localStorage vì Axios Interceptor sẽ tự thêm
      try {
        // Gọi API lấy thông tin người dùng
        const response = await axios.get("http://localhost:3000/user/info");
    
        // Kiểm tra phản hồi từ server
        if (response.status >= 200 && response.status < 300) {
          const userInfo = response.data;
          // Lưu thông tin người dùng vào state
          commit("SET_LOGIN_STATE", userInfo);
        } else {
          console.error("Unexpected response status:", response.status);
          // Nếu có lỗi, thực hiện logout
          dispatch("logout");
        }
      } catch (error) {
        // Xử lý lỗi nếu xảy ra trong quá trình gọi API
        console.error("Error while checking token:", error);
        dispatch("logout");
      }
    },
    async addToCart({ commit }, { dishId, quantity }) {
      try {
        const response = await axios.post("http://localhost:3000/cart/addCart", {
          dishId,
          quantity
        });
        if (response.status === 200 || response.status === 201) {
          commit("ADD_TO_CART", { dishId, quantity });
          // message.success(`Đã thêm ${quantity} món vào giỏ hàng`);
          return response;
        } else {
          throw new Error("Failed to add to cart");
        }
      } catch (error) {
        message.error("Lỗi khi thêm món vào giỏ hàng: " + error.message);
        throw error;
      }
    },
    async fetchCart({ commit }) {
      try {
        const response = await axios.get("http://localhost:3000/cart/getCart");
        commit('SET_CART', response.data.cart);
        return response; // Trả về Promise để có thể sử dụng .then() và .catch()
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
        throw error; // Ném lỗi để có thể bắt được trong component
      }
    },
    async removeItem({ commit, dispatch }, dishId) {
      try {
        await axios.post("http://localhost:3000/cart/removeCart", {
          dishId: dishId,
        });
        // Sau khi xóa món thành công, gọi lại hành động fetchCart để cập nhật giỏ hàng
        await dispatch('fetchCart');
      } catch (error) {
        console.error("Lỗi khi bỏ món:", error);
      }
    },
    async fetchAverageRating({ commit }, dishId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/review/getAverageRating/${dishId}`
        );
        const { average, totalReviews } = response.data;
        commit('SET_AVERAGE_RATING', { averageRating: average, totalReviews });
      } catch (error) {
        console.error("Lỗi khi lấy điểm đánh giá trung bình:", error);
      }
    },
    updateCategory({ commit }, category) {
      commit('setCategory', category);
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    userInfo: (state) => state.userInfo,
    packages: (state) => state.packages,
    deletedPackages: state => state.deletedPackages,
    editingMode: (state) => state.editingMode,
    cartItems: (state) => state.cart.items,
    averageRating: (state) => state.averageRating,
    totalReviews: (state) => state.totalReviews,
    category: (state) => state.category,
  },
});

store.dispatch("checkToken");

export default store;
