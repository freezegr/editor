class Subtitles {
    constructor() {
        this.data = null
        this.subtitles = null;
        this.selected = null;

        this.subsListElem = $(".subtitlesBoxFormsAll")
        this.textBoxElem = $('.textBox')
        this.videoElem = $(".video")
    }

    //init the class and add defautls subs
    init() {
        this.data = loadDefaultSubs();
        this.subsListElem.empty();
        this.subtitles = this.data.filter(x => x.section == "Events")[0].body
        this.addSubtitles({}, false)
    }

    //add titles
    openSubTitles(data) {
        document.title = data.filename;
        this.subsListElem.empty();
        this.data = data.subtitles;
        this.subtitles = data["subtitles"].filter(x => x.section == "Events")[0].body

        this.subtitles.forEach((x, count) => {
            x.value.count = count;
            this.addSubtitles(x.value)
        });

        let ProjectOpts = this.data.filter(x => x.section == "Aegisub Project Garbage");
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
    }

    selecte(count) {
        if (this.selected) this.selected.classList.remove("selected");
        this.selected = document.getElementsByClassName(`row-${count}`)[0];
        this.selected.classList.add("selected");
        let whotext = this.subtitles[count]

        if (whotext.value.Text != "") {
            this.textBoxElem.val(whotext.value.Text);
        }
        if (this.videoElem[0].src != '') {
            this.videoElem[0].currentTime = whotext.value.Start.split(':').reverse().reduce((prev, curr, i) => prev + curr * Math.pow(60, i), 0)
        };
    }

    addVideo(src){
        this.videoElem[0].src = src
    }

    addSubtitles(opts, isInTheSubtitles = true) {
        const { Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text, count } = opts
        if (Array.isArray(opts) == true) return;
        let text = `
        <tr class="row-${count ? count : this.subtitles.length}" onclick="subs.selecte(${count ? count : this.subtitles.length})">
          <td>${count ? count : this.subtitles.length}</td>
          <td>${Start ? Start : '00:00:00'}</td>
          <td>${End ? End : '00:00:01'}</td>
          <td>20</td>
          <td>${Style ? Style : "Default"}</td>
          <td>${Text ? Text : ' '}</td>
        </tr>`
        this.subsListElem.append(text);

        if (isInTheSubtitles == false) {
            this.subtitles.push({
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
    }
}