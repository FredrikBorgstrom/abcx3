export const dartBaseClassStub = `/*
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

export const dartConstructorArgument = `#{Required} this.#{FieldName}`;
export const dartConstructorArgumentWithDefaultValue = `#{Required} this.#{FieldName} = #{DefaultValue}`;

export const dartFromJsonArg = `#{FieldName}: json['#{FieldName}'] as #{Type}#{Nullable}`

export const dartFieldStub = `#{Type}#{Operator} #{FieldName};`;

export const dartFieldStubWithDefaultValue = `#{Type}#{Operator} #{FieldName} = #{DefaultValue};`;

