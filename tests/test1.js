const fs = require('fs');
const path = require('path');
const Election = require('../dist/Election').default;
const { randBetween } = require('../dist/utils/maths');

const names = require('./names.json');

Function.prototype.toJSON = Function.prototype.toString;

const crazyhouse = {
	id: randBetween(10 ** 9, 10 ** 10).toString() + randBetween(10 ** 9, 10 ** 10).toString(),
	name: "crazyhouse"
};
const nineSixty = {
	id: randBetween(10 ** 9, 10 ** 10).toString() + randBetween(10 ** 9, 10 ** 10).toString(),
	name: "960"
};
const antichess =  {
	id: randBetween(10 ** 9, 10 ** 10).toString() + randBetween(10 ** 9, 10 ** 10).toString(),
	name: "antichess"
};

let election = new Election(Math.random().toString(16).slice(2))
	.setVoterProperties([
		'messages',
		'active',
		'roles'
	])
	.addVoterThreshold({
		key: 'messages',
		value: '100',
		title: 'Required messages',
		validate: (voter) => voter.messages >= 100
	})
	.addVoterThreshold({
		key: 'role',
		value: 'voting',
		title: 'Corresponding role for voters',
		validate: (voter, race) => voter.roles.some(r => r.toLowerCase() === race.name.toLowerCase())
	})	
	.addVoterThreshold({
		key: 'duplicates',
		value: 'true',
		title: 'Exclude duplicate accounts?',
		validate: (voter) => !voter.roles.some(r => r.toLowerCase() === 'bank')
	})
	.addRace(crazyhouse)
	.addRace(nineSixty)
	.addRace(antichess);

for (let n of names) election.addVoter({
		id: n,
		name: n,
		messages: randBetween(80, 180),
		active: Math.random() > 0.2,
		roles: ['crazyhouse', '960', 'antichess']
	});

election.registerEligible()
	.addVoter({
		id: '259383384109744138',
		name: 'Mark Plotkin#1754',
		messages: 1080,
		active: true,
		roles: ['crazyhouse']
	})
	.addVoter({
		id: '373480715276517376',
		name: 'bakkouz#7251',
		messages: 560,
		active: true,
		roles: ['crazyhouse', 'antichess']
	})
	.addVoter({
		id: '319901088557957122',
		name: 'okei#1207',
		messages: randBetween(500, 1000),
		active: true,
		roles: ['crazyhouse', 'antichess', '960']
	})
	.addVoter({
		id: '163325840136863744',
		name: 'ProgramFOX#1012',
		messages: randBetween(500, 1000),
		active: true,
		roles: ['crazyhouse', 'antichess', '960']
	})
	.addVoter({
		id: '330193848137678848',
		name: 'ijh#0966',
		messages: randBetween(500, 1000),
		active: true,
		roles: ['crazyhouse', 'antichess', '960']
	})
	.addVoter({
		id: '133249411303211008',
		name: 'Raven#9079',
		messages: randBetween(500, 1000),
		active: true,
		roles: ['crazyhouse', 'antichess', '960']
	})
	.addVoter({
		id: '303609777756438529',
		name: 'Andrew#5850',
		messages: randBetween(500, 1000),
		active: true,
		roles: ['crazyhouse', 'antichess', '960']
	})
	.addVoter({
		id: '325736595980288010',
		name: 'hauptschule#7105',
		messages: randBetween(500, 1000),
		active: true,
		roles: ['crazyhouse', 'antichess', '960']
	});

election.openNominations();

election.getRace(crazyhouse.id)
	.upgradeToCandidate(election.getVoter('Mark Plotkin'))
	.upgradeToCandidate(election.getVoter('bakkouz'));
election.getRace(nineSixty.id)
	.upgradeToCandidate(election.getVoter('okei'));
election.getRace(antichess.id)
	.upgradeToCandidate(election.getVoter('programfox'))
	.upgradeToCandidate(election.getVoter('ijh'))
	.upgradeToCandidate(election.getVoter('raven'))
	.upgradeToCandidate(election.getVoter('andrew'))
	.upgradeToCandidate(election.getVoter('haupt'));

election.closeNominations();

let ballots = election.generateAllBallots(true);

fs.writeFileSync(path.join(__dirname, './election.json'), JSON.stringify(election, null, 4));
fs.writeFileSync(path.join(__dirname, './ballots.json'), JSON.stringify(ballots, null, 4));