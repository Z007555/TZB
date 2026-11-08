"use strict";

class Guardian {
  constructor(now = () => performance.now()) {
    this.now = now;
    this.phase = "idle";
    this.present = false;
    this.events = [];
    this.origin = now();
    this.ended = null;
  }

  record(event, at = this.now()) {
    this.events.push({ seconds: ((at - this.origin) / 1000).toFixed(3), event });
  }

  start(seconds) {
    if (this.phase !== "idle" || !Number.isInteger(seconds) || seconds < 5 || seconds > 3600) return false;
    this.phase = "waiting";
    this.targetMs = seconds * 1000;
    this.origin = this.now();
    this.record("session_started", this.origin);
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
      this.ended = this.deadline;
      this.record("goal_reached", this.deadline);
    }
  }

  take() {
    const at = this.now();
    this.tick(at);
    if (!this.present) return false;
    this.present = false;
    if (this.phase === "routine") {
      this.phase = "stopped";
      this.ended = at;
    }
    this.record("phone_removed", at);
    return true;
  }

  fault() {
    const at = this.now();
    this.tick(at);
    if (this.phase !== "waiting" && this.phase !== "routine") return false;
    this.phase = "fault";
    this.ended = at;
    this.record("sensor_fault", at);
    return true;
  }

  remaining(at = this.now()) {
    this.tick(at);
    if (this.phase === "waiting") return this.targetMs;
    return this.phase === "routine" ? this.deadline - at : 0;
  }

  csv() {
    return "seconds,event,source\r\n" +
      this.events.map(({ seconds, event }) => [seconds, event, "simulation"].join(",")).join("\r\n") + "\r\n";
  }

  elapsed(at = this.now()) {
    this.tick(at);
    return this.started === undefined ? 0 : Math.max(0, (this.ended ?? at) - this.started);
  }
}

if (typeof module !== "undefined") module.exports = Guardian;
