const { dialog } = require('electron');
const { loadSubtitles } = require('./loadAss.js');

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
                                { name: 'Subtitles', extensions: ["ass", "sass"] }
                            ],
                        }).then(x => {
                            window.webContents.send('subtitles', loadSubtitles(x.filePaths[0]))
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
                    accelerator: 'CmdOrCtrl+Shift+c',
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
                    label: "Open Video"
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