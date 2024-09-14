<template>
  <router-view></router-view>
</template>

<script>
export default {
  created() {
    // Lấy token từ URL (nếu có)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    // Nếu có token, lưu vào localStorage
    if (token) {
      localStorage.setItem("token", token);

      // Gọi action để lấy thông tin người dùng sau khi có token
      this.$store.dispatch("getUserInfo");

      // Xoá token khỏi URL sau khi lưu vào localStorage
      window.history.replaceState({}, document.title, "/");
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
