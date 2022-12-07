"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudServiceGenerator_old = void 0;
const crud_service_stub_1 = require("./../stubs/crud.service.stub");
const path = __importStar(require("path"));
const fs_1 = require("fs");
const utils_1 = require("../utils/utils");
const prisma_helper_1 = require("../helpers/prisma.helper");
class CrudServiceGenerator_old {
    config;
    model;
    className;
    prismaHelper;
    constructor(config, model, className) {
        this.config = config;
        this.model = model;
        this.className = className;
        this.prismaHelper = prisma_helper_1.PrismaHelper.getInstance();
    }
    async generateContent() {
        let crudServiceContent;
        if (this.config.CRUDAddExceptions === 'true') {
            crudServiceContent = crud_service_stub_1.crudServiceStubWithExceptions;
            crudServiceContent = crudServiceContent.replace(/#{getMethod_neverThrow}/g, this.prismaHelper.modelContainsObjectReference(this.model) ? crud_service_stub_1.getWithInclude_neverThrow : crud_service_stub_1.get_neverThrow);
        }
        else {
            crudServiceContent = crud_service_stub_1.crudServiceStub;
        }
        if (this.config.CRUDStubFile) {
            const stubFullPath = path.join(this.config.schemaPath, this.config.CRUDStubFile);
            console.log(`Loading Stubs from ${stubFullPath}`);
            const customStub = await fs_1.promises.readFile(stubFullPath, { encoding: 'utf-8' });
            crudServiceContent = customStub.toString();
        }
        crudServiceContent = crudServiceContent.replace(/#{PrismaServiceImportPath}/g, this.config.PrismaServiceImportPath);
        const idFieldAndType = this.prismaHelper.getIdFieldNameAndType(this.model);
        // if the model has a unique ID field we insert '...byId' methods:
        if (idFieldAndType) {
            crudServiceContent = crudServiceContent.replace(/#{byIdMethods}/g, crud_service_stub_1.idMethods_neverThrow);
            crudServiceContent = this.replaceInIdMethods(crudServiceContent, idFieldAndType);
        }
        else {
            crudServiceContent = crudServiceContent.replace(/#{byIdMethods}/g, '');
            let compoundkey = prisma_helper_1.PrismaHelper.getInstance().getUniqueInputPropertyName(this.model);
            let compoundType = prisma_helper_1.PrismaHelper.getInstance().getUniqueInputType(this.model);
            let prismaCompoundInputType = `Prisma.${this.model.name}${compoundType}CompoundUniqueInput`;
            crudServiceContent = crudServiceContent.replace(/#{uniqueInputType}/g, prismaCompoundInputType);
            crudServiceContent = crudServiceContent.replace(/#{uniqueKeyAndVal}/g, `{${compoundkey}: uniqueProps}`);
        }
        crudServiceContent = crudServiceContent.replace(/#{CrudServiceClassName}/g, this.className);
        crudServiceContent = crudServiceContent.replace(/#{Model}/g, this.model.name);
        crudServiceContent = crudServiceContent.replace(/#{MODEL}/g, this.model.name.toUpperCase());
        crudServiceContent = crudServiceContent.replace(/#{model}/g, this.model.name.toLowerCase());
        crudServiceContent = crudServiceContent.replace(/#{moDel}/g, (0, utils_1.lowerCaseFirstChar)(this.model.name));
        return crudServiceContent;
    }
    replaceInIdMethods(content, fieldNameAndType) {
        content = content.replace(/#{idName}/g, fieldNameAndType.name);
        content = content.replace(/#{idType}/g, fieldNameAndType.type);
        content = content.replace(/#{uniqueInputType}/g, `Prisma.${this.model.name}WhereUniqueInput`);
        content = content.replace(/#{uniqueKeyAndVal}/g, "uniqueProps");
        return content;
    }
}
exports.CrudServiceGenerator_old = CrudServiceGenerator_old;
//# sourceMappingURL=crud.service.generator%20copy.js.map