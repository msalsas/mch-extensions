<script setup>
import { useExtensionsStore } from "../stores/extensions";
import Extension from "./Extension.vue";

const extensionStore = useExtensionsStore();
const initUnique = () => extensionStore.initUnique();
const uniquePrevPage = () => {
  extensionStore.uniquePrevPage();
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}
const uniqueNextPage = () => {
  extensionStore.uniqueNextPage();
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}
const loadAll = () => extensionStore.loadAll();
const allLoaded = () => extensionStore.allLoaded();
const loadAllProgress = () => extensionStore.loadAllProgress();
const loadAllStop = () => extensionStore.loadAllStop();
const getOrder = () => extensionStore.getOrder();
const getRarities = () => extensionStore.getRarities();
const onOrderChange = (evt) => extensionStore.setOrder(evt);
const onRarityChange = (evt) => extensionStore.setRarity(evt);

initUnique();

</script>

<template>
  <div class="extensions">
    <h2 class="ma-2 pa-2 d-flex justify-center">{{ extensionStore.uniqueCount }} extensions</h2>

    <v-btn v-if="!extensionStore.loadingAll && !allLoaded()" @click="loadAll">Load all</v-btn>
    <v-btn v-else-if="extensionStore.loadingAll" disabled="disabled"><v-progress-circular indeterminate :size="20" :width="3"></v-progress-circular>&nbsp;Loading</v-btn>

    <div v-if="extensionStore.loadingAll">
      <v-btn class="ma-2" @click="loadAllStop">
        <v-icon start icon="mdi-minus-circle"></v-icon>
        Cancel
      </v-btn>
      <h2>Progress: {{ Math.round(loadAllProgress()) }}%</h2>
      <v-progress-linear :model-value="loadAllProgress()" :height="7"></v-progress-linear>
    </div>

    <div class="order-filters">
      <label>Order</label>
      <v-select aria-label="order" :items="getOrder()" @update:modelValue="onOrderChange">
      </v-select>
    </div>

    <div class="order-filters">
      <label>Rarity</label>
      <v-select aria-label="rarity" :items="getRarities()" @update:modelValue="onRarityChange">
      </v-select>
    </div>

    <div class="d-flex flex-row-reverse mb-6 bg-surface-variant">
      <v-sheet class="ma-2 bg-surface-variant">Page {{ extensionStore.uniqueCurrentPage }}</v-sheet>
      <v-sheet class="ma-2 pa-2 bg-surface-variant"><v-btn v-if="extensionStore.uniqueCurrentPage < extensionStore.uniqueCount/extensionStore.limit" @click="uniqueNextPage">Next</v-btn></v-sheet>
      <v-sheet class="ma-2 pa-2 bg-surface-variant"><v-btn v-if="extensionStore.uniqueCurrentPage > 1" @click="uniquePrevPage">Prev</v-btn></v-sheet>
    </div>

    <ul>
      <li v-for="extension in extensionStore.viewUniqueExtensions">
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

    <div class="d-flex flex-row-reverse mb-6 bg-surface-variant">
      <v-sheet class="ma-2 bg-surface-variant">Page {{ extensionStore.uniqueCurrentPage }}</v-sheet>
      <v-sheet class="ma-2 pa-2 bg-surface-variant"><v-btn v-if="extensionStore.uniqueCurrentPage < extensionStore.uniqueCount/extensionStore.limit" @click="uniqueNextPage">Next</v-btn></v-sheet>
      <v-sheet class="ma-2 pa-2 bg-surface-variant"><v-btn v-if="extensionStore.uniqueCurrentPage > 1" @click="uniquePrevPage">Prev</v-btn></v-sheet>
    </div>
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
