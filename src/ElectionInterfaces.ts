import Candidate from './Candidate';
import Voter from './Voter'
import Race from './Race';

export interface Setting<T> {
	key?: string,
	value: T,
	definition: string | any[],
	title: string,
	conversion?: (value: T) => string
}

type Person = Candidate | Voter;

export interface Threshold<T extends Person> {
	key: string,
	value: string,
	title: string,
	validate: (voter: T, race: Race) => boolean,
	error: string
}

export interface System {
	key: string,
	name: string,
	href: string
}

export interface InfoField {
	name: string,
	value: string
}

export interface States {
	register: boolean,
	candidates: boolean,
	voting: boolean,
	count: boolean,
	results: boolean
}

export interface Field {
	name: string,
	value: string,
	inline: boolean
}