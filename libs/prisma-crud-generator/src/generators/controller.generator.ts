import { DMMF } from "@prisma/generator-helper";
import { PrismaHelper } from "../helpers/prisma.helper";
import { GeneratorSettings } from "../interfaces/generator.interface";
import { controllerStub } from "../stubs/controller.stub";


export class ControllerGenerator {
    private prismaHelper: PrismaHelper;

    constructor(
        private config: GeneratorSettings,
        private model: DMMF.Model,
        private className: string,
    ) {
        this.prismaHelper = PrismaHelper.getInstance();
    }


    public async generateContent() {
        let content = controllerStub;

        content = content.replace(
            /#{ControllerClassName}/g,
            this.className,
        );

        const guardsContent = this.config?.GuardClass ? `@UseGuards(${this.config.GuardClass})` : '';

        content = content.replace(
            /#{GuardDecorator}/g,
            guardsContent,
        );

        return content;
    }
}