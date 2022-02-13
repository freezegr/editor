const { app, BrowserWindow, Menu, dialog } = require('electron');
const menus =  require('./src/menu.js');

function createWindow () {
  let mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  })
  mainWindow.maximize()
  mainWindow.loadFile('./website/index.html')
  return mainWindow
}

app.whenReady().then(() => {
  let window = createWindow();

  const template = menus(window)
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});
