"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = __importDefault(require("./generator"));
const testing_1 = require("./../../helpers/testing");
describe('add-model generator', () => {
    let appTree;
    const options = {
        name: 'test',
        directory: 'test',
        library: 'test',
        app: 'app',
        prismergeFile: './prismerge.json',
    };
    beforeEach(() => {
        appTree = (0, testing_1.createTreeWithLibrary)(options.library);
        appTree.write(options.prismergeFile, JSON.stringify({ input: [], output: './prisma/schema.prisma' }));
    });
    it('should run successfully', async () => {
        await expect((0, generator_1.default)(appTree, options)).resolves.not.toThrowError();
    });
});
//# sourceMappingURL=generator.spec.js.map