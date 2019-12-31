export type Vote = string[];

export interface BooleanDictionary {
	[key: string]: boolean
}

export interface NumberDictionary {
	[key: string]: number
}

export interface VoteDictionary {
	[key: string]: Vote[]
}

export function setToZero<T = 0>(input: BooleanDictionary, param: T): {[key: string]: T} {
	let output = {} as {[key: string]: T};
	for (let k of Object.keys(input)) {
		if (!input[k]) continue;
		output[k] = param;
	}
	return output;
}

export function filterKeys<T>(input: {[key: string]: T}, func: (value: T) => boolean) {
	let output = [] as string[];
	for (let [k, v] of Object.entries(input)) {
		if (!func(v)) continue;
		output.push(k);
	}
	return output;
}