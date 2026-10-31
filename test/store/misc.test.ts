import { describe, expect, it } from "vitest";

import { addPathPoint, clearPath, clearReport, configOption, notifyReport, pathSlice, reportSlice, settingsSlice } from "../../src/store/misc";

describe("settings", () => {
  const initial = settingsSlice.reducer(undefined, { type: "init" });

  it("starts with 5 s gotos, 2 s per path point and the joystick on touch screens", () => {
    expect(initial).toEqual({ single: { time: 5, planner: false }, path: { delay: 2 }, manual: { joystick: "touch" } });
  });

  it("changes only the given groups", () => {
    const changed = settingsSlice.reducer(initial, configOption({ single: { time: 3, planner: true } }));
    expect(changed).toEqual({ ...initial, single: { time: 3, planner: true } });
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
