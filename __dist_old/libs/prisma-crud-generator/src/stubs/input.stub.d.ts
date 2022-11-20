export declare const inputBaseClassStub = "/*\n-----------------------------------------------------\nTHIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n-----------------------------------------------------\n*/\n\n#{Imports}\n\nexport class #{NameBaseInput} #{ParentClass} {\n  #{Fields}\n}\n\n#{CreateClassStub}\n#{UpdateClassStub}\n";
export declare const inputFieldStub = "\n#{Decorators}\n#{FieldName}#{Operator}: #{Type};\n";
export declare const inputFieldStubWithDefaultValue = "\n#{Decorators}\n#{FieldName}#{Operator}: #{Type} = #{DefaultValue};\n";
export declare const inputCreateClassStub = "\nexport class #{NameCreateInput} extends OmitType(#{NameParentInput}, [#{OmitFields}] as const) {}\n";
export declare const inputUpdateClassStub = "\nexport class #{NameUpdateInput} extends PartialType(#{NameParentInput}) {}\n";
