import { GeneratorSettings } from "libs/shared/src/generator_settings";

export interface NestGeneratorSettings extends GeneratorSettings {
    
    prefix?: string;
    GenerateServices?: boolean; 
    // GenerateInputs?: boolean;
    GenerateControllers?: boolean;
    
    GenerateModule?: boolean;
    CRUDStubFile?: string;
    WrapWithNeverthrow?: boolean;
    PrismaServiceImportPath: string;
    EnumPath: string;
    GuardClass?: String;
    GuardImportPath?: String;
    PrismaModuleName?: string;
    PrismaModuleImportPath?: string;
}

// InputExportPath: string;
    // InputSuffix: string;
    // InputValidatorPackage: string;
    // InputParentClass?: string;
    // InputParentClassPath?: string;
    // InputCreatePrefix: string;
    // InputUpdatePrefix: string;
    // GenerateInputSwagger?: boolean;