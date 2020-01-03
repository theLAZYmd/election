import { VotingErrors as Errors, VotingSuccesses as Successes } from './utils/definitions';
import { Outcome, VotingErrors } from './VoteInterfaces';
import Voter from './Voter';
import Ballot from './irv/Parse';
import regexes from './utils/regexes';
import Settings from './Election';

export default class VoteMethods {

	constructor(private election: Settings) {};

	private resolve(output: Outcome, voter: Voter, election: string): string {
		return Successes(output, voter, election);
	}

	private reject(output: keyof VotingErrors): string {
		return Errors[output];
	}

	public parseBallot(ballots: string, server: string, voter: Voter): {
		successes: Ballot[],
		failures: Ballot[]
	} {
		let res = {
			successes: [] as Ballot[],
			failures: [] as Ballot[],
		}
		let matches = ballots.match(regexes.ballot) || [];
		matches.forEach((match) => {
			let vote = new Ballot(match);
			try {
				let outcome = vote.validate(server, voter, this.election)
				vote.setOutcome('fulfilled')
					.setStatus(outcome)
					.setMessage(this.resolve(outcome, voter, vote.race));
			} catch (e) {
				vote.setOutcome('rejected')
					.setStatus(e as keyof VotingErrors)
					.setMessage(this.reject(e as keyof VotingErrors))
			} finally {				
				if (vote.outcome === 'fulfilled') res.successes.push(vote);
				else if (vote.outcome === 'rejected') res.failures.push(vote);
			}
		});
		return res;
	}

}