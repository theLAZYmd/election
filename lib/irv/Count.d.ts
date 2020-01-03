import { BooleanDictionary, Vote, NumberDictionary } from './interfaces';
export default class Count {
    votes: Vote[];
    static STV: boolean;
    static useSTV(): void;
    static useIRV(): void;
    static winnerThreshold: number;
    static setWinnerThreshold(winnerThreshold: number): void;
    candidates: BooleanDictionary;
    quota: number;
    order: string[][];
    private totalCount;
    winners: string[];
    rounds: NumberDictionary[];
    transfers: NumberDictionary[];
    constructor(candidates: string[], votes: Vote[]);
    private initialCount;
    private sortVotes;
    private getWinner;
    private getEliminees;
    private deregister;
    private transferVotes;
    private eliminate;
    private get candidatesLeft();
    private get eliminationError();
    toJSON(): {} & this;
}
