using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Windows.Forms;

internal static class Launcher
{
    [STAThread]
    private static int Main(string[] args)
    {
        try
        {
            if (args.Length == 2 && args[0] == "--extract")
            {
                Extract(args[1]);
                return 0;
            }

            string folder = Path.Combine(Path.GetTempPath(), "SleepGuardian", Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(folder);
            string page = Path.Combine(folder, "SleepGuardian.html");
            Extract(page);
            Process.Start(new ProcessStartInfo(page) { UseShellExecute = true });
            return 0;
        }
        catch (Exception ex)
        {
            if (args.Length == 0)
                MessageBox.Show("无法打开离线演示。请用浏览器打开发布页提供的 SleepGuardian.html。\n\n" + ex.Message,
                    "夺机追梦者", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return 1;
        }
    }

    private static void Extract(string path)
    {
        using (Stream input = Assembly.GetExecutingAssembly().GetManifestResourceStream("SleepGuardian.html"))
        using (FileStream output = File.Create(path))
            input.CopyTo(output);
    }
}
