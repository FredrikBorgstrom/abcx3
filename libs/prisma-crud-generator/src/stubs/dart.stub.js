"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dartFieldStubWithDefaultValue = exports.dartFieldStub = exports.dartFromJsonArg = exports.dartConstructorArgumentWithDefaultValue = exports.dartConstructorArgument = exports.dartBaseClassStub = void 0;
exports.dartBaseClassStub = `/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

#{Imports}

class #{ClassName} #{ParentClass} {
#{Fields}

  #{ClassName}({#{ConstructorArgs}});

  factory #{ClassName}.fromJson(Map<String, dynamic> json) =>
  #{ClassName}(
    #{fromJsonArgs}
  );
`;
exports.dartConstructorArgument = `#{Required} this.#{FieldName}`;
exports.dartConstructorArgumentWithDefaultValue = `#{Required} this.#{FieldName} = #{DefaultValue}`;
exports.dartFromJsonArg = `#{FieldName}: json['#{FieldName}'] as #{Type}#{Nullable}`;
exports.dartFieldStub = `#{Type}#{Operator} #{FieldName};`;
exports.dartFieldStubWithDefaultValue = `#{Type}#{Operator} #{FieldName} = #{DefaultValue};`;
//# sourceMappingURL=dart.stub.js.map