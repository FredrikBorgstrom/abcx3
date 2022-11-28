export declare const dartBaseClassStub = "/*\n-----------------------------------------------------\nTHIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n-----------------------------------------------------\n*/\n\n#{Imports}\n\nclass #{NameBaseInput} #{ParentClass} {\n  #{Fields}\n}\n\n#{CreateClassStub}\n#{UpdateClassStub}\n\n#{NameBaseInput}({#{ConstructorArgs}});\n";
export declare const dartConstructorArgument = "#{Operator} this.#{Type} #{FieldName}";
export declare const dartConstructorArgumentWithDefaultValue = "#{Operator} this.#{Type} #{FieldName} = #{DefaultValue}";
export declare const dartFieldStub = "\n#{Type}#{Operator} #{FieldName};";
export declare const dartFieldStubWithDefaultValue = "\n#{Type}#{Operator} #{FieldName} = #{DefaultValue};\n";
export declare const dartCreateClassStub = "\nexport class #{NameCreateInput} extends OmitType(#{NameParentInput}, [#{OmitFields}] as const) {}\n";
export declare const dartUpdateClassStub = "\nexport class #{NameUpdateInput} extends PartialType(#{NameParentInput}) {}\n";
//# sourceMappingURL=dart.stub.d.ts.map