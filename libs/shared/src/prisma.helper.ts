import { DMMF } from '@prisma/generator-helper';
import { StringFns } from './stringFns';

export interface FieldNameAndType {
    name: string;
    type: string;
}

export type CommentDirectiveName = 'abcx3_omit' | 'abcx3_disableControllers' | 'abcx3_enableControllers';

// export enum ControllerMethodNames { 'create', 'getAll', 'getFiltered', 'getUnique', 'update', 'getById', 'updateById', 'deleteById' };
export enum ControllerMethodNames { create, getAll, getFiltered, getUnique, update, getById, updateById, deleteById };

export type ControllerMethod = keyof typeof ControllerMethodNames;


export interface PrismaCommentDirective {
    name: CommentDirectiveName;
    argument?: string;
}

export const PrismaTypeScriptTypeMap = {
    BigInt: 'BigInt',
    Boolean: 'boolean',
    Bytes: 'Buffer',
    DateTime: 'Date',
    Decimal: 'number',
    Float: 'number',
    Int: 'number',
    Json: 'object',
    String: 'string'
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
        return (!tsType) ? field.type : tsType;
    }

    public getIdFieldNameAndType(model: DMMF.Model): FieldNameAndType | null {
        const idField = model.fields.find(field => field.isId === true);
        if (idField) {
            return {
                name: idField.name,
                type: this.convertToTypescriptType(idField)
            };
        } else {
            return null;
        }
    }

    public modelContainsObjectReference = (model: DMMF.Model): boolean => model.fields.some(field => field.kind === 'object');

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
