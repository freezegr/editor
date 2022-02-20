const { app, BrowserWindow, Menu, ipcMain, dialog, nativeTheme } = require('electron');
const menus = require('./src/menu.js');
const path = require('path');
const { exportsTitles } = require('./src/exportsTitles.js');
const fs = require("fs");

function createWindow() {
  let mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    icon:'./assets/appICon.ico',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  mainWindow.maximize()
  mainWindow.loadFile('./website/index.html')
  return mainWindow
}

app.whenReady().then(() => {
  let window = createWindow();
  const template = menus(window)
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

ipcMain.on("exportsAss", (event, data) => {
  dialog.showSaveDialog({
    title: 'Select the File Path to save',
    buttonLabel: 'Save',
    defaultPath: path.join(__dirname, '/subtitles.ass'),
    filters: [
      {
        name: 'ass/ssa',
        extensions: ['ass']
      },
    ],
    properties: []
  }).then(file => {
    if (!file.canceled) {
      fs.writeFile(file.filePath.toString(), exportsTitles(data), function (err) {
        if (err) throw err;
      });
    }
  }).catch(err => {
    console.log(err)
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});
