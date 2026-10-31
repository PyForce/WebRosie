import { describe, expect, it } from "vitest";

import { modeSlice, setMode } from "../../src/store/mode";
import { selectRobot } from "../../src/store/robots";

const reduce = modeSlice.reducer;
const NONE = { single: false, path: false, manual: false };

describe("mode", () => {
  it("starts with no mode", () => {
    expect(reduce(undefined, { type: "init" })).toEqual(NONE);
  });

  it("turns manual mode on", () => {
    expect(reduce(undefined, setMode({ mode: "manual", value: true })).manual).toBe(true);
  });

  it("keeps one mode at a time", () => {
    expect(reduce({ ...NONE, manual: true }, setMode({ mode: "path", value: true }))).toEqual({ ...NONE, path: true });
  });

  it("turns a mode off", () => {
    expect(reduce({ ...NONE, single: true }, setMode({ mode: "single", value: false }))).toEqual(NONE);
  });

  it("leaves every mode when the robot is deselected", () => {
    expect(reduce({ ...NONE, manual: true }, selectRobot(null))).toEqual(NONE);
  });

  it("keeps the mode when another robot is selected", () => {
    expect(reduce({ ...NONE, manual: true }, selectRobot("localhost:5000"))).toEqual({ ...NONE, manual: true });
  });
});
