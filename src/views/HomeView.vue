<script setup>
import Extensions from "../components/Extensions.vue";
import UniqueExtensions from "../components/UniqueExtensions.vue";
import { ref } from "vue";
import { useNetworkStore } from "../stores/network";

const networkStore = useNetworkStore();
const tab = ref(null);

</script>

<template>
  <main>
    <h1 class="d-flex justify-center">MCH Extensions</h1>
    <div><a href="/about">About</a></div>
    <v-alert v-if="!networkStore.isEthereum && !networkStore.loading" type="warning" text="Connect to Ethereum Network"></v-alert>
    <v-tabs v-model="tab">
      <v-tab value="extensions">All Extensions</v-tab>
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
