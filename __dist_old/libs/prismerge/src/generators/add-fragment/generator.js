"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const devkit_1 = require("@nrwl/devkit");
const path = require("path");
const lodash_1 = require("lodash");
const prismerge_stub_1 = require("../../ui/prismerge.stub");
function default_1(tree, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const fragment = (0, devkit_1.names)(options.name).fileName;
        const fragmentName = (0, devkit_1.names)(options.name).className;
        const templateSchema = Object.assign(Object.assign(Object.assign({}, options), (0, devkit_1.names)(options.name)), { fragment: fragment, fragmentName: fragmentName, template: '' });
        const modelRoot = path.join((0, devkit_1.readProjectConfiguration)(tree, options.library).root, options.directory);
        (0, devkit_1.generateFiles)(tree, path.join(__dirname, './files'), modelRoot, templateSchema);
        (0, devkit_1.updateJson)(tree, options.prismergeFile, (content) => {
            (0, lodash_1.set)(content, `${options.app}`, (0, lodash_1.defaultsDeep)(content[options.app], prismerge_stub_1.prismergeFileAppStub));
            content[options.app].fragments = Object.assign(Object.assign({}, content[options.app].fragments), { [fragment]: `${modelRoot}/${options.name}.prisma.fragment` });
            return content;
        });
        yield (0, devkit_1.formatFiles)(tree);
    });
}
exports.default = default_1;
//# sourceMappingURL=generator.js.map