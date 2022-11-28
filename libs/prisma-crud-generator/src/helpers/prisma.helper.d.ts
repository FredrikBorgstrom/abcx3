import { DMMF } from '@prisma/generator-helper';
import { DecoratorHelper } from './decorator.helper';
interface TypeMap {
    tsType: string;
    validators: DecoratorHelper[];
}
export interface FieldNameAndType {
    name: string;
    type: string;
}
export declare const dartTypeMap: {
    bigint: string;
    boolean: string;
    bytes: string;
    datetime: string;
    decimal: string;
    float: string;
    int: string;
    json: string;
    string: string;
};
export declare class PrismaHelper {
    static instance: PrismaHelper;
    private primitiveTypeMap;
    static getInstance(): PrismaHelper;
    getMapTypeFromDMMF(field: DMMF.Field, validatorClass?: string): TypeMap;
    getDartTypeFromDMMF(field: DMMF.Field): string;
    generateSwaggerDecoratorsFromDMMF(field: DMMF.Field): DecoratorHelper[];
    getIdFieldNameAndType(model: DMMF.Model): FieldNameAndType | null;
    getUniqueInputPropertyName(model: DMMF.Model): string | null;
    getUniqueInputType(model: DMMF.Model): string | null;
    capitalize(str: string): string;
}
export {};
//# sourceMappingURL=prisma.helper.d.ts.map