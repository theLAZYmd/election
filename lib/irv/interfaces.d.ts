export declare type Vote = string[];
export interface BooleanDictionary {
    [key: string]: boolean;
}
export interface NumberDictionary {
    [key: string]: number;
}
export interface VoteDictionary {
    [key: string]: Vote[];
}
export declare function setToZero<T = 0>(input: BooleanDictionary, param: T): {
    [key: string]: T;
};
export declare function filterKeys<T>(input: {
    [key: string]: T;
}, func: (value: T) => boolean): string[];
export declare function mapToLengths(input: {
    [key: string]: any[];
}): NumberDictionary;
export declare function flatten<T>(arr: any[], depth?: number): any[];
