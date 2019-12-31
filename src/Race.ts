import { Vote } from './VoteInterfaces';
import Candidate from './Candidate';
import Voter from './Voter';
import Election from './Election';

export default class Race {

	static properties: string[] = [];

	public id: string = '';
	public name: string = '';
	public candidates: {
		[key: string]: Candidate
	} = {};
	public validVotes: {
		[key: string]: Vote
	} = {};
	[key: string]: any;

	constructor(data: Race, public election: Election) {
		this.id = data.id;
		this.name = data.name;
		for (let p of Race.properties) {
			this[p] = data[p];
		}
	}

	static setTransferredProperties(properties: string[]): void {
		Race.properties = properties;
	}

	public upgradeToCandidate(voter: Voter): Race {
		if (voter.id in this.candidates) throw 'Already registered candidate ' + voter.name + ' in race ' + this.name;
		let candidate = new Candidate(voter, this);
		this.candidates[candidate.id] = candidate;
		if (!voter.races) voter.races = [];
		voter.races.push(this.id);
		this.election.voters[voter.id].races = voter.races;
		return this;
	}

	public disqualifyCandidate(candidateID: string): Race {
		if (!(candidateID in this.candidates)) throw 'Couldn\'t find candidate ' + candidateID + ' in race ' + this.name;
		return this;
	}

	public sponsor(candidate: Candidate, voter: Voter): Race {
		if (voter.id === candidate.id) throw `${voter.name} cannot not sponsor self`;
		if (!voter.isEligible(this.id)) throw `${voter.name} is not a member of the electorate.\nCannot declare sponsorship for candidate ${candidate.name} in race ${this.name}`;
		if (Object.values(this.candidates).some(c => voter.id in c.sponsors)) throw `${voter.name} has already declared sponsorship in race ${this.name}`;
		this.candidates[candidate.id].sponsors[voter.id] = voter;
		return this;
	}

	public unsponsor(candidate: Candidate, voter: Voter): Race {
		if (voter.id === candidate.id) throw 'Invalid request';
		if (!voter.isEligible(this.id)) throw `${voter.name} is not a member of the electorate.`;
		if (!(voter.id in candidate.sponsors)) throw `${voter.name} had not sponsored ${candidate.name} in race ${this.name}`;
		delete this.candidates[candidate.id].sponsors[voter.id];
		return this;
	}

	public toJSON(): Object {
		let output = Object.assign({}, this);
		delete output.election;
		return output;
	}

}