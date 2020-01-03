import { Vote } from "./VoteInterfaces";
import Race from './Race';
import { Threshold } from "./ElectionInterfaces";
export default class Voter {
    static properties: string[];
    static thresholds: Threshold<Voter>[];
    id: string;
    name: string;
    votes: {
        [key: string]: Vote;
    };
    races?: string[];
    active?: boolean;
    [key: string]: any;
    constructor(voter: Voter);
    static setTransferredProperties(properties: string[]): void;
    static setThresholds(thresholds: Threshold<Voter>[]): void;
    registerEligible(race: Race): boolean;
    deregisterEligible(raceID: string): void;
    isEligible(raceID: string): boolean;
    disqualify(raceID?: string): void;
    addVote(raceID: string, vote: Vote): void;
}
