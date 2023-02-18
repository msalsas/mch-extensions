<script setup>
defineProps({
  type_name: {
    type: String,
    required: true,
  },
  lv: {
    type: Number,
    required: true,
  },
  hp: {
    type: Number,
    required: true,
  },
  phy: {
    type: Number,
    required: true,
  },
  int: {
    type: Number,
    required: true,
  },
  agi: {
    type: Number,
    required: true,
  },
  external_url: {
    type: String,
    required: true,
  },
  extension_url: {
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
  <h2>{{ type_name }}</h2>
  <a :href="extension_url" target="_blank">
    <img :src="image_url" :alt="type_name" width="100" />
  </a>
  <div class="attributes">
    <div>Level: {{ lv }}</div>
    <div>HP: {{ hp }}</div>
    <div>PHY: {{ phy }}</div>
    <div>INT: {{ int }}</div>
    <div>AGI: {{ agi }}</div>
  </div>
</template>

<style scoped>
.attributes {
  display: inline-block;
  margin: 50px;
}
</style>
