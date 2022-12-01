import { DMMF } from '@prisma/generator-helper';

export interface FieldNameAndType {
    name: string;
    type: string;
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
}
