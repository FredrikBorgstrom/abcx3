"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDartEnum = exports.generateEnum = void 0;
const generateEnum = ({ name, values }) => {
    const enumValues = values.map(({ name }) => `${name}="${name}"`).join(',\n');
    return `enum ${name} { \n${enumValues}\n }`;
};
exports.generateEnum = generateEnum;
const generateDartEnum = ({ name, values }) => {
    const enumValues = values.map(({ name }) => name).join(',\n\t');
    return `enum ${name} {\n\t${enumValues}\n}`;
};
exports.generateDartEnum = generateDartEnum;
//# sourceMappingURL=enum.generators.js.map