<template>
  <a class="text-body mb-3" href=""
    ><i class="fa fa-check text-primary me-2"></i>{{ facility }}</a
  >
</template>

<script>
export default {
  name: "FacilityItem",
  props: {
    facility: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Add your custom styles if needed */
</style>
