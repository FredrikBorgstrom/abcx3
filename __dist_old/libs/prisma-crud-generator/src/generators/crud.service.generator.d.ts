import { GeneratorInterface } from './../interfaces/generator.interface';
import { DMMF } from '@prisma/generator-helper';
export declare class CrudServiceGenerator {
    private config;
    private model;
    private className;
    constructor(config: GeneratorInterface, model: DMMF.Model, className: string);
    generateContent(): Promise<string>;
}
