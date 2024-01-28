import {
    InternalServerErrorException
} from "@nestjs/common";

export async function getByFieldValues<T>(
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

/** Filters **/

enum FilterOperatorEnum {
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

export type ModelFilterGroup<T> = {
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

export interface ModelStorePostData<T> {
    filterGroup?: ModelFilterGroup<T>;
}

const printObject = (obj: any) => JSON.stringify(obj, null, 2);