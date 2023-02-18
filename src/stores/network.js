import Web3 from "web3";
import { ref } from "vue";
import { defineStore } from "pinia";

export const useNetworkStore = defineStore("network", () => {
  const isEthereum = ref(false);
  const loading = ref(true);

  fetchIsEthereum();

  function fetchIsEthereum() {
    if (typeof window.ethereum === "undefined") {
      loading.value = false;
      isEthereum.value = false;

      return;
    }

    const web3 = new Web3(window.ethereum);

    web3.eth.getChainId().then((chainId) => {
      isEthereum.value = chainId === 1;
      loading.value = false;
    });

    window.ethereum.enable();
    window.ethereum.on("networkChanged", function () {
      location.reload();
    });
  }

  return { isEthereum, loading };
});
