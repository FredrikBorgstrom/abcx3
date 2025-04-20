import { DMMF, GeneratorOptions } from '@prisma/generator-helper';
import { StringFns } from './stringFns';

export interface FieldNameAndType {
    name: string;
    type: string;
}

export type ProgrammingLanguage = 'typescript' | 'dart';

export type CommentDirectiveName = '@abcx3_omit' | '@abcx3_disableControllers' | '@abcx3_enableControllers' | '@abcx3_enableCreate' | '@abcx3_enableUpdate' | '@abcx3_enableDelete' | '@abcx3_enableGetAll' | '@abcx3_enableGetById' | '@abcx3_enableCreateWithUser' | '@abcx3_enableUpdateWithUser' | '@abcx3_enableDeleteWithUser' | '@abcx3_enableGetAllWithUser' | '@abcx3_enableGetByIdWithUser' | '@abcx3_replaceOnUpdate' | '@abcx3_replaceList';


export interface PrismaCommentDirective {
    name: CommentDirectiveName;
    argument?: string;
}

export const PrismaTypeScriptTypeMap = {
   
    BigInt: 'bigint', // BigInt
    Boolean: 'boolean',
    Bytes: 'Buffer',
    DateTime: 'Date',
    Decimal: 'number',
    Float: 'number',
    Int: 'number',
    Json: 'object',
    String: 'string'
}

export const DartTypeMap = {
    BigInt: 'BigInt',
    Boolean: 'bool',
    Bytes: 'ByteBuffer',
    DateTime: 'DateTime',
    Decimal: 'double',
    Float: 'double',
    Int: 'int',
    Json: 'Json',
    String: 'String'
}

export class PrismaHelper {
    static instance: PrismaHelper;

    static getInstance() {
        if (PrismaHelper.instance) {
            return PrismaHelper.instance;
        }
        PrismaHelper.instance = new PrismaHelper();
        return PrismaHelper.instance;
    }

    public convertToTypescriptType(field: DMMF.Field): string {
        let tsType = PrismaTypeScriptTypeMap[field.type as keyof typeof PrismaTypeScriptTypeMap];
        return (tsType != null) ? tsType : field.type;
    }

    public convertToDartType(field: DMMF.Field): string {
        let dartType = DartTypeMap[field.type as keyof typeof DartTypeMap];
        return dartType ?? field.type;
    }

    public getIdFieldNameAndType(model: DMMF.Model, language: ProgrammingLanguage = 'typescript'): FieldNameAndType | null {
        const idField = model.fields.find(field => field.isId === true);
        if (idField) {
            return this.getFieldNameAndType(idField, language);
        } else {
            return null;
        }
    }

    public getRelationToFieldName(sourceField: DMMF.Field, options: GeneratorOptions) : string | null {
        const relationName = sourceField.relationName;
        const relationModelName = sourceField.type;
        const relationModel = this.getModelByName(relationModelName, options);

        if (relationModel != null) {
            const relationField = this.getFieldWithRelationName(relationModel, relationName!);
            const relationFromFields = relationField?.relationFromFields;
            if (relationFromFields != null && relationFromFields.length > 0) {
                const fromFieldName = relationFromFields[0];
                return fromFieldName;
            }
        }
        return null;
    }

    public getModelByName = (modelName: string, options: GeneratorOptions): DMMF.Model | undefined =>
        options.dmmf.datamodel.models.find(model => model.name === modelName);

    public getFieldWithRelationName = (model: DMMF.Model, relationName: string): DMMF.Field | undefined =>
        model.fields.find(field => field.relationName === relationName);

    public getFieldNameAndType(field: DMMF.Field, language: ProgrammingLanguage = 'typescript'): FieldNameAndType {
        let type: string;
        if (language === 'typescript') {
            type = this.convertToTypescriptType(field);
        } else if (language === 'dart') {
            type = this.convertToDartType(field);
        } else {
            type = field.type;
        }
        return {
            name: field.name,
            type
        };
    }

    // public getReferingField(model: DMMF.Model, referedField: DMMF.Field): DMMF.Field | null {
    // const referingField = model.fields.find(field => field.kind === 'object' && field.type === referencedModel.name);
    // return referingField || null;
    // }

    public modelContainsObjectReference = (model: DMMF.Model): boolean => model.fields.some(field => field.kind === 'object');

    public getReferenceFields = (model: DMMF.Model): DMMF.Field[] => model.fields.filter(field => field.kind === 'object');

    public getUniqueReferenceFields = (model: DMMF.Model): DMMF.Field[] => model.fields.reduce((acc, field) => {
        if (field.kind === 'object' && !acc.some(f => f.type === field.type)) acc.push(field);
        return acc;
    }, [] as DMMF.Field[]); //(field => field.kind === 'object');

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
            let compoundName = primaryKey.fields.reduce((acc: string, fieldName: string) => acc + StringFns.capitalize(fieldName), '');
            return compoundName;
        } else {
            return null;
        }
    }

    public parseDocumentation(field: DMMF.Field | DMMF.Model): PrismaCommentDirective[] {
        let documentation = field.documentation || '';

        documentation = documentation.replace(/(\r\n|\n|\r)/gm, ' ');

        const comments = documentation.split(' ');

        const result: PrismaCommentDirective[] = [];

        for (const comment of comments) {
            const argIndex = comment.indexOf('(');
            const argument = comment.substring(
                argIndex + 1,
                comment.lastIndexOf(')'),
            );

            const directiveName = comment.substring(0, argIndex) as CommentDirectiveName;

            const decorator = { name: directiveName, argument: argument } satisfies PrismaCommentDirective;

            result.push(decorator);
        }
        return result;
    }

}
