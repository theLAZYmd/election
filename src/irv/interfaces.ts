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

export function filterKeys<T>(input: {[key: string]: T}, func: (value: T) => boolean): string[] {
	let output = [] as string[];
	for (let [k, v] of Object.entries(input)) {
		if (!func(v)) continue;
		output.push(k);
	}
	return output;
}

export function mapToLengths(input: {[key: string]: any[]}): NumberDictionary {
	let output = {} as NumberDictionary;
	for (let k of Object.keys(input)) {
		output[k] = input[k].length;
	}
	return output;
}

// this method implemented https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
export function flatten<T>(arr: any[], depth: number = 1): any[] {
	return arr.reduce(function (flat, toFlatten) {
		return flat.concat((Array.isArray(toFlatten) && (depth - 1)) ? flatten(toFlatten, depth - 1) : toFlatten);
	}, []);
}