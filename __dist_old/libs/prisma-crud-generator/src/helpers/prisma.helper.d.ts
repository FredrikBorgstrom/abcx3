import { DMMF } from '@prisma/generator-helper';
import { DecoratorHelper } from './decorator.helper';
interface TypeMap {
    tsType: string;
    validators: DecoratorHelper[];
}
export declare class PrismaHelper {
    static instance: PrismaHelper;
    private primitiveTypeMap;
    static getInstance(): PrismaHelper;
    getMapTypeFromDMMF(field: DMMF.Field, validatorClass?: string): TypeMap;
    generateSwaggerDecoratorsFromDMMF(field: DMMF.Field): DecoratorHelper[];
}
export {};
