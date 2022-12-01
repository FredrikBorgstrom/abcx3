export declare const dartBaseClassStub = "/*\n-----------------------------------------------------\nTHIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n-----------------------------------------------------\n*/\n\n#{Imports}\n\nclass #{ClassName} #{ParentClass} {\n#{Fields}\n\n  #{ClassName}({#{ConstructorArgs}});\n\n  factory #{ClassName}.fromJson(Map<String, dynamic> json) =>\n  #{ClassName}(\n    #{fromJsonArgs}\n  );\n";
export declare const dartConstructorArgument = "#{Required} this.#{FieldName}";
export declare const dartConstructorArgumentWithDefaultValue = "#{Required} this.#{FieldName} = #{DefaultValue}";
export declare const dartFromJsonArg = "#{FieldName}: json['#{FieldName}'] as #{Type}#{Nullable}";
export declare const dartFieldStub = "#{Type}#{Operator} #{FieldName};";
export declare const dartFieldStubWithDefaultValue = "#{Type}#{Operator} #{FieldName} = #{DefaultValue};";
//# sourceMappingURL=dart.stub.d.ts.map