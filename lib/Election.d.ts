import Race from './Race';
import Voter from './Voter';
import Candidate from './Candidate';
import { Setting, Threshold, States, InfoField } from './ElectionInterfaces';
import { Vote } from './VoteInterfaces';
import Ballot from './irv/Ballot';
import Count from './irv/Count';
import Parse from './irv/Parse';
export default class Election {
    id: string;
    states: States;
    get type(): string;
    get plural(): "" | "s";
    settings: {
        [key: string]: Setting<any>;
    };
    candidateThresholds: {
        [key: string]: Threshold<Candidate>;
    };
    ballotThresholds: {
        [key: string]: Threshold<Candidate>;
    };
    voterThresholds: {
        [key: string]: Threshold<Voter>;
    };
    races: {
        [key: string]: Race;
    };
    voters: {
        [key: string]: Voter;
    };
    votes: {
        [key: string]: Vote;
    };
    results?: {
        [key: string]: Count;
    };
    constructor(id: string);
    private pendingPromises;
    resolve: () => Promise<void>;
    editSetting(key: string, s: Setting<any>): this;
    setRaceProperties(properties: string[]): Election;
    setVoterProperties(properties: string[]): Election;
    setCandidateProperties(properties: string[]): Election;
    addVoterThreshold(key: string, t: Threshold<Voter>): Election;
    editVoterThreshold(key: string, t: Threshold<Voter>): this;
    addCandidateThreshold(key: string, t: Threshold<Candidate>): this;
    editCandidateThreshold(key: string, t: Threshold<Candidate>): this;
    get settingsObject(): {
        [key: string]: string;
    };
    get settingsFields(): InfoField[];
    private setState;
    private resetState;
    addRace(data: Race): Race;
    addVoter(data: Voter): Voter;
    getCounts(): {
        [key: string]: number;
    };
    getVoters(raceID: string): Voter[];
    registerEligible(): Election;
    deregisterEligible(): Election;
    openNominations(): Election;
    closeNominations(): Election;
    openVoting(): Election;
    closeVoting(): Election;
    generateTestBallot(voter: Voter, mobile: boolean, races: Race[]): {
        [key: string]: Ballot;
    };
    generateOneBallot(voter: Voter, mobile: boolean): {
        [key: string]: Ballot;
    };
    generateAllBallots(real: boolean): {
        [key: string]: Ballot;
    };
    private generateBallotDict;
    addVoteFromBallot(voter: Voter, data: string): Election;
    addVote(voter: Voter, ballot: Parse): Election;
    private setVote;
    countVotes(): this;
    getRace(id: string): Race | undefined;
    getVoter(id: string): Voter | undefined;
    toJSON(): Object;
}
