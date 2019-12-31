import { BooleanDictionary, VoteDictionary, Vote, setToZero, filterKeys} from './interfaces';

export default class Count {

	static STV: boolean = false;
	static useSTV() { this.STV = true };
	static useIRV() { this.STV = false };

	static winnerThreshold: number = 1;
	static setWinnerThreshold(winnerThreshold: number) { this.winnerThreshold = winnerThreshold };

	public candidates: BooleanDictionary = {}

	constructor(candidates: string[], public votes: Vote[]) {
		this.candidates = candidates.reduce((acc: BooleanDictionary, curr: string) => {
			acc[curr] = true;
			return acc;
		}, {});
	}
	
	public winners: string[] = [];
	public rounds: VoteDictionary[] = [];
	private totalCount: VoteDictionary = setToZero(this.candidates, [] as Vote[]);

	public rank() {
		this.totalCount = this.initialCount();
		this.rounds.push(this.totalCount);
		this.getWinner();
		while (this.winners.length < Count.winnerThreshold) {
			let eliminees = this.getEliminees();
			this.deregister(eliminees);
			this.transferVotes(eliminees);
			this.eliminate(eliminees);
			this.rounds.push(this.totalCount);
			this.getWinner();
		};
	}

	private initialCount(): VoteDictionary {
		return this.sortVotes(this.votes);
	}

	private sortVotes(votes: Vote[]): VoteDictionary { //returns a map based on first preference vote
		return votes.reduce((acc: VoteDictionary, curr: Vote) => {
			let vote = curr.find(v => v in acc);
			if (!vote) return acc;
			acc[vote].push(curr);
			return acc;
		}, this.totalCount);
	}

	private getQuota(): number {
		let live: number = Object.values(this.candidates).filter(v => v).length;
		return Math.ceil((this.votes.length + 1) / live);
	}

	private getWinner(): string | null {
		let quota = this.getQuota();
		let winner = Object.keys(this.totalCount).find(k => this.totalCount[k].length >= quota) || null;
		if (winner) this.winners.push(winner);
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
		for (let c of eliminees) {
			if (!(c in this.totalCount)) throw this.eliminationError;
			let votes = this.totalCount[c];
			this.totalCount = this.sortVotes(votes);
		}
	}

	private eliminate(eliminees: string[]): void {
		for (let c of eliminees) {
			if (!(c in this.totalCount)) throw this.eliminationError;
			delete this.totalCount[c];
		}
	}

	private get eliminationError(): string {
		return [
			'Found an error with the elimination-finding mechanism:',
			JSON.stringify(this.candidates, null, 4),
			JSON.stringify(this.totalCount, null, 4)
		].join('\n');
	}

}