<script setup>
import { useExtensionsStore } from "../stores/extensions";
import Extension from "./Extension.vue";

const extensionStore = useExtensionsStore();
const initUnique = () => extensionStore.initUnique();
const getCountUnique = () => extensionStore.getCountUnique();
const uniquePrevPage = () => extensionStore.uniquePrevPage();
const uniqueNextPage = () => extensionStore.uniqueNextPage();
const loadAll = () => extensionStore.loadAll();
const loadAllProgress = () => extensionStore.loadAllProgress();

initUnique();

</script>

<template>
  <div class="extensions">
    <h1>{{ getCountUnique() }} extensions</h1>

    <v-btn v-if="!extensionStore.loadingAll" @click="loadAll">Load all</v-btn>
    <v-btn v-else disabled="disabled"><v-progress-circular indeterminate :size="20" :width="3"></v-progress-circular>&nbsp;Loading</v-btn>

    <div v-if="extensionStore.loadingAll">
      <h2>Progress: {{ Math.round(loadAllProgress()) }}%</h2>
      <v-progress-linear :model-value="loadAllProgress()" :height="7"></v-progress-linear>
    </div>

    <div class="order-filters">
      <label>Order</label>
      <v-select name="order" aria-label="order" :items="[
          {'title': 'HP', 'value': 'hp'},
          {'title': 'PHY', 'value': 'phy'},
          {'title': 'INT', 'value': 'int'},
          {'title': 'AGI', 'value': 'agi'},
      ]">
      </v-select>
    </div>

    <p>Page {{ extensionStore.uniqueCurrentPage }}</p>

    <v-btn v-if="extensionStore.uniqueCurrentPage > 1" @click="uniquePrevPage">Prev</v-btn>
    <v-btn v-if="extensionStore.uniqueCurrentPage < getCountUnique()/extensionStore.limit" @click="uniqueNextPage">Next</v-btn>

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
    <v-btn v-if="extensionStore.uniqueCurrentPage < getCountUnique()/extensionStore.limit" @click="uniqueNextPage">Next</v-btn>
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
