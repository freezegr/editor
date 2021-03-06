const { dialog } = require('electron');
const { loadSubtitles } = require('./loadAss.js');
const { exportsTitles } = require('./exportsTitles.js');
const path = require("path");

const menus = (window) => {
    return template = [
        {
            label: 'file',
            submenu: [
                {
                    label: 'New Subtitles'
                },
                {
                    label: 'Open Subtitles',
                    accelerator: 'CmdOrCtrl+O',
                    click: function () {
                        dialog.showOpenDialog({
                            filters: [
                                { name: 'Open ass/ssa', extensions: ["ass", "sass"] }
                            ],
                        }).then(x => {
                            let data = {
                                filename: path.basename(x.filePaths[0]),
                                subtitles: loadSubtitles(x.filePaths[0])
                            }
                            window.webContents.send('subtitles', data)
                        })
                    }
                },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: function() {
                        window.webContents.send('saveFileAs')
                    }
                },
                {
                    label: 'Save as',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: function() {
                        window.webContents.send('saveFileAs')
                    }
                },
                {
                    label: "Inpect element",
                    accelerator: 'CmdOrCtrl+Shift+C',
                    click: function () {
                        window.webContents.openDevTools()
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: "Cut Line",
                    accelerator: 'CmdOrCtrl+x',
                },
                {
                    label: "Copy Line",
                    accelerator: 'CmdOrCtrl+c',
                },
                {
                    label: "Paste Line",
                    accelerator: 'CmdOrCtrl+v',
                },
                {
                    label: "Find",
                    accelerator: 'CmdOrCtrl+f',
                }
            ]
        },
        {
            label: 'Video',
            submenu: [
                {
                    label: "Open Video",
                    accelerator: 'CmdOrCtrl+O+V',
                    click: function(){
                        dialog.showOpenDialog({
                            filters: [
                                { name: 'mp4/mkv', extensions: ["mkv", "mp4"] }
                            ],
                        }).then(x => {
                            window.webContents.send('videoOpen', x.filePaths[0])
                        })
                    }
                },
                {
                    label: "Close Video"
                },
            ]
        },
        {
            label: 'help',
            submenu: [
                {
                    label: 'Settings'
                },
                {
                    label: "Webite"
                },
                {
                    label: "About"
                }
            ]
        }
    ];
}

module.exports = menus