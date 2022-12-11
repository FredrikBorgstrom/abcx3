"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upperCaseFirstChar = exports.lowerCaseFirstChar = void 0;
function lowerCaseFirstChar(text) {
    return text.charAt(0).toLowerCase() + text.slice(1);
}
exports.lowerCaseFirstChar = lowerCaseFirstChar;
function upperCaseFirstChar(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
exports.upperCaseFirstChar = upperCaseFirstChar;
//# sourceMappingURL=utils.js.map