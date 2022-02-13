const { ipcRenderer } = require('electron');

ipcRenderer.on('subtitles', (event, data) => {
    const subttitles = data.filter(x => x.section == "Events")[0].body
    const elem = document.getElementsByClassName('subtitlesBoxFormsAll');
    $(".subtitlesBoxFormsAll").empty()
    subttitles.forEach((x, count) => {
        x.value.count = count
        let txt = addSubtitles(x.value)
        $(".subtitlesBoxFormsAll").append(txt);
        console.log(addSubtitles(x.value))
    });
});

function active(count){
    let elem = document.getElementsByClassName(`row-${count}`);
    console.log(elem)
};

function addSubtitles(opts){
    if(!opts.Start) return false;
    
    let text = `
      <tr class="row-${opts.count}" onclick="active(${opts.count})">
        <td>${opts.count}</td>
        <td>${opts.Start}</td>
        <td>${opts.End}</td>
        <td>20</td>
        <td>${opts.Style}</td>
        <td>${opts[Object.keys(opts)[Object.keys(opts).length - 2]]}</td>
      </tr>
    `
    return text;
}

//<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
//<script src="assets/js/socket.js"></script>