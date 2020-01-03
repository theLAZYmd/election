import Election from '../Election';
import Race from '../Race';
import Voter from '../Voter';
import Candidate from '../Candidate';
import { Threshold, Field } from '../ElectionInterfaces';
export default class Ballot {
    private voter;
    private races;
    private election;
    static properties: string[];
    static thresholds: Threshold<Candidate>[];
    static url: string;
    static footer: string;
    static setURL(url: string): void;
    static setFooter(footer: string): void;
    constructor(voter: Voter, races: Race[], election: Election);
    get title(): string;
    get url(): string;
    get description(): string;
    get fields(): Field[];
    get footer(): string;
    get color(): number;
    toJSON(): {
        title: string;
        url: string;
        description: string;
        fields: Field[];
        footer: string;
        color: number;
    };
}
