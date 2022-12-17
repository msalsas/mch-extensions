<script setup>
import { useExtensionsStore } from "../stores/extensions";
import Extension from "./Extension.vue";

const extensionStore = useExtensionsStore();
const fetchExtensions = () => extensionStore.fetchExtensions();

fetchExtensions();

</script>

<template>
  <div class="extension">
    <h1>{{ extensionStore.count }} extensions</h1>
    <ul>
      <li v-for="extension in extensionStore.extensions">
        <Extension :name="extension.name" :external_url="extension.external_url" :image_url="extension.image_url"/>
      </li>
    </ul>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
