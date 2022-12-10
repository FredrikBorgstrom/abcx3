import { DMMF } from "@prisma/generator-helper";
import { lowerCaseFirstChar, upperCaseFirstChar } from "./utils/utils";

export type NestFileType = 'service' | 'controller' | 'module';

export class NameGenerator {

    static _singleton: NameGenerator;

    public get singleton() {
        return NameGenerator._singleton;
    } 

    constructor(private basePath: string) {}

    static generateClassName = (model: DMMF.Model, fileType: NestFileType) =>
        model.name + upperCaseFirstChar(fileType);

    static generateFileName = (model: DMMF.Model, fileType: NestFileType) =>
        lowerCaseFirstChar(model.name) + '.' + fileType;
}