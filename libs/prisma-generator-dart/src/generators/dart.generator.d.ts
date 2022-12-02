import { DMMF } from '@prisma/generator-helper';
import { GeneratorSettings } from '../settings.interface';
export declare const dartTypeMap: {
    BigInt: string;
    Boolean: string;
    Bytes: string;
    DateTime: string;
    Decimal: string;
    Float: string;
    Int: string;
    Json: string;
    String: string;
};
export declare class DartGenerator {
    private config;
    private model;
    private importedPackages;
    private omitFields;
    private prismaHelper;
    constructor(config: GeneratorSettings, model: DMMF.Model);
    generateContent(): string;
    private generateBaseInput;
    generateConstructorArg(field: DMMF.Field): string;
    printDefaultValue(field: DMMF.Field): string | null;
    generateFromJsonArgument(field: DMMF.Field): string;
    generateToJsonKeyVal(field: DMMF.Field): string;
    generatePropertyContent(field: DMMF.Field): string;
    getDartType: (field: DMMF.Field) => string;
    isProprietaryType: (type: string) => boolean;
    replaceNullable: (content: string, field: DMMF.Field) => string;
    replacePropName: (content: string, field: DMMF.Field) => string;
    replaceType: (content: string, field: DMMF.Field) => string;
    private generateImportStatements;
}
//# sourceMappingURL=dart.generator.d.ts.map