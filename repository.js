const fs = require('fs');

//TODO: refactor this if we use JSON DB library
function readJsonFile(){
try {
    let rawdata = fs.readFileSync('./data/db.json');
    return JSON.parse(rawdata);
} catch (err) {
    console.log(err);
}
}

function saveJsonFile(json){
    fs.writeFileSync('./data/db.json', JSON.stringify(json));
}

module.exports = { readJsonFile, saveJsonFile };