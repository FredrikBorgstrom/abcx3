export interface GeneratorSettings {
  dryRun: 'true' | 'false';
  schemaPath: string;
  EnumPath: string;
  DartValidatorPackage?: string,
  FormatWithDart: 'true' | 'false',
  makeAllPropsOptional: 'true' | 'false'
}
