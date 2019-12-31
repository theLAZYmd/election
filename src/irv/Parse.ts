import regexes from '../utils/regexes';
import Voter from '../Voter';
import Settings from '../Election';
import { Vote, Outcome, VotingErrors } from '../VoteInterfaces';

export default class Parse {

	constructor(private data: string) {}

	public outcome: 'fulfilled' | 'rejected' | '' = ''
	public status: Outcome | keyof VotingErrors = '';
	public message: string = '';

	setOutcome(outcome: 'fulfilled' | 'rejected' | ''): Parse {
		this.outcome = outcome;
		return this;
	}

	setStatus(status: Outcome | keyof VotingErrors): Parse {
		this.status = status;
		return this;
	}

	setMessage(status: string): Parse {
		this.message = status;
		return this;
	}

	//IDs to identify vote, server and channel of the this.ballot.

	private _matches?: string[];
	get ids(): string[] { // returns an array of the three ex: ['185412969130229760', '314155682033041408', 'racing-kings']
		if (this._matches) return this._matches;
		let matches = this.data.match(regexes.ballotHeader) || [];
		return this._matches = matches.slice(1);
	}

	get voter(): string {
		return this.ids[0];
	}

	get election(): string {
		return this.ids[1];
	}

	get race(): string {
		return this.ids[2];
	}

	//Vote information

	// returns an array of voting lines ['[1] samoyd#2402', '[] Gopnik#4031', '[2] okei#1207', '[] Write-In', '[3] Blank Vote']
	private _lines?: string[]
	get lines(): string[] {
		if (this._lines) return this._lines;
		return this._lines = this.data.match(regexes.ballotVote) || [];
	}

	// returns nested arrays of each lines placings vs name [['1', samoyd#2402'], ['', 'Gopnik#4031'], ['2', okei#1207'], ['', 'Write-In'], ['3', 'Blank Vote']]
	private _raw?: [string, string][]
	get raw(): [string, string][] {
		if (!this._raw) this._raw = this.lines.map(line => (line.match(regexes.ballotLine) || []).slice(1) as [string, string]);
		return this._raw;
	}

	private _votes?: Vote
	get votes(): Vote {
		if (this._votes) return this._votes;
		this._votes = [Date.now()];
		for (let [index, tag] of this.raw) try {
			if (!parseInt(index)) continue;	//this is where unfilled lines are ignored
			this._votes[parseInt(index)] = tag === 'Blank Vote' ? 'blank' : tag;
		} catch (e) {
			console.error(e);
		}
		return this._votes;
	}

	//returns a boolean whether a checkbox was filled in with a [0] vote
	//we set it to false. If a string has magically appeared in its place, return true
	//error checking
	get zeroes(): boolean {
		return typeof this.votes[0] === 'number';
	}

	//whether someone wrote a [1] or number in the Write-In box without changing the name
	get writeIn(): boolean {
		return this.votes.some(v => v === 'Write-In');
	}

	//whether the votes were done in ascending order
	get ascending(): boolean {
		return this.votes.slice(1).every(v => typeof v === 'string');
	}

	//whether the same number was used for more than one option, for instance: [['1', samoyd#2402'], ['1', okei#1207']]
	get duplicates(): boolean {
		let obj = {} as {[key: string]: boolean};
		for (let [index] of this.raw) {
			if (!index) continue;
			if (obj[index]) return true;
			else obj[index] = true;
		}
		return false;
	}

	//whether the voter decline to fill in any preferences
	get spoiled(): boolean {
		return this.votes.length === 1;
	}


	//Got to account for all the 'edge cases' a user might possibly be able to do to the ballot
	public validate(server: string, voter: Voter, election: Settings): Promise<Outcome> {
		try {
			if (this.voter !== voter.id) throw 'stolen';				//changed voterID (perhaps to another user)
			if (!server) throw 'noGuild';															//changed serverID to other 18 digit code (for whatever reason)
			if (!election.states.voting) throw 'state';					//voting period has closed
			if (!election.type) throw 'state';
			if (!(this.race in election.races)) throw 'noElection';
			let race = election.races[this.race];					//changed channel (election) name to something invalid
			if (!(this.voter in race.voters)) throw 'ineligible';		//changed channel name to other election not eligible for
			if (this.zeroes) throw 'zeroes';							//added a zero [0] option
			if (this.writeIn) throw 'badWriteIn';						//added a number [1] to 'Wrote-In'
			if (this.duplicates) throw 'duplicates';					//wrote the same number next to more than one
			if (!this.ascending) throw 'badOrder';						//added a zero [0] option
			
			//Check if candidates are still in the server live
			//let votes = this.votes
			//	.filter(vote => !vote || vote === 'blank' || this.Search.users.byTag(vote))					//so the this.votes[0] = false gets filtered to stay in
			//	.map(vote => typeof vote === 'string' ? (vote === 'blank' ? 'blank' : this.Search.users.byTag(vote).id) : Date.now()); //here's where the date is added
			//if (votes.length !== this.votes.length) throw 'missingUsers';
			
			if (race.voters[this.voter] && race.voters[this.voter][0]) {	//revote
				if (Date.now() - race.voters[this.voter][0] > 1800000) throw 'timeout';		//trying to revote out of time (more than half a hour later)
				else {
					if (this.spoiled) return Promise.resolve('spoiled revote');
					else return Promise.resolve('revote');
				}
			} else {
				if (this.spoiled) return Promise.resolve('spoiled');
				else return Promise.resolve('vote');
			}
		} catch (e) {
			return Promise.reject(e);
		}
	}

	toJSON() {
		return this.votes;
	}

}