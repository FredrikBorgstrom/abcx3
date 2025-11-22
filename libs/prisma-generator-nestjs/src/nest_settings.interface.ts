import { GeneratorSettings } from "libs/shared/src/generator_settings.interface";

export interface NestGeneratorSettings extends GeneratorSettings {
    
    prefix?: string;
    GenerateServices?: boolean; 
    GenerateEmptyControllersAndServices?: boolean;
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
    secondaryOutputPath?: string;
    PrismaClientImportPath?: string;
    addJSExtensionToImports?: boolean;
}

// InputExportPath: string;
    // InputSuffix: string;
    // InputValidatorPackage: string;
    // InputParentClass?: string;
    // InputParentClassPath?: string;
    // InputCreatePrefix: string;
    // InputUpdatePrefix: string;
    // GenerateInputSwagger?: boolean;