<script setup>
import { useExtensionsStore } from "../stores/extensions";
import Extension from "./Extension.vue";

const extensionStore = useExtensionsStore();
const init = () => extensionStore.init();
const prevPage = () => extensionStore.prevPage();
const nextPage = () => extensionStore.nextPage();
const loadAll = () => extensionStore.loadAll();

init();

</script>

<template>
  <div class="extensions">
    <h1>{{ extensionStore.count }} extensions</h1>

    <button v-if="!extensionStore.loadingAll" @click="loadAll">Load all</button>
    <button v-else disabled="disabled">Loading...</button>

    <div class="order-filters">
      <label>Order</label>
      <select name="order" aria-label="order">
        <option value="hp">HP</option>
        <option value="phy">PHY</option>
        <option value="int">INT</option>
        <option value="agi">AGI</option>
      </select>
    </div>

    <button @click="prevPage">Prev</button>
    <button @click="nextPage">Next</button>
    <ul>
      <li v-for="extension in extensionStore.viewExtensions">
        <Extension
            :type_name="extension.type_name"
            :external_url="extension.external_url"
            :extension_url="extension.extension_url"
            :image_url="extension.image_url"
            :lv="extension.lv"
            :hp="extension.hp"
            :phy="extension.phy"
            :int="extension.int"
            :agi="extension.agi"/>
      </li>
    </ul>
    <button @click="prevPage">Prev</button>
    <button @click="nextPage">Next</button>
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
