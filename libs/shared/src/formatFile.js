"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFile = void 0;
const prettier_1 = require("prettier");
const formatFile = (content) => new Promise((res, rej) => (0, prettier_1.resolveConfig)(process.cwd()).then((options) => {
    if (!options) {
        res(content);
    }
    try {
        const formatted = (0, prettier_1.format)(content, {
            ...options,
            parser: 'typescript',
        });
        res(formatted);
    }
    catch (error) {
        rej(error);
    }
}));
exports.formatFile = formatFile;
//# sourceMappingURL=formatFile.js.map