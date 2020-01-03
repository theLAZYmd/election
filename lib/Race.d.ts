import { Vote } from './VoteInterfaces';
import Candidate from './Candidate';
import Voter from './Voter';
import Election from './Election';
export default class Race {
    election: Election;
    static properties: string[];
    id: string;
    name: string;
    candidates: {
        [key: string]: Candidate;
    };
    validVotes: {
        [key: string]: Vote;
    };
    [key: string]: any;
    constructor(data: Race, election: Election);
    static setTransferredProperties(properties: string[]): void;
    get candidatesLength(): number;
    private eligibleCache;
    get eligibleVoters(): Voter[];
    getRandomVoter(exclude?: string[]): Voter;
    getRandomVoters(count?: number, exclude?: string[]): Voter[];
    upgradeToCandidate(voter: Voter): Race;
    disqualifyCandidate(candidateID: string): Race;
    sponsor(candidate: Candidate, voter: Voter): Race;
    unsponsor(candidate: Candidate, voter: Voter): Race;
    toJSON(): Object;
}
