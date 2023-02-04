function initDB(callback) {
    try {
        const dbName = "mdh-extensions";

        const request = indexedDB.open(dbName, 1);

        request.onerror = (event) => {
            // Handle errors.
            console.log(event)
        };
        request.onsuccess = (event) => {
            const db = event.target.result;

            const transaction = db.transaction(["extensions"], "readwrite");

            transaction.oncomplete = (event) => {
                console.log("All done!");
            };

            transaction.onerror = (event) => {
                // Don't forget to handle errors!
                console.log(event);
            };

            const extensionObjectStore = transaction.objectStore("extensions");

            callback(extensionObjectStore);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create an objectStore to hold information about our extensions. We're
            // going to use "tokenId" as our key path because it's guaranteed to be
            // unique.
            const objectStore = db.createObjectStore("extensions", { keyPath: "id" });

            // Create an index to search extensions by type name. We may have duplicates
            // so we can't use a unique index.
            objectStore.createIndex("type_name", "type_name", { unique: false });

            // Create an index to search extensions by hp.
            objectStore.createIndex("hp", "hp", { unique: false });

            // Create an index to search extensions by hp.
            objectStore.createIndex("phy", "phy", { unique: false });

            // Create an index to search extensions by int.
            objectStore.createIndex("int", "int", { unique: false });

            // Create an index to search extensions by agi.
            objectStore.createIndex("agi", "agi", { unique: false });

            // Create an index to search extensions by rarity.
            objectStore.createIndex("rarity", "rarity", { unique: false });

            // Create an index to search extensions by is_max_lv.
            objectStore.createIndex("is_max_lv", "is_max_lv", { unique: false });

            // Use transaction oncomplete to make sure the objectStore creation is
            // finished before adding data into it.
            objectStore.transaction.oncomplete = (event) => {
                // Store values in the newly created objectStore.
                const extensionObjectStore = db.transaction("extensions", "readwrite").objectStore("extensions");
                callback(extensionObjectStore);
            };
        };

    } catch (e) {
        console.log(e)
    }
}

function addToDB(extensionObjectStore, extension) {
    extensionObjectStore.add(extension);
}

function getFromDB(extensionObjectStore, tokenId, callback) {
    const request = extensionObjectStore.get(tokenId);

    request.onsuccess = (event) => {
        callback(request.result);
    };
    request.onerror = (event) => {
        console.log(event);
    };
}

export {initDB, addToDB, getFromDB};