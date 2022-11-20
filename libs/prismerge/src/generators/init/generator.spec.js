"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nrwl/devkit/testing");
const generator_1 = __importDefault(require("./generator"));
describe('init generator', () => {
    let appTree;
    const options = {
        name: 'prismerge.json',
        output: './prisma/schema.prisma',
        directory: '.',
    };
    beforeEach(() => {
        appTree = (0, testing_1.createTreeWithEmptyWorkspace)();
    });
    it('should run successfully', async () => {
        await expect((0, generator_1.default)(appTree, options)).resolves.not.toThrowError();
    });
});
//# sourceMappingURL=generator.spec.js.map