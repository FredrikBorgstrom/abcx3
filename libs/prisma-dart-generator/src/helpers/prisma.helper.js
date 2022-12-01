"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaHelper = void 0;
class PrismaHelper {
    static instance;
    static getInstance() {
        if (PrismaHelper.instance) {
            return PrismaHelper.instance;
        }
        PrismaHelper.instance = new PrismaHelper();
        return PrismaHelper.instance;
    }
    getUniqueInputPropertyName(model) {
        const primaryKey = model.primaryKey;
        if (primaryKey?.fields) {
            let compoundName = primaryKey.fields.reduce((acc, fieldName) => acc + '_' + fieldName, '');
            compoundName = compoundName.substring(1);
            return compoundName;
        }
        else {
            return null;
        }
    }
    getUniqueInputType(model) {
        const primaryKey = model.primaryKey;
        if (primaryKey?.fields) {
            let compoundName = primaryKey.fields.reduce((acc, fieldName) => acc + this.capitalize(fieldName), '');
            return compoundName;
        }
        else {
            return null;
        }
    }
    capitalize(str) {
        if (str.length === 0) {
            return str;
        }
        else if (str.length === 1) {
            return str.toUpperCase();
        }
        else {
            return str[0].toUpperCase() + str.substring(1);
        }
    }
}
exports.PrismaHelper = PrismaHelper;
//# sourceMappingURL=prisma.helper.js.map