import { DMMF } from "@prisma/generator-helper";
import { GeneratorSettings } from "../interfaces/generator.interface";
export declare class ModuleGenerator {
    private config;
    private model;
    private className;
    private serviceName;
    private serviceFileName;
    constructor(config: GeneratorSettings, model: DMMF.Model, className: string, serviceName: string, serviceFileName: string);
}
export interface ModuleGeneratorArgs {
    config: GeneratorSettings;
    model: DMMF.Model;
    className: string;
    serviceName: string;
    serviceFileName: string;
}
//# sourceMappingURL=module.generator.d.ts.map