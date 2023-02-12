import { describe, it, expect, vi } from "vitest";
import { createTestingPinia } from '@pinia/testing'

// import any store you want to interact with in tests
import { useExtensionsStore } from "../../stores/extensions";

import { mount } from "@vue/test-utils";
import Extensions from "../Extensions.vue";

describe("Extensions", () => {
  it("renders properly", () => {
    const wrapper = mount(Extensions, {  global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
        })],
      }
    });

    expect(wrapper.text()).toContain("0 extensions");

    // TODO: Functional tests
  });
});
