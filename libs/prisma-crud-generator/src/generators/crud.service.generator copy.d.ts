import { GeneratorSettings } from './../interfaces/generator.interface';
import { DMMF } from '@prisma/generator-helper';
import { FieldNameAndType } from '../helpers/prisma.helper';
export declare class CrudServiceGenerator_old {
    private config;
    private model;
    private className;
    private prismaHelper;
    constructor(config: GeneratorSettings, model: DMMF.Model, className: string);
    generateContent(): Promise<string>;
    replaceInIdMethods(content: string, fieldNameAndType: FieldNameAndType): string;
}
//# sourceMappingURL=crud.service.generator%20copy.d.ts.map