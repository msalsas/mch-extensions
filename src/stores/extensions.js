import { ref } from "vue";
import { defineStore } from "pinia";
import extensionMethod from "../helper/extensionMethod";
import extensionMetadata from "../helper/extensionMetadata";

export const useExtensionsStore = defineStore("extensions", () => {
    const extensions = ref([]);
    const count = ref(0);
    function fetchExtensions() {

        extensionMethod('totalSupply', (result) => {

            //count.value = result;
            count.value = 10;
            extensionMethod('tokenURIPrefix', (tokenURIPrefix) => {

                if (extensions.value.length >= count.value) {
                    return;
                }
                for (let i = 0; i < count.value; i++) {
                    extensionMethod('tokenByIndex', (id) => {

                        if (extensions.value.some(extension => extension.id === id)) {
                            return;
                        }
                        extensionMetadata(id, tokenURIPrefix, (metadata) => {

                            extensions.value.push({
                                'id': id,
                                ...metadata,
                            });
                        })
                    }, i)
                }
            });
        });
    }

    return { count, extensions, fetchExtensions };
});
