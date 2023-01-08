import { ref } from "vue";
import { defineStore } from "pinia";
import extensionMethod from "../helper/extensionMethod";
import extensionMetadata from "../helper/extensionMetadata";

export const useExtensionsStore = defineStore("extensions", () => {
    const localStorageExtensions = localStorage.getItem('extensions') ? JSON.parse(localStorage.getItem('extensions')) : [];
    const localStorageUniqueExtensions = localStorage.getItem('uniqueExtensions') ? JSON.parse(localStorage.getItem('uniqueExtensions')) : [];
    const extensions = ref(localStorageExtensions);
    const uniqueExtensions = ref(localStorageUniqueExtensions);
    const viewExtensions = ref([]);
    const viewUniqueExtensions = ref([]);
    const count = ref(0);
    const tokenURIPrefix = ref('');
    const loadingAll = ref(false);
    const currentPage = ref(1);
    const uniqueCurrentPage = ref(1);
    const limit = ref(20);

    function maxLv(rarity) {
        switch (rarity) {
            case 'Common':
                return 60;
            case 'Uncommon':
                return 70;
            case 'Rare':
                return 80;
            case 'Epic':
                return 90;
            case 'Legendary':
                return 100;
        }

        console.log("No max level for rarity " + rarity);
    }

    function init() {
        totalSupply(() => {
            getTokenURIPrefix(() => { fetchExtensions() })
        });
    }

    function initUnique() {
        totalSupply(() => {
            getTokenURIPrefix(() => { fetchUniqueExtensions() })
        });
    }

    function totalSupply(callback = () => {}) {
        extensionMethod('totalSupply', (result) => {
            count.value = result;

            callback();
        });
    }

    function getTokenURIPrefix(callback = () => {}) {
        extensionMethod('tokenURIPrefix', (tokenPrefix) => {
            tokenURIPrefix.value = tokenPrefix;

            callback();
        });
    }

    function loadAll() {
        loadingAll.value = true;
        for (let i = 0; i < count.value; i++) {
            setTimeout(() => {
                extensionMethod('tokenByIndex', (id) => {
                    if (extensions.value.some(extension => extension.id === id)) {
                        return;
                    }

                    console.log('Loading metadata for ' + id)

                    saveMetadata(id);
                }, i);
            }, 1000 * i);
        }
    }

    function fetchExtensions() {
        let loopCount = 0;
        for (let i = (currentPage.value - 1) * limit.value; i < (currentPage.value - 1) * limit.value + limit.value; i++) {
            extensionMethod('tokenByIndex', (id) => {

                if (extensions.value.some(extension => extension.id === id)) {
                    viewExtensions.value[loopCount++] = extensions.value.find(extension => extension.id === id);
                    return;
                }

                saveMetadata(id, (metadata) => {
                    viewExtensions.value[loopCount++] = {
                        'id': id,
                        ...metadata,
                    };
                });
            }, i)
        }
    }

    function fetchUniqueExtensions() {
        let loopCount = 0;
        for (let i = (uniqueCurrentPage.value - 1) * limit.value; i < (uniqueCurrentPage.value - 1) * limit.value + limit.value; i++) {
            if (typeof uniqueExtensions.value[i] !== "undefined") {
                viewUniqueExtensions.value[loopCount++] = uniqueExtensions.value[i];
            }
        }
    }

    function saveMetadata(id, callback = (metadata) => {}) {
        extensionMetadata(id, tokenURIPrefix.value, (metadata) => {

            extensions.value.push({
                'id': id,
                ...metadata,
            });
            localStorage.setItem('extensions', JSON.stringify(extensions.value));

            if (!uniqueExtensions.value.some(extension => extension.extension_type === metadata.extension_type) &&
                metadata.lv === maxLv(metadata.rarity)) {
                uniqueExtensions.value.push({
                    'id': id,
                    ...metadata,
                });
                localStorage.setItem('uniqueExtensions', JSON.stringify(uniqueExtensions.value));
            }

            callback(metadata);
        })
    }

    function loadAllProgress() {
        return extensions.value.length / count.value * 100;
    }

    function prevPage() {
        if (currentPage.value > 1) {
            currentPage.value--;

            fetchExtensions()
        }
    }

    function nextPage() {
        if (currentPage.value <= count.value/limit.value) {
            currentPage.value++;

            fetchExtensions()
        }
    }

    function uniquePrevPage() {
        if (uniqueCurrentPage.value > 1) {
            uniqueCurrentPage.value--;

            fetchUniqueExtensions()
        }
    }

    function uniqueNextPage() {
        if (uniqueCurrentPage.value <= getCountUnique()/limit.value) {
            uniqueCurrentPage.value++;

            fetchUniqueExtensions()
        }
    }

    function getCountUnique() {
        return uniqueExtensions.value.length;
    }

    return { count, extensions, currentPage, uniqueCurrentPage, limit, uniqueExtensions, viewExtensions, viewUniqueExtensions, loadingAll, getCountUnique, init, initUnique, prevPage, nextPage, uniquePrevPage, uniqueNextPage, loadAll, loadAllProgress };
});
