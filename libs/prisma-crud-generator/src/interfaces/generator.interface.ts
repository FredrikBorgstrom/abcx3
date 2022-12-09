export interface GeneratorSettings {
    strict: 'true' | 'false';
    dryRun: 'true' | 'false';

    schemaPath: string;

    GenerateInputs: 'true' | 'false';
    GenerateInputSwagger: 'true' | 'false';
    InputExportPath: string;
    InputSuffix: string;
    InputValidatorPackage: string;
    InputParentClass?: string;
    InputParentClassPath?: string;
    InputCreatePrefix: string;
    InputUpdatePrefix: string;


    GenerateServices: 'true' | 'false';
    GenerateModule: 'true' | 'false';
    
    CRUDServicePath: string;
    CRUDServiceSuffix: string;
    CRUDStubFile?: string;
    CRUDAddExceptions?: 'true' | 'false';
    PrismaServiceImportPath: string;

    EnumPath: string;

    GenerateController?: 'true' | 'false';
    GuardClass?: String;
    GuardImportPath?: String;
}
