<script setup>
import { useExtensionsStore } from "../stores/extensions";
import Extension from "./Extension.vue";

const extensionStore = useExtensionsStore();
const initUnique = () => extensionStore.initUnique();
const uniquePrevPage = () => extensionStore.uniquePrevPage();
const uniqueNextPage = () => extensionStore.uniqueNextPage();
const loadAll = () => extensionStore.loadAll();
const loadAllProgress = () => extensionStore.loadAllProgress();
const getOrder = () => extensionStore.getOrder();
const getRarities = () => extensionStore.getRarities();
const onOrderChange = (evt) => extensionStore.setOrder(evt);
const onRarityChange = (evt) => extensionStore.setRarity(evt);

initUnique();

</script>

<template>
  <div class="extensions">
    <h1>{{ extensionStore.uniqueCount }} extensions</h1>

    <v-btn v-if="!extensionStore.loadingAll && !extensionStore.allLoaded" @click="loadAll">Load all</v-btn>
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

    <p>Page {{ extensionStore.uniqueCurrentPage }}</p>

    <v-btn v-if="extensionStore.uniqueCurrentPage > 1" @click="uniquePrevPage">Prev</v-btn>
    <v-btn v-if="extensionStore.uniqueCurrentPage < extensionStore.uniqueCount/extensionStore.limit" @click="uniqueNextPage">Next</v-btn>

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
    <p>Page {{ extensionStore.uniqueCurrentPage }}</p>

    <v-btn v-if="extensionStore.uniqueCurrentPage > 1" @click="uniquePrevPage">Prev</v-btn>
    <v-btn v-if="extensionStore.uniqueCurrentPage < extensionStore.uniqueCount/extensionStore.limit" @click="uniqueNextPage">Next</v-btn>
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
