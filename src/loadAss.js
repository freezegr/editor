const pareser = require("ass-parser");
const fs = require('fs');
const loadSubtitles = (path) => {
    const file =  fs.readFileSync(path, { encoding: "utf8" });
    const data = pareser(file, { comments: true })
    return data
}

module.exports.loadSubtitles = loadSubtitles;