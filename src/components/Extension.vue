<script setup>

defineProps({
  name: {
    type: String,
    required: true,
  },
  external_url: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
});

</script>

<template>
    <h2>{{ name }}</h2>
    <a :href="external_url">
      <img :src="image_url" :alt="name" width="100"/>
    </a>
</template>

<style scoped>
</style>
