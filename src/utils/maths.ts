
export function randBetween(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

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

export function combine<T>(arr: T[], r: number): T[][] {
	let results = [] as T[][];
	let n = arr.length;
	function recursive(need: number, s: number, res: T[]) {
		if (need === 0) {
			let b = res.slice(0);
			results.push(b);
			return;
		}
		for (let i = s; i < n; i++){
			let b = res.slice(0);
			b.push(arr[i]); 
			recursive(need - 1, i + 1, b);
		}
	}	
	recursive(r, 0, []);
	return results;
}

export function randomPermutation<T>(arr: T[], count: number = 1, exclude: T[] = []): T[] {
	for (let v of exclude) {
		let index = arr.findIndex(element => element === v);
		if (index === -1) continue;
		arr.splice(index, 1);
	}
	let output = [] as T[];
	for (let i = 0; i < count; i++) {
		let index = randBetween(0, arr.length - 1);
		output.push(arr[index]);
		arr.splice(index, 1);
	}
	return output;
}