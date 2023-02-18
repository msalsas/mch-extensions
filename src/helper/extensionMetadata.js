export default function extensionMetadata(id, tokenURIPrefix, callback) {
  (async () => {
    try {
      const url = tokenURIPrefix + id;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const {
            attributes,
            description,
            external_url,
            extra_data,
            home_url,
            image_url,
            language,
            name,
          } = data;
          const {
            lv,
            hp,
            phy,
            int,
            agi,
            rarity,
            total_volume,
            transfer,
            type_name,
            volume,
          } = attributes;
          const {
            extension_type,
            alias,
            art,
            art_image_url,
            default_image_url,
          } = extra_data;

          const metadata = {
            description: description,
            external_url: external_url.replace("landSectors", "land-sectors"),
            home_url: home_url,
            image_url: image_url,
            language: language,
            name: name,
            lv: lv,
            hp: hp,
            phy: phy,
            int: int,
            agi: agi,
            rarity: rarity,
            total_volume: total_volume,
            transfer: transfer,
            type_name: type_name,
            volume: volume,
            extension_type: extension_type,
            extension_url:
              "https://www.mycryptoheroes.net/dictionary/extensions/" +
              extension_type,
            alias: alias,
            art: art,
            art_image_url: art_image_url,
            default_image_url: default_image_url,
          };

          callback(metadata);
        });
    } catch (e) {
      console.log(e);
    }
  })();
}
