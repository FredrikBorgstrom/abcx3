import { DMMF } from "@prisma/generator-helper";
import { StringFns } from "@shared";
import path = require("path");


export type NestFileType = 'input' | 'service' | 'controller' | 'module' | 'enum';

export class NameGenerator {

    private static _singleton: NameGenerator;
    basePath = 'gen';
    prefix = '';

    static get singleton() {
        if (!NameGenerator._singleton) {
            NameGenerator._singleton = new NameGenerator();
        }
        return NameGenerator._singleton;
    }

    private constructor() { }

    getClassName = (model: DMMF.Model | DMMF.DatamodelEnum, fileType: NestFileType) =>
        StringFns.capitalize(this.prefix) + model.name + StringFns.capitalize(fileType);

    getFileName = (model: DMMF.Model | DMMF.DatamodelEnum, fileType: NestFileType) =>
        this.prefix !== '' ?
         StringFns.snakeCase(this.prefix) + '_' + StringFns.snakeCase(model.name) + '.' + fileType:
         StringFns.snakeCase(model.name) + '.' + fileType;
        // StringFns.decapitalizeFileName(model.name, fileType);

    geFilePath = (model: DMMF.Model | DMMF.DatamodelEnum, fileType: NestFileType) =>
        path.join(this.basePath, this.getModelPath(model), this.getFileName(model, fileType) + '.ts');

    private getModelPath = (model: DMMF.Model | DMMF.DatamodelEnum) => StringFns.decapitalize(model.name);
}