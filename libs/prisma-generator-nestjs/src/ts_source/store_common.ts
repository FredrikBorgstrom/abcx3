import {
    InternalServerErrorException
} from "@nestjs/common";

/** Filters **/

export enum FilterOperatorEnum {
    equals,
    not,
    gt,
    gte,
    lt,
    lte,
    inList,
    notInList,
    contains,
    startsWith,
    endsWith,
    notContains,
    notStartsWith,
    notEndsWith,
    isNull,
    isNotNull,
}

export type FilterOperator = keyof typeof FilterOperatorEnum;

export type ModelFilter<T> = {
    [K in keyof LogicalOperators<T>]: PropertyFilter<T>[];
}

export type PropertyFilter<T> = {
    [K in keyof T]: FilterOperatorAndValue;
}

export type FilterOperatorAndValue = {
    [K in FilterOperator]: any;
}
export interface StorePostData<T> {
    modelFilter?: ModelFilter<T>;
}

/* interface LogicalOperators {
    AND?: {};
    OR?: {}; 
    NOT?: {};
} */
interface LogicalOperators<T> {
    AND?: T | T[];
    OR?: T | T[];
    NOT?: T | T[];
}
export type WithoutLogicalOperators<T> = Omit<T, keyof LogicalOperators<T>>;

export type WithLogicalOperators<T> = T & LogicalOperators<T>; //{[K in keyof T]: T[K]};


/**      Store helper functions     **/

export async function getByFieldValuesHelper<T, I>(
    findFirstFunction: Function,
    fieldsAndValues: WithoutLogicalOperators<I>,
    modelFilter?: WithLogicalOperators<I>
): Promise<T | Error> {
    try {
        const combinedFilter = combineFilters(
            fieldsAndValues,
            modelFilter,
        );
        const result = await findFirstFunction({
            where: fieldsAndValues,
        });
        return result;
    } catch (e) {
        return new InternalServerErrorException(
            `Could not find one model where ${printObject(
                fieldsAndValues,
            )}}`,
        );
    }
}

export async function getManyByFieldValuesHelper<T, I>(
    findManyFunction: Function,
    fieldsAndValues?: WithoutLogicalOperators<I>,
    modelFilter?: WithLogicalOperators<I>,
): Promise<T[] | Error> {
    const combinedFilter = combineFilters(
        fieldsAndValues,
        modelFilter,
    );
    try {
        const result = await findManyFunction({
            where: combinedFilter,
        });
        return result;
    } catch (error: any) {
        console.log(printObject(error));
        console.log("message: ", error?.message);
        throw new InternalServerErrorException(
            `Could not find any models where ${printObject(fieldsAndValues)}`,
        );
    }
}

export function combineFilters<T extends LogicalOperators<T>>(
    fieldsAndValues?: WithoutLogicalOperators<T>,
    modelFilter?: T,
): T {
    let combinedFilter: T = {
        AND: modelFilter?.AND,
        OR: modelFilter?.OR,
        NOT: modelFilter?.NOT,
    } as T;
    if (fieldsAndValues) {
        combinedFilter.AND = [
            ...(combinedFilter?.AND as T[] ?? []), 
            fieldsAndValues as T,
        ];
    }
    return combinedFilter;
}

export function printObject(obj: any) {
    return JSON.stringify(obj, null, 2);
}

export function numberIfNumber(value: string) : string | number {
    return isNaN(Number(value)) ? value : Number(value);
}


/* export function combineFilters<T extends LogicalOperators<T>>(
    fieldsAndValues: WithoutLogicalOperators<T>,
    modelFilter?: T,
): T {
    let combinedFilter: T;
    if (modelFilter) {
        combinedFilter = {
            AND: [
                ...(modelFilter?.AND as T[]),
                fieldsAndValues,
            ],
        } as T;
        if (modelFilter?.OR) {
            combinedFilter.OR = modelFilter?.OR;
        }
        if (modelFilter?.NOT) {
            combinedFilter.NOT = modelFilter?.NOT;
        }
    } else {
        combinedFilter = fieldsAndValues as T;
    }
    return combinedFilter;
} */




/* export async function getByFieldValues<T>(
    prismaClient: any,
    modelName: string,
    fieldsAndValues: Record<string, number | string>,
): Promise<T | Error> {
    try {
        const result = await prismaClient[modelName].findFirst({
            where: fieldsAndValues,
        });
        return result;
    } catch (e) {
        return new InternalServerErrorException(
            `Could not get one ${modelName} by ${printObject(
                fieldsAndValues,
            )}}`,
        );
    }
}

export async function getManyByFieldValues<T>(
    prismaClient: any,
    modelName: string,
    fieldsAndValues: Record<string, number | string>
): Promise<T[] | Error> {
    try {
        const result = await prismaClient[modelName].findMany({
            where: fieldsAndValues,
        });
        return result;
    } catch (e) {
        return new InternalServerErrorException(
            `Could not get any ${modelName} by ${printObject(
                fieldsAndValues,
            )}}`,
        );
    }
}

export enum FilterOperatorEnum {
    equals,
    not,
    gt,
    gte,
    lt,
    lte,
    inList,
    notInList,
    contains,
    startsWith,
    endsWith,
    notContains,
    notStartsWith,
    notEndsWith,
    isNull,
    isNotNull,
}

export type FilterOperator = keyof typeof FilterOperatorEnum;

export type ModelFilter<T> = {
    [K in keyof typeof logicalOperatorEnum]: PropertyFilter<T>[];
}

export type PropertyFilter<T> ={
    [K in keyof T]: FilterOperatorAndValue;
}

enum logicalOperatorEnum {
    AND,
    OR,
    NOT
}

export type FilterOperatorAndValue = {
    [K in FilterOperator]: any;
}

export interface StorePostData<T> {
    modelFilter?: ModelFilter<T>;
}

export const printObject = (obj: any) => JSON.stringify(obj, null, 2); 
*/