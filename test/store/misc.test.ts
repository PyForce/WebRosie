import { describe, expect, it } from "vitest";

import { addPathPoint, clearPath, clearReport, configOption, notifyReport, pathSlice, reportSlice, settingsSlice } from "../../src/store/misc";

describe("settings", () => {
  const initial = settingsSlice.reducer(undefined, { type: "init" });

  it("starts at 0.2 m/s with the planner on, and the joystick on touch screens", () => {
    expect(initial).toEqual({
      single: { speed: 0.2, planner: true },
      path: { speed: 0.2, planner: true },
      manual: { joystick: "touch" },
    });
  });

  it("changes only the given groups", () => {
    const changed = settingsSlice.reducer(initial, configOption({ single: { speed: 0.5, planner: false } }));
    expect(changed).toEqual({ ...initial, single: { speed: 0.5, planner: false } });
  });
});

describe("path", () => {
  it("adds points in order and clears them", () => {
    let path = pathSlice.reducer(undefined, addPathPoint([1, 0]));
    path = pathSlice.reducer(path, addPathPoint([1, 1]));
    expect(path).toEqual([[1, 0], [1, 1]]);
    expect(pathSlice.reducer(path, clearPath())).toEqual([]);
  });
});

describe("report", () => {
  it("shows a message until cleared", () => {
    const report = reportSlice.reducer(null, notifyReport({ text: "no route", level: "warning" }));
    expect(report).toEqual({ text: "no route", level: "warning" });
    expect(reportSlice.reducer(report, clearReport())).toBeNull();
  });
});
