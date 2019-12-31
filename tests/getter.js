const fs = require('fs');
const path = require('path');
const votes = require('./data.json');

let election = votes['314155682033041408'];
let es = election.elections;
let names = Object.keys(es.crazyhouse.voters);

fs.writeFileSync(path.join(__dirname, 'names.json'), JSON.stringify(names, null, 4));