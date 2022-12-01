import { DMMF } from '@prisma/generator-helper';
export interface FieldNameAndType {
    name: string;
    type: string;
}
export declare class PrismaHelper {
    static instance: PrismaHelper;
    static getInstance(): PrismaHelper;
    getUniqueInputPropertyName(model: DMMF.Model): string | null;
    getUniqueInputType(model: DMMF.Model): string | null;
    capitalize(str: string): string;
}
//# sourceMappingURL=prisma.helper.d.ts.map