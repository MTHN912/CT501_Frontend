<template>
  <Background>
    <forgetPassword />
    <!-- Other components or content -->
  </Background>
</template>

<script>
import Background from "@/components/Layout/Background.vue";
import forgetPassword from "@/components/Login-Logout/ForgotPassword.vue";
export default {
  components: {
    Background,
    forgetPassword,
  },
};
</script>
