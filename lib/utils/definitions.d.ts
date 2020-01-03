import { System } from '../ElectionInterfaces';
import Voter from '../Voter';
export declare const Systems: System[];
export declare const Months: string[];
export declare const VotingErrors: {
    stolen: string;
    noGuild: string;
    state: string;
    noElection: string;
    ineligible: string;
    timeout: string;
    badOrder: string;
    badWriteIn: string;
    zeroes: string;
    duplicates: string;
    missingUsers: string;
};
export declare function VotingSuccesses(key: string, voter: Voter, election: string): string;
