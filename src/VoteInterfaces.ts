export type Outcome = 'spoiled' | 'spoiled revote' | 'revote' | 'vote' | '';

export type Vote =  [
	number,
	...string[]
]

export interface VotingErrors {
	stolen: string,
	noGuild: string,
	state: string,
	noElection: string,
	ineligible: string,
	timeout: string,
	badOrder: string,
	badWriteIn: string,
	zeroes: string,
	duplicates: string,
	missingUsers: string
};