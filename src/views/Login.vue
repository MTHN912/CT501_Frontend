<template>
  <Background>
    <Login />
    <!-- Other components or content -->
  </Background>
</template>

<script>
import Login from "@/components/Login-Logout/Login.vue";
import Background from "@/components/Layout/Background.vue";
export default {
  components: {
    Background,
    Login,
  },
};
</script>
