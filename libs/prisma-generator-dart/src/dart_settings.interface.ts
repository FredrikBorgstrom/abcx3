import { GeneratorSettings } from "libs/shared/src/generator_settings";

export interface DartGeneratorSettings extends GeneratorSettings {
    EnumPath: string;
    DartValidatorPackage?: string,
    FormatWithDart: 'true' | 'false',
    makeAllPropsOptional: 'true' | 'false'
}
