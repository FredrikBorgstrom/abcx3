"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaHelper = void 0;
const decorator_helper_1 = require("./decorator.helper");
class PrismaHelper {
    primitiveTypeMap(validatorClass) {
        return {
            bigint: {
                tsType: 'BigInt',
                validators: [new decorator_helper_1.DecoratorHelper('IsNumber', validatorClass)],
            },
            boolean: {
                tsType: 'boolean',
                validators: [new decorator_helper_1.DecoratorHelper('IsBoolean', validatorClass)],
            },
            bytes: {
                tsType: 'Buffer',
                validators: [],
            },
            datetime: {
                tsType: 'Date',
                validators: [new decorator_helper_1.DecoratorHelper('IsISO8601', validatorClass)],
            },
            decimal: {
                tsType: 'number',
                validators: [new decorator_helper_1.DecoratorHelper('IsNumber', validatorClass)],
            },
            float: {
                tsType: 'number',
                validators: [new decorator_helper_1.DecoratorHelper('IsNumber', validatorClass)],
            },
            int: {
                tsType: 'number',
                validators: [new decorator_helper_1.DecoratorHelper('IsInt', validatorClass)],
            },
            json: {
                tsType: 'object',
                validators: [new decorator_helper_1.DecoratorHelper('IsObject', validatorClass)],
            },
            string: {
                tsType: 'string',
                validators: [new decorator_helper_1.DecoratorHelper('IsString', validatorClass)],
            },
        };
    }
    static getInstance() {
        if (PrismaHelper.instance) {
            return PrismaHelper.instance;
        }
        PrismaHelper.instance = new PrismaHelper();
        return PrismaHelper.instance;
    }
    getMapTypeFromDMMF(field, validatorClass = 'class-validator') {
        const mapTypes = this.primitiveTypeMap(validatorClass);
        const mapType = mapTypes[field.type.toLowerCase()];
        if (!mapType) {
            return {
                tsType: 'unknown',
                validators: [new decorator_helper_1.DecoratorHelper('IsDefined', validatorClass)],
            };
        }
        return mapType;
    }
    generateSwaggerDecoratorsFromDMMF(field) {
        const decorators = [];
        if (field.isRequired) {
            decorators.push(new decorator_helper_1.DecoratorHelper('ApiProperty', '@nestjs/swagger'));
        }
        else {
            decorators.push(new decorator_helper_1.DecoratorHelper('ApiProperty', '@nestjs/swagger', JSON.stringify({
                required: false,
            })));
        }
        return decorators;
    }
}
exports.PrismaHelper = PrismaHelper;
//# sourceMappingURL=prisma.helper.js.map