"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
const path = require("path");
function normalizeOptions(tree, options) {
    const projectDirectory = (0, devkit_1.names)(options.directory).fileName;
    const projectRoot = `${projectDirectory}`;
    const prismergeFileName = (0, devkit_1.names)(options.name).fileName;
    const prismaSchemaFilePath = (0, devkit_1.names)(options.output).fileName;
    return Object.assign(Object.assign({}, options), { projectRoot,
        projectDirectory,
        prismergeFileName,
        prismaSchemaFilePath });
}
function addFiles(tree, options) {
    const templateOptions = Object.assign(Object.assign(Object.assign({}, options), (0, devkit_1.names)(options.name)), { offsetFromRoot: (0, devkit_1.offsetFromRoot)(options.projectRoot), template: '' });
    (0, devkit_1.generateFiles)(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}
function default_1(tree, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const normalizedOptions = normalizeOptions(tree, options);
        addFiles(tree, normalizedOptions);
        yield (0, devkit_1.formatFiles)(tree);
    });
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map