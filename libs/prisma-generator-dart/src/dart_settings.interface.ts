import { GeneratorSettings } from "../../shared/src/generator_settings.interface";

export interface DartGeneratorSettings extends GeneratorSettings {
    EnumPath: string;
    DartValidatorPackage?: string;
    FormatWithDart: boolean;
    MakeAllPropsOptional: boolean;
    UpdateStoresDefaultRecursiveDepth: number;
    // ModelsImplementBaseClass?: boolean;
    // CommonSourceDirectory: string;
    // ModelsBaseClassFileName: string;
    GenerateEndpoints?: boolean;
    BackendPath?: string;
    EndpointsOutputPath?: string;
    generateEndpoints?: boolean;
    backendPath?: string; // path to the backend source code, used to extract routes from the backend
    endpointsOutputPath?: string;
    // When true, emit setup_stores_devtool.dart next to generated libraries
    outputSetupForDevtools?: boolean;
    // Support PascalCase variant to be consistent with other options
    OutputSetupForDevtools?: boolean;

}
