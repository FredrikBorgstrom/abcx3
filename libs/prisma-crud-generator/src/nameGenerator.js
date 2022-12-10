"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameGenerator = void 0;
const utils_1 = require("./utils/utils");
class NameGenerator {
    basePath;
    static _singleton;
    get singleton() {
        return NameGenerator._singleton;
    }
    constructor(basePath) {
        this.basePath = basePath;
    }
    static generateClassName = (model, fileType) => model.name + (0, utils_1.upperCaseFirstChar)(fileType);
    static generateFileName = (model, fileType) => (0, utils_1.lowerCaseFirstChar)(model.name) + '.' + fileType;
}
exports.NameGenerator = NameGenerator;
//# sourceMappingURL=nameGenerator.js.map