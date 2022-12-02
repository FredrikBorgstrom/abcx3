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
      }
    `;
    
    export const dartFromJsonArg = `#{FieldName}: json['#{FieldName}'] as #{Type}#{Nullable}`;

    export const dartFromJsonListArg = `#{FieldName}: (json['#{FieldName}'] as List<#{Type}>#{Nullable})#{Nullable}\n.map((item) => #{Type}.fromJson(item as Map<String, dynamic>)).toList()`;


    export const dartConstructorArgument = `#{Required} this.#{FieldName}`;
    export const dartConstructorArgumentWithDefaultValue = `#{Required} this.#{FieldName} = #{DefaultValue}`;
    
    
    export const dartFieldStub = `#{Type}#{Nullable} #{FieldName};`;
    
    export const dartFieldStubWithDefaultValue = `#{Type}#{Nullable} #{FieldName} = #{DefaultValue};`;

