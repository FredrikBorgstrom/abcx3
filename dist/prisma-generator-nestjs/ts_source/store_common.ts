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

export interface ModelFilterGroup {
    logicalOperator: 'and' | 'or';
    filters: ModelFilter[];
}

export interface ModelFilter {
    property: string;
    operator: ModelFilterOperator;
    value: any;
}

export type ModelFilterOperator =
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'notContains'
    | 'startsWith'
    | 'endsWith'
    | 'lessThan'
    | 'lessThanOrEqual'
    | 'greaterThan'
    | 'greaterThanOrEqual'
    | 'in'
    | 'notIn'
    | 'between'
    | 'notBetween';
}

export interface ModelStorePostData {
    filterGroup?: any;
}

const printObject = (obj: any) => JSON.stringify(obj, null, 2);