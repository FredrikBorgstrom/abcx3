"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoratorHelper = void 0;
class DecoratorHelper {
    constructor(name, importFrom, options = '') {
        this.name = name;
        this.importFrom = importFrom;
        this.options = options;
        if (this.name.startsWith('@')) {
            this.name = this.name.substring(1);
        }
    }
    generateContent() {
        return `@${this.name}(${this.options})`;
    }
}
exports.DecoratorHelper = DecoratorHelper;
//# sourceMappingURL=decorator.helper.js.map