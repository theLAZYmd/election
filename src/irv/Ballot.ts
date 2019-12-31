import Election from '../Election';
import Race from '../Race';
import Voter from '../Voter';
import { description } from './Data';
import Candidate from '../Candidate';
import { Threshold, Field } from '../ElectionInterfaces';
import { shuffle } from '../utils/maths';

export default class Ballot {

	static properties: string[] = [];
	static thresholds: Threshold<Candidate>[] = []

	static title: string = '';
	static url: string = '';
	static footer: string = '';
	static color: number = 0;

	static setTitle(title: string): void { this.title = title; }
	static setURL(url: string): void { this.url = url; }
	static setFooter(footer: string): void { this.footer = footer; }
	static setColor(color: number): void { this.color = color; }

	constructor(private voter: Voter, private races: Race[], private election: Election) {}
	
	get title(): string {
		let date = this.election.settings.find(s => s.key === 'date');
		if (!date) throw 'Election date must be defined';
		return Ballot.title + ': ' + date.value;
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
			let votingString = shuffle(candidates).map((c) => '[] ' + c.name).join('\n');
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
		return Ballot.color;
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