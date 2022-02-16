const { ipcRenderer, remote, ipcMain } = require('electron');

let titles; 
let datas;

ipcRenderer.on('subtitles', (event, data) => {
    document.title = data.filename;
    const elem = document.getElementsByClassName('subtitlesBoxFormsAll');
    $(".subtitlesBoxFormsAll").empty()
    titles = data["subtitles"].filter(x => x.section == "Events")[0].body
    datas = data.subtitles
    console.log(titles)
    titles.forEach((x, count) => {
        x.value.count = count
        addSubtitles(x.value)
    });
});

ipcRenderer.on('videoOpen', (event, data) => {
  $(".video")[0].src = data;
});

ipcRenderer.on('saveFileAs', () => {
  ipcRenderer.send('exportsAss', datas)
});

//8umisou stathi na baleis kapoia stigmi otan einai to idio row na min kanei tpt
let selected; 
function active(count){
    if(selected) selected.classList.remove("selected");
    selected = document.getElementsByClassName(`row-${count}`)[0];
    selected.classList.add("selected")
    let textBox = document.getElementsByClassName("textBox")
    let whotext = titles[count]
    $(".textBox").val(whotext.value.Text);
    if($(".video")[0].src != ''){
      //'01:20'.split(':').reverse().reduce((prev, curr, i) => prev + curr*Math.pow(60, i), 0)
      $(".video")[0].currentTime = whotext.value.Start.split(':').reverse().reduce((prev, curr, i) => prev + curr*Math.pow(60, i), 0)

    };
};

function addSubtitles(opts, isInTheSubtitles = true){
  const { Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text, count} = opts
  if(Array.isArray(opts) == true) return;
  let text = `
      <tr class="row-${count ? count : titles.length}" onclick="active(${count ? count : titles.length})">
        <td>${count ? count : titles.length}</td>
        <td>${Start ? Start: '00:00:00'}</td>
        <td>${End ? End: '00:00:01'}</td>
        <td>20</td>
        <td>${Style ? Style: "Default"}</td>
        <td>${Text ? Text: ' '}</td>
      </tr>
      `
    $(".subtitlesBoxFormsAll").append(text);
    if(isInTheSubtitles == false){
      titles.push({
        key: "Dialogue",
        value: {
          "Layer": "10",
          "Start": Start ? Start: '00:00:00',
          "End": End ? End: '00:00:01',
          "Style": Style ? Style: "Default",
          "Name": Name ? Name: "ector",
          "MarginL": MarginL ? MarginL: "0",
          "MarginR": MarginR ? MarginR: "0",
          "MarginV": MarginV ? MarginV: "0",
          "Effect": "",
          "Text": Text ? Text: '',
          "count": 4
        }
      })
    } 
}

//<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
//<script src="assets/js/socket.js"></script>
//<script src="highlight-ta.js"></script>
//<script src="highlight-ta-proto.js"></script>