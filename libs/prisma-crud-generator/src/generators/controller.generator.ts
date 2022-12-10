import { DMMF } from "@prisma/generator-helper";
import { PrismaHelper } from "../helpers/prisma.helper";
import { GeneratorSettings } from "../interfaces/generator.interface";
import { controllerStub } from "../stubs/controller.stub";
import { lowerCaseFirstChar } from "../utils/utils";


export class ControllerGenerator {

    constructor(
        private config: GeneratorSettings,
        private model: DMMF.Model,
        private controllerName: string,
        private serviceName: string,
        private serviceFileName: string,
    ) {}


    public async generateContent() {
        let content = controllerStub;

        content = content.replace(/#{ControllerClassName}/g, this.controllerName);
        content = content.replace(/#{Model}/g, this.model.name);
        content = content.replace(/#{model}/g, this.model.name.toLowerCase());
        content = content.replace(/#{moDel}/g, lowerCaseFirstChar(this.model.name));

        content = content.replace(/#{ServiceName}/g, this.serviceName);
        content = content.replace(/#{CrudServiceFileName}/g, this.serviceFileName);


        let guardImportContent: string, guardsContent: string;

        if (this.config?.GuardClass) {
            guardImportContent = `import {${this.config.GuardClass}} from '${this.config.GuardImportPath}';`;
            guardsContent = `@UseGuards(${this.config.GuardClass})`;
        } else {
            guardImportContent = '';
            guardsContent = '';
        }
        content = content.replace(/#{ImportGuardClass}/g, guardImportContent);
        content = content.replace(/#{GuardDecorator}/g, guardsContent);

        return content;
    }
}