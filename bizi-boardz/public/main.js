const { app, BrowserWindow } = require("electron");

//require('@electron/remote/main').initialize()

function createWindow() {
  const win = new BrowserWindow({
    icon: "src/icons/bizi-b-circle.png",
    width: 1500,
    height: 600,
    minWidth: 1200,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      enableRemoteModule: true,
    },
  });
  win.maximize();
  win.loadURL("http://localhost:3000");
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length == 0) createWindow();
});
