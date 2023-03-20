export const dartBaseClassStub = `
#{AutoGeneratedWarningText}

#{Imports}

class #{ClassName} #{ParentClass}#{ImplementedClass}{
    #{Properties}
    
      #{ClassName}({#{ConstructorArgs}});

      factory #{ClassName}.fromJson(Map<String, dynamic> json) =>
      #{ClassName}(
        #{fromJsonArgs}
      );

      #{OverrideAnnotation}
      Map<String, dynamic> toJson() => ({
        #{toJsonKeyValues}
      });
      }
    `;

export const dartFromJsonArg = `#{PropName}: json['#{PropName}'] as #{Type}#{Nullable}`;
export const dartFromJsonListArg = `#{PropName}: (json['#{PropName}'] as List<#{Type}>#{Nullable})#{Nullable}.map((item) => #{Type}.fromJson(item as Map<String, dynamic>)).toList()`;
export const dartFromJsonEnumArg = `#{PropName}: #{Type}.values.byName(json['#{PropName}'])`;
export const dartFromJsonEnumListArg = `#{PropName}: (json['#{PropName}']).map((item) => #{Type}.values.byName(json[item])).toList())`;

export const toJsonPropertyStub = `'#{PropName}': #{PropName}`;
export const toJsonListPropertyStub = `'#{PropName}': #{PropName}#{Nullable}.map((item) => item.toJson()).toList()`;
//export const toJsonObjectPropertyStub = `'#{PropName}': #{PropName}`;


export const dartConstructorArgument = `#{Required} this.#{PropName}`;
export const dartConstructorArgumentWithDefaultValue = `#{Required} this.#{PropName} = #{DefaultValue}`;


export const dartPropertyStub = `#{Type}#{Nullable} #{PropName};`;

export const dartPropertyStubWithDefaultValue = `#{Type}#{Nullable} #{PropName} = #{DefaultValue};`;

export const dartModelBaseClassStub = `abstract class ModelBase {
    abstract int? id;
    Map<String, dynamic> toJson();
  }`;