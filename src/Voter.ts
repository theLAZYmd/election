import { Vote } from "./VoteInterfaces";
import Race from './Race';
import { Threshold } from "./ElectionInterfaces";

export default class Voter {

	static properties: string[] = [];
	static thresholds: Threshold<Voter>[] = []

	public id: string = '';
	public name: string = '';
	public votes: {
		[key: string]: Vote
	} = {};
	public races?: string[];
	public active?: boolean;
	[key: string]: any;

	constructor(voter: Voter) {
		this.id = voter.id;
		this.name = voter.name;
		for (let p of Voter.properties) {
			this[p] = voter[p];
		}
	}

	static setTransferredProperties(properties: string[]) {
		Voter.properties = properties;
	}

	static setThresholds(thresholds: Threshold<Voter>[]) {
		Voter.thresholds = thresholds;
	}

	public registerEligible(race: Race): boolean {
		for (let threshold of Voter.thresholds) {
			if (!threshold.validate(this, race)) {
				if (this.votes[race.id]) delete this.votes[race.id];
				return false;
			};
		}
		this.votes[race.id] = null as unknown as Vote;
		return true;
	}

	public deregisterEligible(raceID: string): void {
		if (this.votes[raceID]) delete this.votes[raceID];
	}

	public isEligible(raceID: string) {
		return raceID in this.votes;
	}

	public disqualify(raceID?: string) {
		if (raceID) {
			if (!(raceID in this.votes)) throw `Voter ${name} was not eligible for race ${raceID}`;
			delete this.votes[raceID];
		} else {
			for (let race of Object.keys(this.votes)) {
				delete this.votes[race];
			}
		}
	}

	public addVote(raceID: string, vote: Vote) {
		if (!(raceID in this.votes)) throw `Voter ${name} is not eligible for race ${raceID}`;
		this.votes[raceID] = vote;
	}

}