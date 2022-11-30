"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEnum = void 0;
const generateEnum = ({ name, values }) => {
    const enumValues = values.map(({ name }) => `${name}="${name}"`).join(',\n');
    return `enum ${name} { \n${enumValues}\n }`;
};
exports.generateEnum = generateEnum;
//# sourceMappingURL=enum.generators.js.map