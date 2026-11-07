"use strict";

const byId = (id) => document.getElementById(id);
let guardian = new Guardian();
let drawnEvents = 0;
const labels = {
  idle: "设定目标后开始", waiting: "等待用户主动放入手机", routine: "计时中 · 模拟暖光已开启",
  complete: "已达到本轮目标", stopped: "提前取回，本轮已结束", fault: "传感器故障，计时已停止"
};
const eventLabels = {
  session_started: "开启一轮交存", phone_placed: "模拟手机入托", goal_reached: "达到离屏目标",
  phone_removed: "模拟取回手机", sensor_fault: "模拟传感器故障"
};

function render() {
  const seconds = Math.ceil(guardian.remaining() / 1000);
  byId("clock").textContent = [Math.floor(seconds / 60), seconds % 60].map((n) => String(n).padStart(2, "0")).join(":");
  const phase = guardian.phase;
  const status = byId("state");
  if (status.textContent !== labels[phase]) status.textContent = labels[phase];
  byId("device").textContent = guardian.present ? "手机仍在托盘，可直接取回" : "托盘为空";
  byId("tray").dataset.present = guardian.present;
  byId("tray").dataset.routine = phase === "routine";
  byId("put").disabled = phase !== "waiting";
  byId("take").disabled = !guardian.present;
  byId("fault").disabled = phase !== "waiting" && phase !== "routine";
  byId("reset").disabled = phase === "idle" || guardian.present;
  byId("target").disabled = phase !== "idle";
  byId("start").querySelector("button").disabled = phase !== "idle";
  byId("export").disabled = guardian.events.length === 0;
  for (const event of guardian.events.slice(drawnEvents)) {
    const row = document.createElement("li");
    row.textContent = "+" + event.seconds + " 秒 · " + eventLabels[event.event];
    byId("events").append(row);
  }
  drawnEvents = guardian.events.length;
}

byId("start").addEventListener("submit", (event) => {
  event.preventDefault();
  guardian.start(byId("target").valueAsNumber);
  render();
});
byId("put").onclick = () => { guardian.put(); render(); };
byId("take").onclick = () => { guardian.take(); render(); };
byId("fault").onclick = () => { guardian.fault(); render(); };
byId("reset").onclick = () => {
  guardian = new Guardian();
  drawnEvents = 0;
  byId("events").replaceChildren();
  render();
};
byId("export").onclick = () => {
  render();
  const url = URL.createObjectURL(new Blob([guardian.csv()], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "sleep-guardian-simulation.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
render();
setInterval(render, 200);
