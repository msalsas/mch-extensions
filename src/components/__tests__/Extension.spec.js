import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Extension from "../Extension.vue";

const TEST_URL = "test_url";
const TEST_EXTERNAL_URL = "test_ext_url";
const IMAGE_URL = "image_url";

describe("Extension", () => {
  it("renders properly", () => {
    const wrapper = mount(Extension, {
      props: {
        type_name: "Brave Armor",
        lv: "55",
        hp: "34",
        phy: "11",
        int: "34",
        external_url: TEST_EXTERNAL_URL,
        extension_url: TEST_URL,
        image_url: IMAGE_URL,
      },
    });

    expect(wrapper.text()).toContain("Brave Armor");
    expect(wrapper.text()).toContain("Level: 55");
    expect(wrapper.text()).toContain("HP: 34");
    expect(wrapper.text()).toContain("PHY: 11");
    expect(wrapper.text()).toContain("INT: 34");
    expect(wrapper.html()).toContain(IMAGE_URL);
    expect(wrapper.html()).toContain(TEST_URL);
  });
});
