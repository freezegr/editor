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

$('.textBox').bind('keydown', 'return', () => {
    if (!subs.selected) return;
    let currentSelected = parseInt(subs.selected.children[0].innerText);
    let all = subs.subtitles.length - 1;
    if(currentSelected == all) return;
    let nextId = $('.subtitlesBoxFormsAll').find('tr')[currentSelected].getAttribute('class').replace('row-', '')
    subs.selecte(nextId)
});

$(document).ready(function () {
    $("textarea").likeaboss();
});