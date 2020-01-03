import Race from './Race';
import Voter from './Voter';
import Candidate from './Candidate';
import VoteMethods from './Vote';

import { Setting, System, Threshold, States, InfoField } from './ElectionInterfaces';
import { Vote } from './VoteInterfaces';
import { Systems, Months } from './utils/definitions';
import { bold } from './utils/markdown';
import { state } from './utils/errors';

import Ballot from './irv/Ballot';
import Count from './irv/Count';
import Parse from './irv/Parse';

// An election is defined as a group of election parameters surrounding a set of 'races'

export default class Election {

	public id: string = '';

	public states: States = {
		register: false,
		candidates: false,
		voting: false,
		count: false
	}

	public get type() {
		let system = this.settings.system as Setting<string>;
		if (!system) throw 'Invalid settings';
		return system.value;
	}

	public get plural() {
		return Object.keys(this.races).length > 1 ? 's' : '';
	}

	public settings: {[key: string]: Setting<any>} = { //default settings
		name: {
			value: 'Election',
			definition: 'string',
			title: 'Title'
		} as Setting<string>,
		date: {
			value: new Date(Date.now()).getMonth(),
			definition: 'number',
			title: 'Date',
			conversion: (key: number) => Months[key],
		} as Setting<number>,
		system: {
			value: 'irv',
			definition: Systems.map((s: System) => s.name),
			title: 'Voting System',
			conversion: (key: string) => {
				let system = Systems.find(s => s.key === key);
				if (!system) throw 'Invalid key';
				return `[${system.name}](${system.href})`
			}
		} as Setting<string>,
		type: {
			value: 'multi',
			definition: ['multi', 'single'],
			title: 'Type of election'
		} as Setting<string>,
		ballotColour: {
			value: 15844367,
			definition: 'number',
			title: 'Default ballot colour'
		} as Setting<number>
	}

	public candidateThresholds: {[key: string]: Threshold<Candidate>} = {
		limit: {
			value: '1',
			title: 'Running limit',
			validate: (candidate) => !candidate.races || candidate.races.length < 1,
			error: 'Candidate is already running in a race'
		}
	}

	public ballotThresholds: {[key: string]: Threshold<Candidate>} = {
		sponsors: {
			key: 'sponsors',
			value: '3',
			title: 'Required sponsors',
			validate: (candidate) => Object.keys(candidate.sponsors).length >= 3,
			error: 'Candidate has not reached the requisite number of sponsors'
		}
	};

	public voterThresholds: {[key: string]: Threshold<Voter>} = {
		inactives: {
			value: 'true',
			title: 'Inactive members voting?',
			validate: (voter) => voter.active !== false,
			error: 'User is marked as inactive'
		}
	};
	
	public races: {
		[key: string]: Race
	} = {};
	
	public voters: {
		[key: string]: Voter
	} = {};
	
	public votes: {
		[key: string]: Vote
	} = {};

	public results?: {
		[key: string]: Count
	};

	constructor(id: string) {
		this.id = id;
		Voter.setThresholds(Object.values(this.voterThresholds));
		Candidate.setThresholds(Object.values(this.candidateThresholds));
	}

	private pendingPromises: Promise<any>[] = [];

	public resolve = (): Promise<void> => {
		return Promise.all(this.pendingPromises).then(() => {});
	}

	/* CONFIGURE SETTINGS */

	public editSetting(key: string, s: Setting<any>) {
		let prev = this.settings[key];
		if (prev.definition) {
			if (s.definition) throw 'Don\'t set new definition when editing a setting!';
			s.definition = prev.definition;
		}
		if (!s.title && prev.title) s.title = prev.title;
		if (typeof s.title !== 'string') throw 'Setting title must be a string';
		if (Array.isArray(s.definition)) {
			if (!s.definition.some(v => v === s.value)) throw 'Setting value must be one of ' + s.definition.join(',');
		} else {
			if (typeof s.value !== s.definition) throw 'Setting value must be type ' + s.definition;
		}
		this.settings[key] = s;
		return this;
	}

