import { DMMF } from '@prisma/generator-helper';
import { DecoratorHelper } from './decorator.helper';

interface TypeMap {
    tsType: string;
    validators: DecoratorHelper[];
}

export interface FieldNameAndType {
    name: string;
    type: string;
}




export class PrismaHelper {
    static instance: PrismaHelper;

    private primitiveTypeMap(validatorClass: string): Record<any, TypeMap> {
        return {
            bigint: {
                tsType: 'BigInt',
                validators: [new DecoratorHelper('IsNumber', validatorClass)],
            },
            boolean: {
                tsType: 'boolean',
                validators: [new DecoratorHelper('IsBoolean', validatorClass)],
            },
            bytes: {
                tsType: 'Buffer',
                validators: [],
            },
            datetime: {
                tsType: 'Date',
                validators: [new DecoratorHelper('IsISO8601', validatorClass)],
            },
            decimal: {
                tsType: 'number',
                validators: [new DecoratorHelper('IsNumber', validatorClass)],
            },
            float: {
                tsType: 'number',
                validators: [new DecoratorHelper('IsNumber', validatorClass)],
            },
            int: {
                tsType: 'number',
                validators: [new DecoratorHelper('IsInt', validatorClass)],
            },
            json: {
                tsType: 'object',
                validators: [new DecoratorHelper('IsObject', validatorClass)],
            },
            string: {
                tsType: 'string',
                validators: [new DecoratorHelper('IsString', validatorClass)],
            },
        };
    }

    

    static getInstance() {
        if (PrismaHelper.instance) {
            return PrismaHelper.instance;
        }
        PrismaHelper.instance = new PrismaHelper();
        return PrismaHelper.instance;
    }

    public getMapTypeFromDMMF(field: DMMF.Field, validatorClass = 'class-validator'): TypeMap {
        const mapTypes = this.primitiveTypeMap(validatorClass);
        const mapType = mapTypes[field.type.toLowerCase()];

        if (!mapType) {
            return {
                tsType: field.type,
                validators: [new DecoratorHelper('IsDefined', validatorClass)],
            };
        }
        return mapType;
    }

    /* public getDartTypeFromDMMF(field: DMMF.Field): string {        
        const mapType = dartTypeMap[field.type.toLowerCase() as DartTypeMapKey];
        if (!mapType) {
            return field.type;
        }
        return mapType;
    } */


    public generateSwaggerDecoratorsFromDMMF(
        field: DMMF.Field,
    ): DecoratorHelper[] {
        const decorators: DecoratorHelper[] = [];

        if (field.isRequired) {
            decorators.push(new DecoratorHelper('ApiProperty', '@nestjs/swagger'));
        } else {
            decorators.push(
                new DecoratorHelper(
                    'ApiProperty',
                    '@nestjs/swagger',
                    JSON.stringify({
                        required: false,
                    }),
                ),
            );
        }

        return decorators;
    }

    public getIdFieldNameAndType(model: DMMF.Model): FieldNameAndType | null {
        const idField = model.fields.find(field => field.isId === true);
        if (idField) {
            return {
                name: idField.name,
                type: this.getMapTypeFromDMMF(idField).tsType
            };
        } else {
            return null;
        }
    }

    public getUniqueInputPropertyName(model: DMMF.Model): string | null {

        const primaryKey = model.primaryKey;
        if (primaryKey?.fields) {
            let compoundName = primaryKey.fields.reduce((acc: string, fieldName: string) => acc + '_' + fieldName, '');
            compoundName = compoundName.substring(1);
            return compoundName;
        } else {
            return null;
        }
    }

    public getUniqueInputType(model: DMMF.Model): string | null {

        const primaryKey = model.primaryKey;
        if (primaryKey?.fields) {
            let compoundName = primaryKey.fields.reduce((acc: string, fieldName: string) => acc + this.capitalize(fieldName), '');
            return compoundName;
        } else {
            return null;
        }
    }

    public capitalize (str: string) {
        if (str.length === 0) {
            return str;
        } else if (str.length === 1) {
            return str.toUpperCase();
        } else {
            return str[0].toUpperCase() + str.substring(1);
        }
    }


    /* public getIdFieldNamesAndTypes(model: DMMF.Model): FieldNameAndType[] {
      const primaryKey = model.primaryKey;
      let fieldNamesAndTypes: FieldNameAndType[] = [];
      if (primaryKey?.fields) {
          fieldNamesAndTypes = primaryKey.fields.map(fieldName => 
              ({
                  name: fieldName,
                  type: this.getMapTypeFromDMMF(model.fields.find(field => field.name === fieldName)!).tsType
              }));
      } else {
          const idField = model.fields.find(field => field.isId === true);
          if (idField) {
              const mapType = this.getMapTypeFromDMMF(idField);
              fieldNamesAndTypes = [{
                  name: idField.name,
                  type: mapType.tsType
              }];
          }
      }
      return fieldNamesAndTypes;
    } */
}
