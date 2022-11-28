export const dartBaseClassStub = `/*
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

export const dartConstructorArgument = `#{Operator} this.#{Type} #{FieldName}`;
export const dartConstructorArgumentWithDefaultValue = `#{Operator} this.#{Type} #{FieldName} = #{DefaultValue}`;

export const dartFieldStub = `
#{Type}#{Operator} #{FieldName};`;

export const dartFieldStubWithDefaultValue = `
#{Type}#{Operator} #{FieldName} = #{DefaultValue};
`;

export const dartCreateClassStub = `
export class #{NameCreateInput} extends OmitType(#{NameParentInput}, [#{OmitFields}] as const) {}
`;

export const dartUpdateClassStub = `
export class #{NameUpdateInput} extends PartialType(#{NameParentInput}) {}
`;
