import { DMMF } from '@prisma/generator-helper'

export const generateDartEnum = ({ name, values }: DMMF.DatamodelEnum, autoGenText: string) => {
    const enumValues = values.map(({ name }) => name).join(',\n\t');
  
    return `${autoGenText}\nenum ${name} {\n\t${enumValues}\n}`
  }