import { describe, expect, it } from "vitest";

import { makeStore } from "../../src/store";
import { setMode } from "../../src/store/mode";

describe("store", () => {
  it("starts with every piece of state", () => {
    expect(Object.keys(makeStore().getState()).sort()).toEqual(
      ["direction", "map", "mode", "path", "report", "robots", "settings", "trajectory"],
    );
  });

  it("turns manual mode on", () => {
    const store = makeStore();
    store.dispatch(setMode({ mode: "manual", value: true }));
    expect(store.getState().mode.manual).toBe(true);
  });
});
