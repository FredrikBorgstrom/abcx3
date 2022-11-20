"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudServiceGenerator = void 0;
const tslib_1 = require("tslib");
const crud_service_stub_1 = require("./../stubs/crud.service.stub");
const path = require("path");
const fs_1 = require("fs");
const utils_1 = require("../utils/utils");
class CrudServiceGenerator {
    constructor(config, model, className) {
        this.config = config;
        this.model = model;
        this.className = className;
    }
    generateContent() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let crudServiceContent;
            if (this.config.CRUDAddExceptions === 'true') {
                crudServiceContent = crud_service_stub_1.crudServiceStubWithExceptions;
            }
            else {
                crudServiceContent = crud_service_stub_1.crudServiceStub;
            }
            if (this.config.CRUDStubFile) {
                const stubFullPath = path.join(this.config.schemaPath, this.config.CRUDStubFile);
                console.log(`Loading Stubs from ${stubFullPath}`);
                const customStub = yield fs_1.promises.readFile(stubFullPath, { encoding: 'utf-8' });
                crudServiceContent = customStub.toString();
            }
            // replace variables
            crudServiceContent = crudServiceContent.replace(/#{CrudServiceClassName}/g, this.className);
            crudServiceContent = crudServiceContent.replace(/#{Model}/g, this.model.name);
            crudServiceContent = crudServiceContent.replace(/#{MODEL}/g, this.model.name.toUpperCase());
            crudServiceContent = crudServiceContent.replace(/#{model}/g, this.model.name.toLowerCase());
            crudServiceContent = crudServiceContent.replace(/#{moDel}/g, (0, utils_1.lowerCaseFirstChar)(this.model.name));
            return crudServiceContent;
        });
    }
}
exports.CrudServiceGenerator = CrudServiceGenerator;
//# sourceMappingURL=crud.service.generator.js.map