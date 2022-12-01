export const dartBaseClassStub = `/*
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

export const dartConstructorArgument = `#{Required} this.#{FieldName}`;
export const dartConstructorArgumentWithDefaultValue = `#{Required} this.#{FieldName} = #{DefaultValue}`;

export const dartFieldStub = `#{Type}#{Operator} #{FieldName};`;

export const dartFieldStubWithDefaultValue = `#{Type}#{Operator} #{FieldName} = #{DefaultValue};`;

