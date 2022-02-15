const { ipcRenderer, remote } = require('electron');

let titles; 

ipcRenderer.on('subtitles', (event, data) => {
    document.title = data.filename;
    const subttitles = data["subtitles"].filter(x => x.section == "Events")[0].body
    const elem = document.getElementsByClassName('subtitlesBoxFormsAll');
    $(".subtitlesBoxFormsAll").empty()
    titles = subttitles
    subttitles.forEach((x, count) => {
        x.value.count = count
        let txt = addSubtitles(x.value)
        $(".subtitlesBoxFormsAll").append(txt);
    });
});

ipcRenderer.on('videoOpen', (event, data) => {
  $(".video")[0].src = data;
});

ipcRenderer.on('saveFileAs', (event, data) => {
  exportsTitles()
});

//8umisou stathi na baleis kapoia stigmi otan einai to idio row na min kanei tpt
let selected; 
function active(count){
    if(selected) selected.classList.remove("selected");
    selected = document.getElementsByClassName(`row-${count}`)[0];
    selected.classList.add("selected")
    let textBox = document.getElementsByClassName("textBox")
    let whotext = titles[count]
    console.log(whotext.value.Text)
    $(".textBox").val(whotext.value.Text);
    console.log(whotext.value)
    if($(".video")[0].src != ''){
      //'01:20'.split(':').reverse().reduce((prev, curr, i) => prev + curr*Math.pow(60, i), 0)
      $(".video")[0].currentTime = whotext.value.Start.split(':').reverse().reduce((prev, curr, i) => prev + curr*Math.pow(60, i), 0)

    };
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

const exportsTitles = (data) => {
  let str = '';
  data.forEach(x => {
      str += `[${x.section}]\n`
      x.body.forEach((l, count) => {
          if(l.type == "comment"){
              str += "; " + l.value + "\n"
          } else if(l.key){
              if(typeof l.value == "string"){
                  str += `${l.key}: ${l.value}\n`
              } else if(typeof l.value == "object"){
                  let val = Object.values(l.value).join()
                  str += `${l.key}: ${val}\n`
              }
          }
          if(x.body.length == count+1) str += '\n'
      })
  });

  const {dialog} = require('electron');
  let fs = require('fs');
  fs.writeFileSync()
  return str
}

//<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
//<script src="assets/js/socket.js"></script>
//<script src="highlight-ta.js"></script>
//<script src="highlight-ta-proto.js"></script>