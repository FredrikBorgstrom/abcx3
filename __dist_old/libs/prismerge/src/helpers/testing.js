"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTreeWithLibrary = void 0;
const testing_1 = require("@nrwl/devkit/testing");
function createTreeWithLibrary(libName) {
    const tree = (0, testing_1.createTreeWithEmptyWorkspace)();
    tree.write('workspace.json', String.raw `
      {
        "projects": {
          "${libName}": {
            "root": "libs/${libName}",
            "sourceRoot": "apps/${libName}/src",
            "projectType": "library",
            "targets":{}
          }
        }
      }
    `);
    return tree;
}
exports.createTreeWithLibrary = createTreeWithLibrary;
//# sourceMappingURL=testing.js.map