const IRV = require('../dist/irv/Count').default;
const { randBetween, combine, shuffle } = require('../dist/utils/maths');
const fs = require('fs');
const path = require('path');

function generateCandidates(n) {
	let arr = [];
	for (let i = 0; i < n; i++) {
		let id = randBetween(10 ** 9, 10 ** 10).toString() + randBetween(10 ** 9, 10 ** 10).toString();
		arr.push(id);
	}
	return arr;
}

const c = 5;
let candidates = generateCandidates(c);
let votePossibilities = [];

for (let i = 0; i <= c; i++) {
	votePossibilities.push(...combine(candidates, i))
}

function generateVotes(n) {
	let arr = [];
	for (let i = 0; i < n; i++) {
		let number = randBetween(0, votePossibilities.length - 1);
		arr.push(shuffle(votePossibilities[number]));
	}
	return arr;
}

let votes = [];// generateVotes(200);

//IRV.setWinnerThreshold(2);
//IRV.useSTV();
let trial = new IRV(candidates, votes);

fs.writeFileSync(path.join(__dirname, 'data', 'irv.json'), JSON.stringify(trial, null, 4));