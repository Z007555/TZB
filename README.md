# 夺机追梦者 · 睡前守护系统

## PyBullet 三维演示版

基于原 Python 剧本重建机械臂和人物，自动演示手机抓取与收纳、拉被躺下、灯光渐暗和窗帘闭合。Windows 10/11 64 位双击 EXE 即可打开三维窗口。空格暂停，R 重播，Q 或 Esc 退出。

[三维版源码与说明](3d/) · [三维版 EXE 和源码包](https://github.com/Z007555/TZB/releases/tag/v0.4.0)

## 网页仿真版

V0.2 软件仿真，面向挑战杯科技发明制作 B 类。手机入托后开始计时，床头灯与窗帘同步联动。达标、提前取回或传感器异常都会结束计时和联动，用户可导出本轮事件。

## 下载运行

[GitHub 发布页](https://github.com/Z007555/TZB/releases)提供 Windows 可执行程序、离线网页和完整源码 ZIP。

- Windows 10/11 64 位：下载后双击 `SleepGuardian-Windows-x64.exe`，程序使用系统自带的 .NET Framework 4.x，在默认浏览器打开本机演示。无需联网、无需安装 Python 或 Node.js。
- 网页备用版：下载 `SleepGuardian.html` 后直接用现代浏览器打开。
- 源码版：下载 `SleepGuardian-v0.2.0-source.zip` 后解压，打开 `index.html`。在 Windows 上可用 `packaging/build.ps1` 重新打包。

## 演示操作


1. 保留默认的 15 秒，点击「开始自愿交存」，再点击「模拟放入」。
2. 等待目标达成，或点「立即取回」查看提前结束的记录。
3. 另开一轮，在手机已入托时模拟传感器故障，验证计时停止且取回按钮仍可用。
4. 点击「导出 CSV」保存本轮记录。刷新或重置会清空本轮数据。

开发验证用 Node.js 20+ 运行 `node --test controller.test.js`。核心计时采用单调时钟，开始计时以手机入托事件为准，达到目标以计算出的截止时刻记账。

## 项目结构

| 文件 | 职责 |
| --- | --- |
| `index.html`、`style.css` | 页面、床头场景和移动端布局 |
| `app.js` | 界面交互、计时进度、事件列表和 CSV 下载 |
| `controller.js` | 交存状态机、时间计算与事件记录 |
| `controller.test.js` | 正常达标、提前取回、故障及计时边界测试 |
| `packaging/` | 单文件 HTML 与 Windows 启动器的构建 |
| `.github/workflows/` | 在线演示与版本包发布 |

## 版本范围

- 本版实现网页状态机、模拟托盘和环境反馈、提前取回、故障停止及事件导出。
- 没有连接真实传感器、机械臂、窗帘或灯具。导出记录均标记 simulation。
- `legacy/夺机追梦者.py` 是用户提供的历史 PyBullet 场景源码。原始人物、机械臂和部分资源生成模块未随附件提供。该脚本与网页独立，保留原件备查。
- [参赛研究与验证计划](RESEARCH.md)包含案例对照、验证指标和软著归档说明。


