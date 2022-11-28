"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dartUpdateClassStub = exports.dartCreateClassStub = exports.dartFieldStubWithDefaultValue = exports.dartFieldStub = exports.dartConstructorArgumentWithDefaultValue = exports.dartConstructorArgument = exports.dartBaseClassStub = void 0;
exports.dartBaseClassStub = `/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

#{Imports}

class #{NameBaseInput} #{ParentClass} {
  #{Fields}
}

#{CreateClassStub}
#{UpdateClassStub}

#{NameBaseInput}({#{ConstructorArgs}});
`;
exports.dartConstructorArgument = `#{Operator} this.#{Type} #{FieldName}`;
exports.dartConstructorArgumentWithDefaultValue = `#{Operator} this.#{Type} #{FieldName} = #{DefaultValue}`;
exports.dartFieldStub = `
#{Type}#{Operator} #{FieldName};`;
exports.dartFieldStubWithDefaultValue = `
#{Type}#{Operator} #{FieldName} = #{DefaultValue};
`;
exports.dartCreateClassStub = `
export class #{NameCreateInput} extends OmitType(#{NameParentInput}, [#{OmitFields}] as const) {}
`;
exports.dartUpdateClassStub = `
export class #{NameUpdateInput} extends PartialType(#{NameParentInput}) {}
`;
//# sourceMappingURL=dart.stub.js.map