"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputGenerator = void 0;
const tslib_1 = require("tslib");
const decorator_helper_1 = require("../helpers/decorator.helper");
const prisma_helper_1 = require("../helpers/prisma.helper");
const input_stub_1 = require("../stubs/input.stub");
class InputGenerator {
    constructor(config, model) {
        this.config = config;
        this.model = model;
        this.fieldDecorators = [];
        this.omitFields = [];
    }
    generateContent() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let content = yield this.generateBaseInput();
            const createInputStub = this.generateCreateInput();
            content = content.replace(/#{CreateClassStub}/g, createInputStub);
            const createUpdateStub = this.generateUpdateInput();
            content = content.replace(/#{UpdateClassStub}/g, createUpdateStub);
            content = content.replace(/#{Imports}/g, this.generateImportStatements());
            return content;
        });
    }
    getBaseInputClassName() {
        return `${this.model.name}${this.config.InputSuffix}`;
    }
    getCreateInputClassName() {
        return `${this.config.InputCreatePrefix}${this.model.name}${this.config.InputSuffix}`;
    }
    getUpdateInputClassName() {
        return `${this.config.InputUpdatePrefix}${this.model.name}${this.config.InputSuffix}`;
    }
    generateBaseInput() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let content = input_stub_1.inputBaseClassStub;
            const className = this.getBaseInputClassName();
            content = content.replace(/#{NameBaseInput}/g, className);
            // ------------------------------------------
            // handle the parent class (extends)
            if (this.config.InputParentClass) {
                content = content.replace(/#{ParentClass}/g, `extends ${this.config.InputParentClass}`);
            }
            if (this.config.InputParentClassPath) {
                this.addDecoratorToImport(new decorator_helper_1.DecoratorHelper(this.config.InputParentClass + '', this.config.InputParentClassPath + ''));
            }
            content = content.replace(/#{ParentClass}/g, '');
            // ------------------------------------------
            let fieldsContent = '';
            for (const field of this.model.fields) {
                const fieldContent = yield this.generateFieldContent(field);
                fieldsContent = fieldsContent + fieldContent;
            }
            content = content.replace(/#{Fields}/g, fieldsContent);
            return content;
        });
    }
    generateCreateInput() {
        let content = input_stub_1.inputCreateClassStub;
        const parentClassName = this.getBaseInputClassName();
        const className = this.getCreateInputClassName();
        content = content.replace(/#{NameParentInput}/g, parentClassName);
        content = content.replace(/#{NameCreateInput}/g, className);
        const omitFieldString = this.omitFields
            .map((field) => `'${field}'`)
            .join(',');
        content = content.replace(/#{OmitFields}/g, omitFieldString);
        this.addDecoratorToImport(new decorator_helper_1.DecoratorHelper('OmitType', '@nestjs/swagger'));
        return content;
    }
    generateUpdateInput() {
        let content = input_stub_1.inputUpdateClassStub;
        const parentClassName = this.getCreateInputClassName();
        const className = this.getUpdateInputClassName();
        content = content.replace(/#{NameParentInput}/g, parentClassName);
        content = content.replace(/#{NameUpdateInput}/g, className);
        this.addDecoratorToImport(new decorator_helper_1.DecoratorHelper('PartialType', '@nestjs/swagger'));
        return content;
    }
    generateFieldContent(field) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let content = input_stub_1.inputFieldStub;
            content = content.replace(/#{FieldName}/g, field.name);
            const typeMap = prisma_helper_1.PrismaHelper.getInstance().getMapTypeFromDMMF(field, this.config.InputValidatorPackage);
            const tsType = typeMap.tsType;
            const validatorDecorators = typeMap.validators;
            content = content.replace(/#{Type}/g, tsType);
            let isOptionalDecorator = '';
            if (field.isRequired === false) {
                content = content.replace(/#{Operator}/g, '?');
                const isOptionalDecoratorHelper = new decorator_helper_1.DecoratorHelper('IsOptional', this.config.InputValidatorPackage);
                this.addDecoratorToImport(isOptionalDecoratorHelper);
                isOptionalDecorator = isOptionalDecoratorHelper.generateContent();
            }
            else {
                if (this.config.strict === 'true') {
                    content = content.replace(/#{Operator}/g, '!');
                }
                else {
                    content = content.replace(/#{Operator}/g, '');
                }
            }
            let openApiDecoratorsContent = '';
            if (this.config.GenerateInputSwagger === 'true') {
                const openApiDecorators = prisma_helper_1.PrismaHelper.getInstance().generateSwaggerDecoratorsFromDMMF(field);
                // append the new decorators
                for (const fieldDecorator of openApiDecorators) {
                    this.addDecoratorToImport(fieldDecorator);
                }
                openApiDecoratorsContent = openApiDecorators
                    .map((decorator) => {
                    return decorator.generateContent();
                })
                    .join('\n');
            }
            // add auto validators from type!
            let validatorDecoratorsContent = '';
            for (const validatorDecorator of validatorDecorators) {
                this.addDecoratorToImport(validatorDecorator);
                validatorDecoratorsContent =
                    validatorDecoratorsContent + validatorDecorator.generateContent();
            }
            // and now we add some custom decorators based on documentation
            const documentation = field.documentation;
            let customDecoratorsContent = '';
            if (documentation) {
                // we need to process this properly
                const customDecorators = this.parseDocumentation(field);
                for (const customDecorator of customDecorators) {
                    // check, if the current field has an @Omit() decorator, so we skip everything
                    if (customDecorator.name === 'Omit') {
                        this.omitFields.push(field.name);
                        continue;
                    }
                    // if the element has an @Relation() decorator
                    if (customDecorator.name === 'Relation') {
                        // for now, we do nothing
                        this.omitFields.push(field.name);
                        continue;
                    }
                    // if the element has an @RelationId() decorator
                    if (customDecorator.name === 'RelationId') {
                        // for now, we do nothing
                        this.omitFields.push(field.name);
                        continue;
                    }
                    customDecoratorsContent =
                        customDecoratorsContent + customDecorator.generateContent();
                    this.addDecoratorToImport(customDecorator);
                }
            }
            let fieldDecoratorsAndCustomDecoratorsContent = '';
            fieldDecoratorsAndCustomDecoratorsContent =
                openApiDecoratorsContent +
                    isOptionalDecorator +
                    validatorDecoratorsContent +
                    customDecoratorsContent;
            content = content.replace(/#{Decorators}/g, fieldDecoratorsAndCustomDecoratorsContent);
            return content;
        });
    }
    addDecoratorToImport(decorator) {
        let found = false;
        for (const existingDecorator of this.fieldDecorators) {
            if (decorator.name === existingDecorator.name &&
                decorator.importFrom === existingDecorator.importFrom) {
                found = true;
                break;
            }
        }
        if (found === false) {
            this.fieldDecorators.push(decorator);
        }
    }
    generateImportStatements() {
        let result = '';
        for (const decorator of this.fieldDecorators) {
            result = `${result}import {${decorator.name}} from '${decorator.importFrom}';\n`;
        }
        return result;
    }
    parseDocumentation(field) {
        let documentation = field.documentation || '';
        documentation = documentation.replace(/(\r\n|\n|\r)/gm, ' ');
        const customDecorators = documentation.split(' ');
        const result = [];
        for (const customDecorator of customDecorators) {
            const decoratorParamsIndex = customDecorator.indexOf('(');
            const decoratorParams = customDecorator.substring(decoratorParamsIndex + 1, customDecorator.lastIndexOf(')'));
            const decoratorName = customDecorator.substring(0, decoratorParamsIndex);
            const decorator = new decorator_helper_1.DecoratorHelper(decoratorName, this.config.InputValidatorPackage, decoratorParams);
            result.push(decorator);
        }
        return result;
    }
}
exports.InputGenerator = InputGenerator;
//# sourceMappingURL=input.generator.js.map