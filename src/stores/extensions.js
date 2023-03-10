import { ref } from "vue";
import { defineStore } from "pinia";
import extensionMethod from "../helper/extensionMethod";
import extensionMetadata from "../helper/extensionMetadata";
import {
  initDB,
  getFromDB,
  addToDB,
  getAll,
  getUnique,
} from "../helper/extensionsIndexedDB";

export const useExtensionsStore = defineStore("extensions", () => {
  const extensions = ref([]);
  const uniqueExtensions = ref([]);
  const viewExtensions = ref([]);
  const viewUniqueExtensions = ref([]);
  const count = ref(0);
  const uniqueCount = ref(0);
  const tokenURIPrefix = ref("");
  const loadingAll = ref(false);
  const loadingAllIndex = ref(
    parseInt(localStorage.getItem("loadingAllIndex"), 10) || 0
  );
  const currentPage = ref(1);
  const uniqueCurrentPage = ref(1);
  const limit = ref(20);
  const order = ref([
    { title: "HP", value: "hp" },
    { title: "PHY", value: "phy" },
    { title: "INT", value: "int" },
    { title: "AGI", value: "agi" },
  ]);
  const rarities = ref([
    { title: "All", value: null },
    { title: "C", value: "Common" },
    { title: "U", value: "Uncommon" },
    { title: "R", value: "Rare" },
    { title: "E", value: "Epic" },
    { title: "L", value: "Legendary" },
  ]);
  const selectedOrder = ref("hp");
  const selectedRarity = ref(null);

  getExtensions();
  getUniqueExtensions();

  function maxLv(rarity) {
    switch (rarity) {
      case "Common":
        return 60;
      case "Uncommon":
        return 70;
      case "Rare":
        return 80;
      case "Epic":
        return 90;
      case "Legendary":
        return 100;
    }

    console.log("No max level for rarity " + rarity);
  }

  function init() {
    totalSupply(() => {
      getTokenURIPrefix(() => {
        fetchExtensions();
      });
    });
  }

  function initUnique() {
    totalSupply(() => {
      getTokenURIPrefix(() => {
        fetchUniqueExtensions();
      });
    });
  }

  function totalSupply(callback = () => {}) {
    extensionMethod("totalSupply", (result) => {
      count.value = result;

      callback();
    });
  }

  function getTokenURIPrefix(callback = () => {}) {
    extensionMethod("tokenURIPrefix", (tokenPrefix) => {
      tokenURIPrefix.value = tokenPrefix;

      callback();
    });
  }

  function loadAll() {
    if (loadingAll.value) {
      return;
    }
    loadingAll.value = true;

    const timer = setInterval(function () {
      if (!loadingAll.value) {
        clearInterval(timer);
        return;
      }

      if (loadingAllIndex.value > count.value) {
        loadingAllIndex.value = 0;
        loadingAll.value = false;
        clearInterval(timer);
        return;
      }

      localStorage.setItem("loadingAllIndex", loadingAllIndex.value);
      extensionMethod(
          "tokenByIndex",
          (id) => {
            if (extensions.value.some((extension) => extension.id === id)) {
              return;
            }

            console.log("Loading metadata for " + id);

            saveMetadata(id, function () {
              if (allLoaded()) {
                loadingAll.value = false;
              }
            });
          },
          loadingAllIndex.value++
      );
    }, 1000);
  }

  function loadAllStop() {
    loadingAll.value = false;
  }

  function fetchExtensions() {
    let loopCount = 0;
    for (
      let i = (currentPage.value - 1) * limit.value;
      i < (currentPage.value - 1) * limit.value + limit.value;
      i++
    ) {
      extensionMethod(
        "tokenByIndex",
        (id) => {
          if (extensions.value.some((extension) => extension.id === id)) {
            viewExtensions.value[loopCount++] = extensions.value.find(
              (extension) => extension.id === id
            );
            return;
          }

          saveMetadata(id, (metadata) => {
            viewExtensions.value[loopCount++] = {
              id: id,
              ...metadata,
            };
          });
        },
        i
      );
    }
  }

  function getExtensions() {
    initDB((extensionObjectStore) => {
      getAll(extensionObjectStore, (result) => {
        extensions.value = result;
      });
    });
  }

  function getUniqueExtensions() {
    initDB((extensionObjectStore) => {
      getUnique(
        extensionObjectStore,
        selectedOrder.value,
        selectedRarity.value,
        (result) => {
          uniqueExtensions.value = result;
          uniqueCount.value = result.length;

          fetchUniqueExtensions();
        }
      );
    });
  }

  function setRarity(rarity) {
    selectedRarity.value = rarity;
    uniqueCurrentPage.value = 1;

    getUniqueExtensions();
  }

  function setOrder(order) {
    selectedOrder.value = order;
    uniqueCurrentPage.value = 1;

    getUniqueExtensions();
  }

  function getOrder() {
    return order.value;
  }

  function getRarities() {
    return rarities.value;
  }

  function fetchUniqueExtensions() {
    let loopCount = 0;
    for (
      let i = (uniqueCurrentPage.value - 1) * limit.value;
      i < (uniqueCurrentPage.value - 1) * limit.value + limit.value;
      i++
    ) {
      if (typeof uniqueExtensions.value[i] !== "undefined") {
        viewUniqueExtensions.value[loopCount++] = uniqueExtensions.value[i];
      } else if (typeof viewUniqueExtensions.value[loopCount] !== "undefined") {
        viewUniqueExtensions.value.splice(loopCount, 1);
      }
    }
  }

  function saveMetadata(id, callback = () => {}) {
    extensionMetadata(id, tokenURIPrefix.value, (metadata) => {
      if (metadata.lv === maxLv(metadata.rarity)) {
        metadata.is_max_lv = 1;
      }
      extensions.value.push({
        id: id,
        ...metadata,
      });

      getExtension(
        id,
        function () {},
        function () {
          saveExtension({
            id: id,
            ...metadata,
          });
        },
        function () {
          if (
            !uniqueExtensions.value.some(
              (extension) =>
                extension.extension_type === metadata.extension_type
            ) &&
            metadata.lv === maxLv(metadata.rarity)
          ) {
            getUniqueExtensions();
          }
          callback(metadata);
        }
      );
    });
  }

  function loadAllProgress() {
    const percentage = (extensions.value.length / count.value) * 100;
    return percentage < 100 ? percentage : 100;
  }

  function allLoaded() {
    return extensions.value.length === count.value;
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;

      fetchExtensions();
    }
  }

  function nextPage() {
    if (currentPage.value <= count.value / limit.value) {
      currentPage.value++;

      fetchExtensions();
    }
  }

  function uniquePrevPage() {
    if (uniqueCurrentPage.value > 1) {
      uniqueCurrentPage.value--;

      fetchUniqueExtensions();
    }
  }

  function uniqueNextPage() {
    if (uniqueCurrentPage.value <= uniqueCount.value / limit.value) {
      uniqueCurrentPage.value++;

      fetchUniqueExtensions();
    }
  }

  function getExtension(
    tokenId,
    successCallback,
    notFoundCallback,
    alwaysCallback
  ) {
    initDB((extensionObjectStore) => {
      getFromDB(
        extensionObjectStore,
        tokenId,
        successCallback,
        notFoundCallback,
        alwaysCallback
      );
    });
  }

  function saveExtension(extension) {
    initDB((extensionObjectStore) => {
      addToDB(extensionObjectStore, extension);
    });
  }

  return {
    count,
    extensions,
    currentPage,
    uniqueCurrentPage,
    limit,
    uniqueCount,
    uniqueExtensions,
    viewExtensions,
    viewUniqueExtensions,
    loadingAll,
    order,
    selectedOrder,
    selectedRarity,
    init,
    initUnique,
    getUniqueExtensions,
    getOrder,
    getRarities,
    prevPage,
    nextPage,
    uniquePrevPage,
    uniqueNextPage,
    loadAll,
    loadAllProgress,
    loadAllStop,
    allLoaded,
    setRarity,
    setOrder,
  };
});
