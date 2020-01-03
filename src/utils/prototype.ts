import { randBetween } from './maths';

//Fisher-Yates shuffle algorithm for javascript
export function shuffle<T>(arr: T[]): T[] {
	let c = arr.length;
	while (0 !== c) { // while there remain elements to shuffle...
		let r = randBetween(0, c); // pick a remaining element...
		c--;
		arr = swap(arr, r, c);
	}
	return clean(arr);
}

//swaps two elements in an array
export function swap<T>(arr: T[], i: number, j: number): T[] {
	let tmp = arr[i];
	arr[i] = arr[j];
	arr[j] = tmp;
	return arr;
}

//removes null or undefined values from an array
export function clean<T>(arr: T[]): T[] {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === null || arr[i] === undefined) {
			arr.splice(i, 1);
			i--;
		}
	}
	return arr;
}

export function randomElement<T>(arr: T[]): T {
	let index = randBetween(0, arr.length - 1);
	return arr[index];
}