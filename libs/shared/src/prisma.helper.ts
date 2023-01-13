import { DMMF } from '@prisma/generator-helper';
import { StringFns } from './stringFns';

export interface FieldNameAndType {
    name: string;
    type: string;
}

export type CommentDirectiveName = 'abcx3_omit' | 'abcx3_disableGetAll';

export interface PrismaCommentDirective {
    name: CommentDirectiveName;
    argument?: string;
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

            const decorator = {name: directiveName, argument: argument} satisfies PrismaCommentDirective;

            result.push(decorator);
        }
        return result;
    }
   
}
