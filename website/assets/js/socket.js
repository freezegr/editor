const { ipcRenderer, remote, ipcMain } = require('electron');

let subs = new Subtitles();
subs.init();

ipcRenderer.on('subtitles', (event, data) => {
    subs.openSubTitles(data);
});

ipcRenderer.on('videoOpen', (event, data) => {
    subs.addVideo(data);
});

ipcRenderer.on('saveFileAs', () => {
    ipcRenderer.send('exportsAss', subs.data)
});

$('.textBox').bind('keydown', 'ctrl+return', () => {
    if (!subs.selected) return;
    let text = $('.textBox').val()
    let count = parseInt(subs.selected.children[0].innerText)
    let whotext = subs.subtitles[count]
    if (!whotext) return;
    subs.subtitles[count].value.Text = text
    subs.selected.children[5].innerText = text
});

$('.textBox').bind('keydown', 'return', (e) => {
    e.preventDefault();
    var msg = $(".textBox").val().replace("\n", "");
    if (msg == "") {
        $(".textBox").val("");
    }
});

$(document).ready(function () {
    $("textarea").likeaboss();
});
