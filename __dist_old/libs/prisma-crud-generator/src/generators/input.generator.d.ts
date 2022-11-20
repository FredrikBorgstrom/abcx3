import { DMMF } from '@prisma/generator-helper';
import { GeneratorInterface } from '../interfaces/generator.interface';
export declare class InputGenerator {
    private config;
    private model;
    private fieldDecorators;
    private omitFields;
    constructor(config: GeneratorInterface, model: DMMF.Model);
    generateContent(): Promise<string>;
    private getBaseInputClassName;
    private getCreateInputClassName;
    private getUpdateInputClassName;
    private generateBaseInput;
    private generateCreateInput;
    private generateUpdateInput;
    generateFieldContent(field: DMMF.Field): Promise<string>;
    private addDecoratorToImport;
    private generateImportStatements;
    private parseDocumentation;
}
