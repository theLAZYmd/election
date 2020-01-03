import Election from '../Election';
import Race from '../Race';
import Voter from '../Voter';
import { description } from './Data';
import Candidate from '../Candidate';
import { Threshold, Field, Setting } from '../ElectionInterfaces';
import { shuffle } from '../utils/maths';

export default class Ballot {

	static properties: string[] = [];
	static thresholds: Threshold<Candidate>[] = []

	static url: string = '';
	static footer: string = '';

	static setURL(url: string): void { this.url = url; }
	static setFooter(footer: string): void { this.footer = footer; }

	constructor(private voter: Voter, private races: Race[], private election: Election) {}
	
	get title(): string {
		console.log(this.election.settings);
		let name = (this.election.settings.name as Setting<string>).value || 'Election';
		let date = (this.election.settings.date as Setting<number>).value;
		if (!date) throw 'Election date must be defined';
		return name + ': ' + date;
	}

	get url(): string {
		return Ballot.url;
	}

	get description(): string {
		return '- ' + description.join('\n- ');
	}

	get fields(): Field[] {
		let fields = [] as Field[];
		for (let r of this.races) {
			let candidates = Object.values(r.candidates).filter((c) => {
				for (let threshold of Ballot.thresholds) {
					if (!threshold.validate(c, r)) return false;
				}
				return true;
			});
			let votingString = shuffle(candidates).map((c) => '[] ' + c.name + '\n').join('');
			fields.push({
				name: `#${r.name} Ballot:`,
				value: '```css\n' +
					`#VoterID: ${this.voter.id}\n` +
					`#ElectionID: ${this.election.id}\n` +
					`#Channel: ${r.name}\n` +
					`${votingString}` +
					'[] Write-In\n' +
					'[] Blank Vote```',
				inline: false
			});
		}
		return fields;
	}

	get footer(): string {
		return Ballot.footer;
	}

	get color(): number {
		if (this.voter.color) return this.voter.color;
		if (this.election.settings.color) return this.election.settings.color.value;
		return 0;
	}

	toJSON() {
		return {
			title: this.title,
			url: this.url,
			description: this.description,
			fields: this.fields,
			footer: this.footer,
			color: this.color
		};
	}

}