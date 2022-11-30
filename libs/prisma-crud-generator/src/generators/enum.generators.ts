import { DMMF } from '@prisma/generator-helper'

export const generateEnum = ({ name, values }: DMMF.DatamodelEnum) => {
  const enumValues = values.map(({ name }) => `${name}="${name}"`).join(',\n');

  return `enum ${name} { \n${enumValues}\n }`;
}

export const generateDartEnum = ({ name, values }: DMMF.DatamodelEnum) => {
    const enumValues = values.map(({ name }) => name).join(',\n\t');
  
    return `enum ${name} {\n\t${enumValues}\n}`
  }