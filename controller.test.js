"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const Guardian = require("./controller.js");

test("starts timing only after placement and counts the exact deadline once", () => {
  let now = 0;
  const guard = new Guardian(() => now);
  assert.equal(guard.put(), false);
  assert.equal(guard.start(5), true);
  now = 30000;
  assert.equal(guard.remaining(), 5000);
  guard.put();
  now = 37000;
  guard.tick();
  guard.tick();
  assert.equal(guard.phase, "complete");
  assert.deepEqual(guard.events.at(-1), { seconds: "35.000", event: "goal_reached" });
  assert.equal(guard.take(), true);
  assert.equal(guard.take(), false);
  assert.equal(guard.events.filter(({event}) => event === "goal_reached").length, 1);
});

test("early retrieval cancels the routine", () => {
  let now = 0;
  const guard = new Guardian(() => now);
  guard.start(5);
  guard.put();
  guard.take();
  now = 9000;
  guard.tick();
  assert.equal(guard.phase, "stopped");
  assert.match(guard.csv(), /phone_removed,simulation/);
  assert.doesNotMatch(guard.csv(), /goal_reached/);
});

test("fault halts routine while preserving immediate retrieval", () => {
  let now = 0;
  const guard = new Guardian(() => now);
  guard.start(5);
  guard.put();
  guard.fault();
  now = 9000;
  assert.equal(guard.remaining(), 0);
  assert.equal(guard.take(), true);
  assert.equal(guard.phase, "fault");
  assert.doesNotMatch(guard.csv(), /goal_reached/);
});

test("rejects invalid goals and overlapping starts", () => {
  const guard = new Guardian(() => 0);
  for (const goal of [4, 3601, 5.1, NaN, "10"]) assert.equal(guard.start(goal), false);
  assert.equal(guard.start(10), true);
  assert.equal(guard.start(12), false);
});
