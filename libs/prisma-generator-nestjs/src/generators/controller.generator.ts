import { DMMF } from "@prisma/generator-helper";
import { FieldNameAndType, PrismaCommentDirective, PrismaHelper, StringFns } from "@shared";
import { NameGenerator } from "../nameGenerator";
import { NestGeneratorSettings } from "../nest_settings.interface";
import { controllerGetByFieldValuesStub, controllerGetManyByFieldValuesStub, controllerGetManyByManyIdsStub, controllerMethodNames, controllerMethodStubs, controllerReferenceFieldStub, controllerStub } from "../stubs/controller.stub";

const controllerCommentDirectives: Record<string, PrismaCommentDirective> = {
    omit: { name: '@abcx3_omit' },
    disableControllers: { name: '@abcx3_disableControllers' },
    enableCreate: { name: '@abcx3_enableCreate' }
}

export class ControllerGenerator {

    private prismaHelper: PrismaHelper;
    private methodStubs: Record<string, string> = controllerMethodStubs;

    constructor(
        private settings: NestGeneratorSettings,
        private model: DMMF.Model
    ) {
        this.prismaHelper = PrismaHelper.getInstance();
    }

    public async generateContent() {
        let nameGen = NameGenerator.singleton;
        let content = controllerStub;
        content = content.replace(/#{AutoGeneratedWarningText}/g, this.settings.AutoGeneratedWarningText);

        const idFieldAndType = PrismaHelper.getInstance().getIdFieldNameAndType(this.model);

        const commentDirectives = this.prismaHelper.parseDocumentation(this.model);

        const methodsToApply = this.getMethodsToApply(commentDirectives);
        content = this.applyMethods(content, methodsToApply, idFieldAndType);

        content = content.replace(/#{ControllerClassName}/g, nameGen.getClassName(this.model, 'controller'));
        content = content.replace(/#{Model}/g, this.model.name);
        content = content.replace(/#{model}/g, this.model.name.toLowerCase());
        content = content.replace(/#{moDel}/g, StringFns.decapitalize(this.model.name));
        content = content.replace(/#{ServiceName}/g, nameGen.getClassName(this.model, 'service'));
        content = content.replace(/#{CrudServiceFileName}/g, nameGen.getFileName(this.model, 'service'));

        content = content.replace(/#{getByFieldValues}/g, this.createFieldRoutes());

        let guardImportContent: string, guardsContent: string;

        if (this.settings?.GuardClass) {
            guardImportContent = `import {${this.settings.GuardClass}} from '${this.settings.GuardImportPath}';`;
            guardsContent = `@UseGuards(${this.settings.GuardClass})`;
        } else {
            guardImportContent = '';
            guardsContent = '';
        }
        content = content.replace(/#{ImportGuardClass}/g, guardImportContent);
        content = content.replace(/#{GuardDecorator}/g, guardsContent);

        return content;
    }

    private createFieldRoutes() {
        let code = '';
        this.model.fields.forEach(field => {
            if (field.kind != 'object' || (field.kind === 'object' && field.isList && field.relationFromFields?.length === 0)) {
                let content: string;
                if (field.kind != 'object') {
                    content = (field.isUnique || field.isId) ? controllerGetByFieldValuesStub : controllerGetManyByFieldValuesStub;
                } else {
                    content = controllerGetManyByManyIdsStub
                }
                content = content.replace(/#{GuardDecorator}/g, this.settings?.GuardClass ? `@UseGuards(${this.settings.GuardClass})` : '');
                const tsType = this.prismaHelper.convertToTypescriptType(field);
                content = content.replace(/#{Model}/g, this.model.name);
                content = content.replace(/#{convertToInt}/g, (tsType === 'number') ? '+' : '');
                content = content.replace(/#{FieldType}/g, tsType);
                content = content.replace(/#{fieldName}/g, field.name);
                content = content.replace(/#{FieldNameCapitalized}/g, StringFns.capitalize(field.name));
                code += content + '\n\n';
            }
        });
        return code;
    }


    addReferenceFieldMethods() {
        let code = '';
        const referenceFields = this.prismaHelper.getReferenceFields(this.model);
        referenceFields.forEach(field => {
            let stub = controllerReferenceFieldStub;
            stub = stub.replace(/#{RelationMethodReturnType}/g, field.isList ? `${field.type}[]` : field.type);
            stub = stub.replace(/#{RelationFieldType}/g, field.type);
            stub = stub.replace(/#{RelationFieldName}/g, field.name);
            stub = stub.replace(/#{RelationFieldNameCapitalized}/g, StringFns.capitalize(field.name));
            code += stub;
        });
        return code;
    }

    applyMethods(content: string, methodNames: string[], idFieldAndType: FieldNameAndType | null) {
        methodNames.forEach(methodName => {
            let methodStub = this.methodStubs[methodName];
            if (methodName.includes('ById')) {
                if (idFieldAndType) {
                    methodStub = methodStub.replace(/#{convertToInt}/g, idFieldAndType.type === 'number' ? '+' : '');
                } else {
                    methodStub = '';
                }
            }
            if (methodName === 'referenceField') {
                methodStub = this.addReferenceFieldMethods();
            }
            content = content.replace(new RegExp(`#{${methodName}}`, 'g'), methodStub);
        });

        // remove unused methods
        const allMethodNames = [...controllerMethodNames];
        allMethodNames.forEach(method => content = content.replace(new RegExp(`#{${method}}`, 'g'), ''));
        return content;
    }

    getMethodsToApply(commentDirectives: PrismaCommentDirective[]): string[] {

        const methodNames = [...controllerMethodNames];
        const appliedMethodNames = [...methodNames];

        commentDirectives.forEach(directive => {
            if (directive.name === '@abcx3_disableControllers') {
                const disabledMethods = directive.argument?.split(',');
                disabledMethods?.forEach(methodName => {
                    const idx = appliedMethodNames.indexOf(methodName);
                    if (idx > -1) {
                        appliedMethodNames.splice(idx, 1);
                    }
                });
            } else if (false) {
            } else {
            }
        });

        // content = content.replace(new RegExp(`#{${methodName}}`, 'g'), controllerIdMethodsStub[methodName]);

        // content = content.replace(/#{CommentDirectives}/g, commentDirectives.join(' '));

        return appliedMethodNames;
    }
}