"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dartFieldStubWithDefaultValue = exports.dartFieldStub = exports.dartConstructorArgumentWithDefaultValue = exports.dartConstructorArgument = exports.dartBaseClassStub = void 0;
exports.dartBaseClassStub = `/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

#{Imports}

class #{NameBaseInput} #{ParentClass} {
#{Fields}

  #{NameBaseInput}({#{ConstructorArgs}});
}


`;
exports.dartConstructorArgument = `#{Required} this.#{FieldName}`;
exports.dartConstructorArgumentWithDefaultValue = `#{Required} this.#{FieldName} = #{DefaultValue}`;
exports.dartFieldStub = `#{Type}#{Operator} #{FieldName};`;
exports.dartFieldStubWithDefaultValue = `#{Type}#{Operator} #{FieldName} = #{DefaultValue};`;
//# sourceMappingURL=dart.stub.js.map