import { DMMF } from "@prisma/generator-helper";
import { StringFns } from "libs/shared/src/stringFns";
import path = require("path");


export type NestFileType = 'input' | 'service' | 'controller' | 'module' | 'enum';

export class NameGenerator {

    private static _singleton: NameGenerator;
    basePath = 'gen';

    static get singleton() {
        if (!NameGenerator._singleton) {
            NameGenerator._singleton = new NameGenerator();
        }
        return NameGenerator._singleton;
    }

    private constructor() {}

    getClassName = (model: DMMF.Model | DMMF.DatamodelEnum, fileType: NestFileType) =>
        model.name + StringFns.capitalize(fileType);

    getFileName = (model: DMMF.Model | DMMF.DatamodelEnum, fileType: NestFileType) =>
        StringFns.decapitalizeFileName(model.name, fileType);


    geFilePath = (model: DMMF.Model | DMMF.DatamodelEnum, fileType: NestFileType) =>
        path.join(this.basePath, this.getModelPath(model), this.getFileName(model, fileType) + '.ts');

    private getModelPath = (model: DMMF.Model | DMMF.DatamodelEnum) => StringFns.decapitalize(model.name);
}