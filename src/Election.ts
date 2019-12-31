import { Setting, System, Threshold, States, InfoField } from "./ElectionInterfaces";
import { Systems } from './utils/definitions';
import { bold } from './utils/markdown';
import Race from './Race';
import Voter from './Voter';
import Vote from './Vote';
import Candidate from './Candidate';
import { state } from "./utils/errors";
import Ballot from "./irv/Ballot";

// An election is defined as a group of election parameters surrounding a set of 'races' or 'results'

export default class Election {

	public id: string = '';

	public states: States = {
		register: false,
		candidates: false,
		voting: false,
		count: false,
		results: false
	}

	public get type() {
		let system = this.settings.find(s => s.key === 'system');
		if (!system) throw 'Invalid settings';
		return system.value || '';
	}

	public get plural() {
		return Object.keys(this.races).length > 1 ? 's' : '';
	}

	public settings: Setting<any>[] = [ //default settings
		{
			key: 'date',
			value: new Date(Date.now()).getMonth(),
			definition: 'number',
			title: 'Date'
		} as Setting<number>,
		{
			key: 'system',
			value: 'irv',
			definition: Systems.map((s: System) => s.name),
			title: 'Voting System',
			conversion: (key: string) => {
				let system = Systems.find(s => s.key === key);
				if (!system) throw 'Invalid key';
				return `[${system.name}](${system.href})`
			}
		} as Setting<string>,
		{
			key: 'type',
			value: 'multi',
			definition: ['multi', 'single'],
			title: 'Type of election'
		} as Setting<string>
	];

	public candidateThresholds: Threshold<Candidate>[] = [
		{
			key: 'limit',
			value: '1',
			title: 'Running limit',
			validate: (candidate) => !candidate.races || candidate.races.length < 1,
			error: 'Candidate is already running in a race'
		}
	];

	public ballotThresholds: Threshold<Candidate>[] = [
		{
			key: 'sponsors',
			value: '3',
			title: 'Required sponsors',
			validate: (candidate) => Object.keys(candidate.sponsors).length >= 3,
			error: 'Candidate has not reached the requisite number of sponsors'
		}
	];

	public voterThresholds: Threshold<Voter>[] = [
		{
			key: 'inactives',
			value: 'true',
			title: 'Inactive members voting?',
			validate: (voter) => voter.active !== false,
			error: 'User is marked as inactive'
		}
	];
	
	public races: {
		[key: string]: Race
	} = {};
	
	public voters: {
		[key: string]: Voter
	} = {};
	
	public votes: {
		[key: string]: Vote
	} = {};

	constructor(id: string) {
		this.id = id;
		Voter.setThresholds(this.voterThresholds);
		Candidate.setThresholds(this.candidateThresholds);
	}

	/* CONFIGURE SETTINGS */

	public editSetting(key: string, s: Setting<any>) {
		let index = this.settings.findIndex(v => v.key === key);
		if (index === -1) throw 'Bad key setting to edit ' + key;
		let prev = this.settings[index];
		if (!s.key) s.key = key;
		if (typeof prev.definition === 'string' && prev.definition !== s.definition) throw 'Bad definition ' + s.definition + ' for setting ' + prev.title;
		if (Array.isArray(prev.definition) && JSON.stringify(prev.definition) !== JSON.stringify(s.definition)) throw 'Bad definition ' + s.definition + ' for setting ' + prev.title;
		if (typeof s.title !== 'string') throw 'Setting title must be a string';
		if (Array.isArray(s.definition)) {
			if (!s.definition.some(v => v === s.value)) throw 'Setting value must be one of ' + s.definition.join(',');
		} else {
			if (typeof s.value !== s.definition) throw 'Setting value must be type ' + s.definition;
		}
		this.settings[index] = s;
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

	public addVoterThreshold(t: Threshold<Voter>): Election {
		this.voterThresholds.push(t);
		Voter.setThresholds(this.voterThresholds);
		return this;
	}

	public editVoterThreshold(key: string, t: Threshold<Voter>) {
		let index = this.voterThresholds.findIndex(v => v.key === key);
		if (index === -1) throw 'Bad key threshold to edit ' + key;
		this.voterThresholds[index] = t;
		Voter.setThresholds(this.voterThresholds);
		return this;
	}

	public addCandidateThreshold(t: Threshold<Candidate>) {
		this.candidateThresholds.push(t);
		Candidate.setThresholds(this.candidateThresholds);
		return this;
	}

	public editCandidateThreshold(key: string, t: Threshold<Candidate>) {
		let index = this.candidateThresholds.findIndex(v => v.key === key);
		if (index === -1) throw 'Bad key threshold to edit ' + key;
		this.candidateThresholds[index] = t;
		Candidate.setThresholds(this.candidateThresholds);
		return this;
	}

	public generateSettings(): InfoField[] {
		let fields = [] as InfoField[];
		for (let s of this.settings) {
			fields.push({
				name: s.title,
				value: s.conversion ? s.conversion(s.value) : s.value.toString()
			})
		}
		for (let s of this.candidateThresholds) {
			fields.push({
				name: s.title,
				value: s.value
			})
		}		
		for (let s of this.voterThresholds) {
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

	public addRace(data: Race): Election {
		let race = new Race(data, this);
		this.races[race.id] = race;
		return this;
	}

	public addVoter(data: Voter): Election {
		let voter = new Voter(data);
		this.voters[voter.id] = voter;
		return this;
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

	public sendTestBallot(voter: Voter, mobile: boolean, races: Race[]): Ballot {
		if (!this.states.register) throw state.register.ballots;
		if (!this.states.voting && mobile) throw state.voting.ballots;
		return this.sendBallot([voter], races)[0];
	}

	public sendOneBallot(voter: Voter, mobile: boolean): Ballot {
		if (!this.states.voting && mobile) throw state.voting.ballots;
		let races = Object.keys(voter.votes).map(id => this.races[id]);
		return this.sendBallot([voter], races)[0];
	}

	public sendAllBallots(real: boolean): Ballot[] {
		if (!this.states.register) throw state.register.ballots;
		if (real) {
			if (this.states.voting) throw state.voting.any;
			this.openVoting();
		}
		let voters = Object.values(this.voters);
		return this.sendBallot(voters, Object.values(this.races));
	}

	public sendBallot(voters: Voter[], races: Race[]): Ballot[] {
		return voters.map((voter) => new Ballot(voter, races, this));
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
			settings: this.generateSettings(),
			races: this.races,
			voters: this.voters,
			votes: this.votes
		};
	}

}