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

}
