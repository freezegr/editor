const { ipcRenderer, remote, ipcMain } = require('electron');

let titles;
let datas = loadDefaultSubs();
titles = datas.filter(x => x.section == "Events")[0].body
addSubtitles({}, false)

ipcRenderer.on('subtitles', (event, data) => {
  document.title = data.filename;
  const elem = document.getElementsByClassName('subtitlesBoxFormsAll');
  $(".subtitlesBoxFormsAll").empty()
  titles = data["subtitles"].filter(x => x.section == "Events")[0].body
  datas = data.subtitles
  titles.forEach((x, count) => {
    x.value.count = count
    addSubtitles(x.value)
  });

  let ProjectOpts = datas.filter(x => x.section == "Aegisub Project Garbage");
  if (ProjectOpts.length != 0 && ProjectOpts[0].body.filter(l => l.key == "Video File").length != 0 && ProjectOpts[0].body.filter(l => l.key == "Video File")[0].value != undefined) {
    $.confirm({
      title: 'Confirm!',
      content: 'Thery are a video do you want load it',
      buttons: {
        cancel: function () {
          //do nothing
        },
        confirm: function () {
          $(".video")[0].src = ProjectOpts[0].body.filter(l => l.key == "Video File")[0].value;
        }
      }
    });
  }
});

ipcRenderer.on('videoOpen', (event, data) => {
  $(".video")[0].src = data;
});

ipcRenderer.on('saveFileAs', () => {
  ipcRenderer.send('exportsAss', datas)
});

//8umisou stathi na baleis kapoia stigmi otan einai to idio row na min kanei tpt
let selected;
function active(count) {
  if (selected) selected.classList.remove("selected");
  selected = document.getElementsByClassName(`row-${count}`)[0];
  selected.classList.add("selected")
  let textBox = document.getElementsByClassName("textBox")
  let whotext = titles[count]
  if(whotext.value.Text != ""){
    $(".textBox").val(whotext.value.Text);
  }
  

  if ($(".video")[0].src != '') {
    //'01:20'.split(':').reverse().reduce((prev, curr, i) => prev + curr*Math.pow(60, i), 0)
    $(".video")[0].currentTime = whotext.value.Start.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0)

  };
};

function addSubtitles(opts, isInTheSubtitles = true) {
  const { Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text, count } = opts
  if (Array.isArray(opts) == true) return;
  let text = `
      <tr class="row-${count ? count : titles.length}" onclick="active(${count ? count : titles.length})">
        <td>${count ? count : titles.length}</td>
        <td>${Start ? Start : '00:00:00'}</td>
        <td>${End ? End : '00:00:01'}</td>
        <td>20</td>
        <td>${Style ? Style : "Default"}</td>
        <td>${Text ? Text : ' '}</td>
      </tr>
      `
  $(".subtitlesBoxFormsAll").append(text);
  if (isInTheSubtitles == false) {
    titles.push({
      key: "Dialogue",
      value: {
        "Layer": "10",
        "Start": Start ? Start : '00:00:00',
        "End": End ? End : '00:00:01',
        "Style": Style ? Style : "Default",
        "Name": Name ? Name : "ector",
        "MarginL": MarginL ? MarginL : "0",
        "MarginR": MarginR ? MarginR : "0",
        "MarginV": MarginV ? MarginV : "0",
        "Effect": "",
        "Text": Text ? Text : '',
        "count": 4
      }
    })
  }
};
$('.textBox').bind('keydown', 'return', (e) => {
  e.preventDefault();
  var msg = $(".textBox").val().replace("\n", "");
  if (msg == "") {
    $(".textBox").val("");
  }
});

$('.textBox').bind('keydown', 'ctrl+return', () => {
  if(!selected) return;
  let text = $('.textBox').val()
  let count = parseInt(selected.children[0].innerText)
  let whotext = titles[count]
  if(!whotext) return;
  titles[count].value.Text = text
  selected.children[5].innerText = text
});

$(document).ready(function(){
  $("textarea").likeaboss();
});

//<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
//<script src="assets/js/socket.js"></script>
//<script src="highlight-ta.js"></script>
//<script src="highlight-ta-proto.js"></script>