	public setRaceProperties(properties: string[]): Election {
		Race.setTransferredProperties(properties);
		return this;
	}

	public setVoterProperties(properties: string[]): Election {
		Voter.setTransferredProperties(properties);
		return this;
	}

	public setCandidateProperties(properties: string[]): Election {
		Candidate.setTransferredProperties(properties);
		return this;
	}

	public addVoterThreshold(key: string, t: Threshold<Voter>): Election {
		this.voterThresholds[key] = t;
		Voter.setThresholds(Object.values(this.voterThresholds));
		return this;
	}

	public editVoterThreshold(key: string, t: Threshold<Voter>) {
		if (!(key in this.voterThresholds)) throw 'Bad key threshold to edit ' + key;
		this.voterThresholds[key] = t;
		Voter.setThresholds(Object.values(this.voterThresholds));
		return this;
	}

	public addCandidateThreshold(key: string, t: Threshold<Candidate>) {
		this.candidateThresholds[key] = t;
		Candidate.setThresholds(Object.values(this.candidateThresholds));
		return this;
	}

	public editCandidateThreshold(key: string, t: Threshold<Candidate>) {
		if (!(key in this.candidateThresholds)) throw 'Bad key threshold to edit ' + key;
		this.candidateThresholds[key] = t;
		Candidate.setThresholds(Object.values(this.candidateThresholds));
		return this;
	}

	public get settingsObject(): {[key: string]: string} {
		return Object.entries(Object.assign({}, this.settings, this.candidateThresholds, this.voterThresholds))
			.reduce((acc: {[key: string]: string}, [k, v]) => {
				acc[k] = v.conversion ? v.conversion(v.value) : v.value.toString()
				return acc;
			}, {});		
	}

	public get settingsFields(): InfoField[] {
		let fields = [] as InfoField[];
		for (let s of Object.values(this.settings)) {
			fields.push({
				name: s.title,
				value: s.conversion ? s.conversion(s.value) : s.value.toString()
			})
		}
		for (let s of Object.values(this.candidateThresholds)) {
			fields.push({
				name: s.title,
				value: s.value
			})
		}		
		for (let s of Object.values(this.voterThresholds)) {
			fields.push({
				name: s.title,
				value: s.value
			})
		}
		fields.push({
			name: 'Elections',
			value: Object.values(this.races).map(r => bold(r.name)).join(' | ')
		})
		return fields;
	}

	private setState(key: keyof States, value: boolean): void {
		if (value && this.states[key] === value) throw 'Election was already in ' + key + 'state';
		if (!value && this.states[key] === value) throw 'Election was not in ' + key + 'state';
		this.states[key] = value;
	}

	private resetState(): void {
		for (let key of Object.keys(this.states)) {
			this.states[key as keyof States] = false;
		}
	}

	/* GENERATE VOTERS */

	public addRace(data: Race): Race {
		let race = new Race(data, this);
		this.races[race.id] = race;
		return race;
	}

	public addVoter(data: Voter): Voter {
		let voter = new Voter(data);
		this.voters[voter.id] = voter;
		return voter;
	}

	public getCounts(): {[key: string]: number} {
		let res = {} as {[key: string]: number};
		let voters = Object.values(this.voters);
		for (let race of Object.values(this.races)) {
			res[race.id] = voters.filter(v => v.isEligible(race.id)).length
		}
		return res;
	}

	public getVoters(raceID: string): Voter[] {
		if (!(raceID in this.races)) throw 'Couldn\'t find election ' + raceID;
		let voters = Object.values(this.voters);
		return voters.filter(v => v.isEligible(raceID))
	}

	public registerEligible(): Election {
		let voterKeys = Object.keys(this.voters);
		let races = Object.values(this.races);
		for (let key of voterKeys) {
			for (let r of races) {
				this.voters[key].registerEligible(r);
			}
		}
		this.setState('register', true);
		return this;
	}
	
	public deregisterEligible(): Election {
		let voterKeys = Object.keys(this.voters);
		let races = Object.values(this.races);
		for (let key of voterKeys) {
			for (let r of races) {
				this.voters[key].deregisterEligible(r.id);
			}
		}
		this.setState('register', false);
		return this;
	}

