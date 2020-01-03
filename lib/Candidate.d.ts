import Voter from './Voter';
import Race from './Race';
import { Threshold } from './ElectionInterfaces';
export default class Candidate {
    race: Race;
    static properties: string[];
    static thresholds: Threshold<Candidate>[];
    id: string;
    name: string;
    sponsors: {
        [key: string]: Voter;
    };
    [key: string]: any;
    constructor(voter: Voter, race: Race);
    static setTransferredProperties(properties: string[]): void;
    static setThresholds(thresholds: Threshold<Candidate>[]): void;
    toJSON(): Object;
}
