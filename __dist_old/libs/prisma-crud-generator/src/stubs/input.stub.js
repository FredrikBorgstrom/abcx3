"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputUpdateClassStub = exports.inputCreateClassStub = exports.inputFieldStubWithDefaultValue = exports.inputFieldStub = exports.inputBaseClassStub = void 0;
exports.inputBaseClassStub = `/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

#{Imports}

export class #{NameBaseInput} #{ParentClass} {
  #{Fields}
}

#{CreateClassStub}
#{UpdateClassStub}
`;
exports.inputFieldStub = `
#{Decorators}
#{FieldName}#{Operator}: #{Type};
`;
exports.inputFieldStubWithDefaultValue = `
#{Decorators}
#{FieldName}#{Operator}: #{Type} = #{DefaultValue};
`;
exports.inputCreateClassStub = `
export class #{NameCreateInput} extends OmitType(#{NameParentInput}, [#{OmitFields}] as const) {}
`;
exports.inputUpdateClassStub = `
export class #{NameUpdateInput} extends PartialType(#{NameParentInput}) {}
`;
//# sourceMappingURL=input.stub.js.map