	/* Candidates */	

	public openNominations(): Election {
		this.setState('candidates', true);
		return this;
	}

	public closeNominations(): Election {
		this.setState('candidates', false);
		return this;
	}

	/* Voting */

	public openVoting(): Election {
		if (!this.states.register) throw 'Cannot initiate voting without voter registration.';
		if (this.states.candidates) throw 'Cannot initiate voting while candidate registration is still open.';
		this.setState('voting', true);
		return this;
	}

	public closeVoting(): Election {
		this.setState('voting', false);
		return this;
	}

	public generateTestBallot(voter: Voter, mobile: boolean, races: Race[]): {[key: string]: Ballot} {
		if (!this.states.register) throw state.register.ballots;
		if (!this.states.voting && mobile) throw state.voting.ballots;
		return this.generateBallotDict([voter], races);
	}

	public generateOneBallot(voter: Voter, mobile: boolean): {[key: string]: Ballot} {
		if (!this.states.voting && mobile) throw state.voting.ballots;
		let races = Object.keys(voter.votes).map(id => this.races[id]);
		return this.generateBallotDict([voter], races);
	}

	public generateAllBallots(real: boolean): {[key: string]: Ballot} {
		if (!this.states.register) throw state.register.ballots;
		if (real) {
			if (this.states.voting) throw state.voting.any;
			this.openVoting();
		}
		let voters = Object.values(this.voters);
		return this.generateBallotDict(voters, Object.values(this.races));
	}

	private generateBallotDict(voters: Voter[], races: Race[]): {[key: string]: Ballot} {
		return voters.reduce((acc: {[key: string]: Ballot}, curr: Voter) => {
			acc[curr.id] = new Ballot(curr, races, this);
			return acc;
		}, {});
	}

	public addVoteFromBallot(voter: Voter, data: string): Election {
		let {successes} = new VoteMethods(this).parseBallot(data, this.id, voter);
		successes.forEach((ballot) => this.addVote(voter, ballot));
		return this;
	}

	//Dangerous! No validation
	public addVote(voter: Voter, ballot: Parse): Election {
		if (voter.id !== ballot.voter) throw VoteMethods.prototype.reject('stolen');
		if (typeof ballot.votes[0] !== 'number') throw 'Invalid vote format\n' + JSON.stringify(ballot.votes, null, 4);
		if (!ballot.votes.slice(1).every(v => typeof v === 'string')) throw 'Invalid vote format\n' + JSON.stringify(ballot.votes, null, 4);
		this.setVote(ballot);
		return this;
	}

	private setVote(ballot: Parse) {
		this.votes[ballot.race + '.' + ballot.voter] = ballot.votes;
		this.races[ballot.race].validVotes[ballot.voter] = ballot.votes;
		this.voters[ballot.voter].votes[ballot.race] = ballot.votes;
	}

	public countVotes() {
		this.setState('register', false);
		this.setState('count', true);
		let results = {} as {[key: string]: Count};
		for (let [id, race] of Object.entries(this.races)) {
			let candidates = Object.keys(race.candidates);
			let votes = Object.values(race.validVotes).map(vote => vote.slice(1) as string[]);
			results[id] = new Count(candidates, votes);
		}
		this.results = results;
		return this;
	}

	/* Utility */

	public getRace(id: string): Race | undefined {
		if (this.races[id]) return this.races[id];
		return Object.values(this.races).find(r => r.name.toLowerCase().startsWith(id.toLowerCase()));
	}

	public getVoter(id: string): Voter | undefined {
		if (this.voters[id]) return this.voters[id];
		return Object.values(this.voters).find(v => v.name.toLowerCase().startsWith(id.toLowerCase()));
	}

	public toJSON(): Object {
		return {
			id: this.id,
			states: this.states,
			settings: this.settingsObject,
			races: this.races,
			results: this.results,
			voters: this.voters,
			votes: this.votes
		};
	}

}