<script setup>
import Extensions from "../components/Extensions.vue";
import UniqueExtensions from "../components/UniqueExtensions.vue";
import { ref } from "vue";

const tab = ref(null);

</script>

<template>
  <main>
    <v-tabs v-model="tab">
      <v-tab value="extensions">Extensions</v-tab>
      <v-tab value="unique-extensions">Unique Extensions</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="extensions">
        <Extensions/>
      </v-window-item>
      <v-window-item value="unique-extensions">
        <UniqueExtensions/>
      </v-window-item>
    </v-window>
  </main>
</template>
