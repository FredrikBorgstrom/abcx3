"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleGenerator = void 0;
class ModuleGenerator {
    config;
    model;
    className;
    serviceName;
    serviceFileName;
    constructor(config, model, className, serviceName, serviceFileName) {
        this.config = config;
        this.model = model;
        this.className = className;
        this.serviceName = serviceName;
        this.serviceFileName = serviceFileName;
    }
}
exports.ModuleGenerator = ModuleGenerator;
//# sourceMappingURL=module.generator.js.map