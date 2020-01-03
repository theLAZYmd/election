const fs = require('fs');
const path = require('path');
const Election = require('../lib/Election').default;
const { randBetween, combine, shuffle } = require('../lib/utils/maths');
const { randomElement } = require('../lib/utils/prototype');

const ids = require('./data/userIDs.json');
const { firstNames, lastNames } = require('./data/names.json');

Function.prototype.toJSON = Function.prototype.toString;

function generateID() {
	return randBetween(10 ** 9, 10 ** 10).toString() + randBetween(10 ** 9, 10 ** 10).toString();
}

const races = [
	{
		id: generateID(),
		name: "crazyhouse",
		candidateNumber: 3
	},
	{
		id: generateID(),
		name: "960",
		candidateNumber: 2
	},
	{
		id: generateID(),
		name: "antichess",
		candidateNumber: 6
	}
];

let election = new Election(generateID())
	.setVoterProperties([
		'messages',
		'active',
		'roles'
	])
	.addVoterThreshold('messages', {
		value: '100',
		title: 'Required messages',
		validate: (voter) => voter.messages >= 100
	})
	.addVoterThreshold('role', {
		value: 'voting',
		title: 'Corresponding role for voters',
		validate: (voter, race) => voter.roles.some(r => r.toLowerCase() === race.name.toLowerCase())
	})	
	.addVoterThreshold('duplicates', {
		value: 'true',
		title: 'Exclude duplicate accounts?',
		validate: (voter) => !voter.roles.some(r => r.toLowerCase() === 'bank')
	});
for (let r of races) election.addRace(r);

/* Registering voters */

let channelPossibilities = [];
for (let i = 1; i <= races.length; i++) channelPossibilities.push(...combine(races.map(c => c.name), i));
for (let i = 0; i <= 3; i++) channelPossibilities.push(...combine(races.map(c => c.name), 3));

for (let i = 0; i < ids.length; i++) election.addVoter({
	id: ids[i],
	name: firstNames[i] + lastNames[i] + '#' + Math.random().toString().slice(2, 6),
	messages: randBetween(80, 180),
	active: Math.random() > 0.2,
	roles: channelPossibilities[randBetween(0, channelPossibilities.length - 1)]
});

election.registerEligible();

/* Registering candidates */

election.openNominations();

for (let r of races) {
	r.race = election.getRace(r.id);
	let candidates = Object.keys(r.race.candidates);
	let count = Math.min(r.candidateNumber, r.race.eligibleVoters.length - candidates.length);
	for (let i = 0; i < count; i++) {
		let selected = null;
		while (!selected) {
			selected = r.race.getRandomVoter(candidates);
			if (selected.id in r.race.candidates) selected = null;
		}
		r.race.upgradeToCandidate(selected);
	}
}

election.closeNominations();

/* Voting */

let ballots = election.generateAllBallots(true);

for (let r of races) {
	r.votePossibilities = [];
	for (let i = 0; i <= r.race.candidatesLength; i++)
		r.votePossibilities.push(...combine(Object.keys(r.race.candidates), i));
}

for (let r of races) {
	let voters = r.race.eligibleVoters;
	for (let v of voters) {
		let votes = [Date.now(), ...shuffle(randomElement(r.votePossibilities))];
		election.addVote(v, {
			race: r.race.id,
			voter: v.id,
			votes
		});
	}
}

election.closeVoting();

election.countVotes();

fs.writeFileSync(path.join(__dirname, 'data', 'ballots.json'), JSON.stringify(ballots, null, 4));
fs.writeFileSync(path.join(__dirname, 'data', 'election.json'), JSON.stringify(election, null, 4));