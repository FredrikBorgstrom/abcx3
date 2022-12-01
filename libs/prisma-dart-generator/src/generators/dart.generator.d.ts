import { DMMF } from '@prisma/generator-helper';
import { GeneratorSettings } from '../settings.interface';
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
    generateFieldContent(field: DMMF.Field): string;
    private addPackageToImport;
    private generateImportStatements;
}
//# sourceMappingURL=dart.generator.d.ts.map