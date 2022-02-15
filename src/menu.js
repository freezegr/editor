const { dialog } = require('electron');
const { loadSubtitles } = require('./loadAss.js');
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
                    accelerator: 'CmdOrCtrl+o',
                    click: function () {
                        dialog.showOpenDialog({
                            filters: [
                                { name: 'ass/sass', extensions: ["ass", "sass"] }
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
                    label: 'Save'
                },
                {
                    label: 'Save as'
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












































// let template = [
//     {
//       label: 'file',
//       submenu: [
//         {
//           label: 'New Subtitles'
//         },
//         {
//           label: 'Open Subtitles',
//           accelerator: 'CmdOrCtrl+q',
//           click: function() {
//             dialog.showOpenDialog({
//               filters: [
//                 { name: 'Subtitles', extensions: ["ass", "sass"] }
//               ],
//             }).then(x => {
//               window.webContents.send('subtitles', loadSubtitles(x.filePaths))
//             })
//           }
//         },
//         {
//           label: 'save as'
//         },
//         {
//           label: 'save'
//         },
//         {
//           label: "Inpect element",
//           accelerator: 'CmdOrCtrl+Shift+c',
//           click: function(){
//             window.webContents.openDevTools()
//           }
//         }
//       ]
//     }
//   ];