<script setup>
import { useExtensionsStore } from "../stores/extensions";
import Extension from "./Extension.vue";

const extensionStore = useExtensionsStore();
const init = () => extensionStore.init();
const prevPage = () => extensionStore.prevPage();
const nextPage = () => extensionStore.nextPage();
const loadAll = () => extensionStore.loadAll();
const loadAllProgress = () => extensionStore.loadAllProgress();
const loadAllStop = () => extensionStore.loadAllStop();

init();

</script>

<template>
  <div class="extensions">
    <h1>{{ extensionStore.count }} extensions</h1>

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

    <div class="d-flex flex-row-reverse mb-6 bg-surface-variant">
      <v-sheet class="ma-2 bg-surface-variant">Page {{ extensionStore.currentPage }}</v-sheet>
      <v-sheet class="ma-2 pa-2 bg-surface-variant"><v-btn v-if="extensionStore.currentPage < extensionStore.count/extensionStore.limit" @click="nextPage">Next</v-btn></v-sheet>
      <v-sheet class="ma-2 pa-2 bg-surface-variant"><v-btn v-if="extensionStore.currentPage > 1" @click="prevPage">Prev</v-btn></v-sheet>
    </div>

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

    <div class="d-flex flex-row-reverse mb-6 bg-surface-variant">
      <v-sheet class="ma-2 bg-surface-variant">Page {{ extensionStore.currentPage }}</v-sheet>
      <v-sheet class="ma-2 pa-2 bg-surface-variant"><v-btn v-if="extensionStore.currentPage < extensionStore.count/extensionStore.limit" @click="nextPage">Next</v-btn></v-sheet>
      <v-sheet class="ma-2 pa-2 bg-surface-variant"><v-btn v-if="extensionStore.currentPage > 1" @click="prevPage">Prev</v-btn></v-sheet>
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
