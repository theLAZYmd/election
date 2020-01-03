import { BooleanDictionary, VoteDictionary, Vote, setToZero, filterKeys, mapToLengths, NumberDictionary, flatten} from './interfaces';

export default class Count {

	static STV: boolean = false;
	static useSTV() { this.STV = true };
	static useIRV() { this.STV = false };

	static winnerThreshold: number = 1;
	static setWinnerThreshold(winnerThreshold: number) { this.winnerThreshold = winnerThreshold };

	public candidates: BooleanDictionary = {};
	public quota: number = Infinity;
	public order: string[][] = [];
	private totalCount: VoteDictionary;	
	public winners: string[] = [];
	public rounds: NumberDictionary[] = [];
	public transfers: NumberDictionary[] = [];

	constructor(candidates: string[], public votes: Vote[]) {
		this.candidates = candidates.reduce((acc: BooleanDictionary, curr: string) => {
			acc[curr] = true;
			return acc;
		}, {});
		this.totalCount = {};
		
		if (Count.STV) this.quota = Math.floor(this.votes.length / (Count.winnerThreshold + 1)) + 1;

		this.totalCount = this.initialCount();
		this.rounds.push(mapToLengths(this.totalCount));
		this.getWinner();
		while (this.winners.length < Count.winnerThreshold) {
			let eliminees = this.getEliminees();
			this.deregister(eliminees);
			this.transferVotes(eliminees);
			this.eliminate(eliminees);
			this.rounds.push(mapToLengths(this.totalCount));
			this.getWinner();
			if (!this.candidatesLeft) break;
		};
	}

	private initialCount(): VoteDictionary {
		return this.sortVotes(this.votes);
	}

	private sortVotes(votes: Vote[]): VoteDictionary { //returns a map based on first preference vote
		return votes.reduce((acc: VoteDictionary, curr: Vote) => {
			let vote = curr.find(v => v in acc);
			if (!vote) return acc;
			acc[vote] = acc[vote].concat([curr]);
			return acc;
		}, setToZero(this.candidates, [] as Vote[]));
	}

	private getWinner(): string | null {
		if (this.candidatesLeft <= 1) {
			let winner = filterKeys(this.candidates, v => v);
			this.winners = winner.concat(flatten(this.order.slice(0, Count.winnerThreshold - 1)));
			if (winner.length) this.order.unshift(winner);
			return winner[0] || null;
		}
		if (!Count.STV) return null;
		let winner = Object.entries(this.totalCount)
			.sort((a, b) => b[1].length - a[1].length)		// Sort and map first with STV each time to ensure highest scoring winners come out first
			.map(entry => entry[0])
			.find(k => !this.winners.includes(k) && this.totalCount[k].length >= this.quota) || null;
		if (winner) {
			this.order.splice(this.winners.length, 0, [winner]);
			this.winners.push(winner);
			this.getWinner();
		}
		return winner;
	}

	private getEliminees(): string[] {
		
		if (Count.STV) {
			let winners = this.winners.filter(w => this.candidates[w]);
			if (winners.length) return winners;
		}

		let zeroes = filterKeys(this.totalCount, (votes) => votes.length === 0);
		if (zeroes.length !== 0) return zeroes;
		
		let lowestValue = Object.values(this.totalCount).reduce((acc: number, curr: Vote[]) => {
			if (curr.length < acc) return curr.length;
			return acc;
		}, Infinity);											
		return filterKeys(this.totalCount, (votes) => votes.length === lowestValue);
	}

	private deregister(eliminees: string[]): void {
		for (let c of eliminees) {
			if (!(c in this.totalCount)) throw this.eliminationError;
			this.candidates[c] = false;
		}
	}

	private transferVotes(eliminees: string[]): void {
		let stv = 1;	//TODO: Implement fractional voting with STV
		if (Count.STV && eliminees.length === 1 && this.winners.includes(eliminees[0])) {
			stv = 1 / (this.totalCount[eliminees[0]].length - this.quota);
		}
		for (let c of eliminees) {
			if (!(c in this.totalCount)) throw this.eliminationError;
			let votes = this.totalCount[c];
			let transfer = this.sortVotes(votes);
			this.transfers.push(mapToLengths(transfer));
			for (let [k, v] of Object.entries(transfer)) {
				this.totalCount[k] = this.totalCount[k].concat(v);
			}
		}
	}

	private eliminate(eliminees: string[]): void {
		for (let c of eliminees) {
			if (!(c in this.totalCount)) throw this.eliminationError;
			delete this.totalCount[c];
		}
		if (Count.STV) {
			if (eliminees.some(c => this.winners.includes(c))) return;
		}
		this.order.unshift(eliminees);
	}

	private get candidatesLeft(): number {
		return Object.values(this.candidates).filter(v => v).length;
	}

	private get eliminationError(): string {
		return [
			'Found an error with the elimination-finding mechanism:',
			JSON.stringify(this.candidates, null, 4),
			JSON.stringify(this.totalCount, null, 4)
		].join('\n');
	}

	toJSON() {
		let output = Object.assign({}, this);
		delete output.totalCount;
		delete output.votes;
		if (!Count.STV) delete output.quota;
		if (output.order.every(position => position.length === 1)) output.order = output.order.map(([c]) => c) as unknown as string[][];
		output.candidates = Object.keys(output.candidates) as unknown as BooleanDictionary;
		return output;
	}

}