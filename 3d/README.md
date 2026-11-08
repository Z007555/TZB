# 夺机追梦者｜PyBullet 三维卧室演示

动画从睡前提醒开始，依次展示机械臂伸向手机、夹爪收紧、手机入托、人物拉被躺下、灯光渐暗和窗帘闭合。机械臂和人物模型按原 Python 剧本重建，抓取与收纳由时间轴驱动。

## Windows 可执行程序

在 [三维版发布页](https://github.com/Z007555/TZB/releases/tag/v0.4.0) 下载 `SleepGuardian-3D-Windows-x64.exe`。Windows 10/11 64 位双击即可启动独立三维窗口，动画自动播放。程序内含运行依赖，可离线使用。语音使用 Windows 本地语音引擎。

| 操作 | 按键 |
| --- | --- |
| 暂停或继续 | 空格 |
| 选择仰卧、侧卧、俯卧 | 1 / 2 / 3 |
| 午夜家人来电与急用取机 | E |
| 从头重播 | R |
| 退出 | Q 或 Esc |

## 从源码运行

```powershell
python -m pip install pybullet numpy pillow
python .\夺机追梦者.py
```

也可以用 conda-forge 安装预编译的 Windows 依赖：

```powershell
conda create -n sleep-guardian -c conda-forge python=3.13 pybullet numpy pillow pyinstaller
conda activate sleep-guardian
python .\夺机追梦者.py --mute
.\build.ps1
```

用 `--capture --times 0 22.4 25.5 37.8 41 --output renders` 导出关键帧。Windows 构建脚本会用成品 EXE 渲染同一组关键帧，通过后才发布。

离线渲染午夜剧情可加 --pose prone --emergency。三种姿势参数为 supine、side、prone。

