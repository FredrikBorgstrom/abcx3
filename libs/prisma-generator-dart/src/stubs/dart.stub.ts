export const dartBaseClassStub = `/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

#{Imports}

class #{ClassName} #{ParentClass} {
    #{Properties}
      #{ClassName}({#{ConstructorArgs}});

      factory #{ClassName}.fromJson(Map<String, dynamic> json) =>
      #{ClassName}(
        #{fromJsonArgs}
      );

      Map<String, dynamic> toJson() => ({
        #{toJsonKeyValues}
      });
      }
    `;

export const dartFromJsonArg = `#{PropName}: json['#{PropName}'] as #{Type}#{Nullable}`;

export const dartFromJsonListArg = `#{PropName}: (json['#{PropName}'] as List<#{Type}>#{Nullable})#{Nullable}\n.map((item) => #{Type}.fromJson(item as Map<String, dynamic>)).toList()`;
export const toJsonPropertyStub = `'#{PropName}': #{PropName}`;
export const toJsonListPropertyStub = `'#{PropName}': #{PropName}#{Nullable}.map((item) => item.toJson()).toList()`;
//export const toJsonObjectPropertyStub = `'#{PropName}': #{PropName}`;


export const dartConstructorArgument = `#{Required} this.#{PropName}`;
export const dartConstructorArgumentWithDefaultValue = `#{Required} this.#{PropName} = #{DefaultValue}`;


export const dartPropertyStub = `#{Type}#{Nullable} #{PropName};`;

export const dartPropertyStubWithDefaultValue = `#{Type}#{Nullable} #{PropName} = #{DefaultValue};`;

