import { Outcome, VotingErrors } from './VoteInterfaces';
import Voter from './Voter';
import Ballot from './irv/Parse';
import Settings from './Election';
export default class VoteMethods {
    private election;
    constructor(election: Settings);
    resolve(output: Outcome, voter: Voter, election: string): string;
    reject(output: keyof VotingErrors): string;
    parseBallot(ballots: string, server: string, voter: Voter): {
        successes: Ballot[];
        failures: Ballot[];
    };
}
