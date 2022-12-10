import { DMMF } from "@prisma/generator-helper";
export type NestFileType = 'service' | 'controller' | 'module';
export declare class NameGenerator {
    private basePath;
    static _singleton: NameGenerator;
    get singleton(): NameGenerator;
    constructor(basePath: string);
    static generateClassName: (model: DMMF.Model, fileType: NestFileType) => string;
    static generateFileName: (model: DMMF.Model, fileType: NestFileType) => string;
}
//# sourceMappingURL=nameGenerator.d.ts.map