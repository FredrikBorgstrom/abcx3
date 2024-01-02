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

const printObject = (obj: any) => JSON.stringify(obj, null, 2);