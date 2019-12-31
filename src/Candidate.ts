import Voter from './Voter';
import Race from './Race';
import { Threshold } from './ElectionInterfaces';

export default class Candidate {

	static properties: string[] = [];
	static thresholds: Threshold<Candidate>[] = [];

	public id: string = '';
	public name: string = '';
	public sponsors: {
		[key: string]: Voter
	} = {};
	[key: string]: any;

	constructor(voter: Voter, public race: Race) {
		this.id = voter.id;
		this.name = voter.name;
		for (let p of Candidate.properties) {
			this[p] = voter[p];
		}
		for (let threshold of Candidate.thresholds) {
			if (!threshold.validate(this, race)) {
				throw `Candidate ${this.name} is not eligible for race ${race.name}\n${threshold.error}`;
			};
		}
	}

	static setTransferredProperties(properties: string[]): void {
		Candidate.properties = properties;
	}

	static setThresholds(thresholds: Threshold<Candidate>[]): void {
		Candidate.thresholds = thresholds;
	}

	public toJSON(): Object {
		let output = Object.assign({}, this);
		delete output.race;
		return output;
	}

}