"use strict";

class Guardian {
  constructor(now = () => performance.now()) {
    this.now = now;
    this.phase = "idle";
    this.present = false;
    this.events = [];
    this.origin = now();
  }

  record(event, at = this.now()) {
    this.events.push({ seconds: ((at - this.origin) / 1000).toFixed(3), event });
  }

  start(seconds) {
    if (this.phase !== "idle" || !Number.isInteger(seconds) || seconds < 5 || seconds > 3600) return false;
    this.phase = "waiting";
    this.targetMs = seconds * 1000;
    this.record("session_started");
    return true;
  }

  put() {
    if (this.phase !== "waiting") return false;
    this.present = true;
    this.phase = "routine";
    this.started = this.now();
    this.deadline = this.started + this.targetMs;
    this.record("phone_placed", this.started);
    return true;
  }

  tick(at = this.now()) {
    if (this.phase === "routine" && at >= this.deadline) {
      this.phase = "complete";
      this.record("goal_reached", this.deadline);
    }
  }

  take() {
    this.tick();
    if (!this.present) return false;
    this.present = false;
    if (this.phase === "routine") this.phase = "stopped";
    this.record("phone_removed");
    return true;
  }

  fault() {
    this.tick();
    if (this.phase !== "waiting" && this.phase !== "routine") return false;
    this.phase = "fault";
    this.record("sensor_fault");
    return true;
  }

  remaining() {
    const at = this.now();
    this.tick(at);
    if (this.phase === "waiting") return this.targetMs;
    return this.phase === "routine" ? this.deadline - at : 0;
  }

  csv() {
    return "seconds,event,source\r\n" +
      this.events.map(({ seconds, event }) => [seconds, event, "simulation"].join(",")).join("\r\n") + "\r\n";
  }
}

if (typeof module !== "undefined") module.exports = Guardian;
