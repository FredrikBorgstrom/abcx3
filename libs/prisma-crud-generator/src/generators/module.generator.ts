import { DMMF } from "@prisma/generator-helper";
import { PrismaHelper } from "../helpers/prisma.helper";
import { GeneratorSettings } from "../interfaces/generator.interface";
import { moduleStub } from "../stubs/module.stub";

export class ModuleGenerator {

    constructor(private args: ModuleGeneratorArgs ) {}

    generateContent() {
        let content = moduleStub;

        return content;
    }
}

export interface ModuleGeneratorArgs {
    settings: GeneratorSettings;
    model: DMMF.Model;
    moduleName: string;
    serviceName: string;
    serviceFileName: string;
}
