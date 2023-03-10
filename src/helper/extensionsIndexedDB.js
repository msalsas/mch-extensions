function initDB(callback) {
  try {
    const dbName = "mch-extensions";

    if (typeof indexedDB === "undefined") {
      console.log("indexedDB is not defined");
      return;
    }

    const request = indexedDB.open(dbName, 1);

    request.onerror = (event) => {
      console.log(event);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(["extensions"], "readwrite");

      transaction.oncomplete = () => {};

      transaction.onerror = (event) => {
        console.log(event);
      };

      const extensionObjectStore = transaction.objectStore("extensions");

      callback(extensionObjectStore);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("extensions", { keyPath: "id" });

      if (objectStore.indexNames.contains("type_name")) {
        objectStore.deleteIndex("type_name");
      }
      if (objectStore.indexNames.contains("hp")) {
        objectStore.deleteIndex("hp");
      }
      if (objectStore.indexNames.contains("phy")) {
        objectStore.deleteIndex("phy");
      }
      if (objectStore.indexNames.contains("int")) {
        objectStore.deleteIndex("int");
      }
      if (objectStore.indexNames.contains("agi")) {
        objectStore.deleteIndex("int");
      }
      if (objectStore.indexNames.contains("rarity")) {
        objectStore.deleteIndex("int");
      }
      if (objectStore.indexNames.contains("is_max_lv")) {
        objectStore.deleteIndex("is_max_lv");
      }

      // Create an index to search extensions by type name. We may have duplicates
      // so we can't use a unique index.
      objectStore.createIndex("type_name", ["type_name", "is_max_lv"], {
        unique: false,
      });

      // Create an index to search extensions by hp.
      objectStore.createIndex("hp", ["hp", "is_max_lv"], { unique: false });

      // Create an index to search extensions by hp.
      objectStore.createIndex("phy", ["phy", "is_max_lv"], { unique: false });

      // Create an index to search extensions by int.
      objectStore.createIndex("int", ["int", "is_max_lv"], { unique: false });

      // Create an index to search extensions by agi.
      objectStore.createIndex("agi", ["agi", "is_max_lv"], { unique: false });

      // Create an index to search extensions by rarity.
      objectStore.createIndex("rarity", ["rarity", "is_max_lv"], {
        unique: false,
      });

      // Create an index to search extensions by is_max_lv.
      objectStore.createIndex("is_max_lv", "is_max_lv", { unique: false });

      // Use transaction oncomplete to make sure the objectStore creation is
      // finished before adding data into it.
      objectStore.transaction.oncomplete = () => {
        // Store values in the newly created objectStore.
        const extensionObjectStore = db
          .transaction("extensions", "readwrite")
          .objectStore("extensions");
        callback(extensionObjectStore);
      };
    };
  } catch (e) {
    console.log(e);
  }
}

function addToDB(extensionObjectStore, extension) {
  extensionObjectStore.add(extension);
}

function getFromDB(
  extensionObjectStore,
  tokenId,
  successCallback,
  notFoundCallback,
  alwaysCallback = function () {}
) {
  const request = extensionObjectStore.get(tokenId);

  request.onsuccess = () => {
    if (typeof request.result === "undefined") {
      notFoundCallback();
    } else {
      successCallback(request.result);
    }
    alwaysCallback();
  };
  request.onerror = () => {
    notFoundCallback();
    alwaysCallback();
  };
}

function getAll(extensionObjectStore, callback) {
  const extensions = [];
  extensionObjectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      extensions.push(cursor.value);
      cursor.continue();
    } else {
      callback(extensions);
    }
  };
}

function getUnique(
  extensionObjectStore,
  order = "hp",
  rarity = null,
  callback
) {
  const uniqueExtensions = [];
  const index = extensionObjectStore.index(order, "is_max_lv");
  index.openCursor(null, "prev").onsuccess = (event) => {
    const cursor = event.target.result;

    if (
      cursor &&
      !uniqueExtensions.some(
        (uniqueExtension) =>
          uniqueExtension.type_name === cursor.value.type_name
      ) &&
      ((rarity && cursor.value.rarity === rarity) || !rarity)
    ) {
      uniqueExtensions.push(cursor.value);
    } else {
      callback(uniqueExtensions);
    }

    if (cursor) {
      cursor.continue();
    }
  };
}

export { initDB, addToDB, getFromDB, getAll, getUnique };
