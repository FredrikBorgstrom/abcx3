export const dartBaseClassStub = `
#{AutoGeneratedWarningText}

import 'common/abcx3_prisma.library.dart';
#{AdditionalImports}

class #{ClassName} #{ParentClass} implements FromJson, ToJson, CopyWith<#{ClassName}> #{ImplementsUID}{
    #{Properties}
    
    #{ClassName}({#{ConstructorArgs}});

    #{UIDGetter}

    #{OverrideAnnotation}
    factory #{ClassName}.fromJson(Map<String, dynamic> json) =>
      #{ClassName}(
        #{fromJsonArgs}
      );

      #{OverrideAnnotation}  
    #{ClassName} copyWith({
        #{CopyWithArgs}
        }) {
        return #{ClassName}(
            #{CopyWithConstructorArgs}
        );
    }

    #{OverrideAnnotation}
    #{ClassName} copyWithInstance(#{ClassName} #{InstanceName}) {
        return #{ClassName}(
            #{CopyWithInstanceConstructorArgs}
        );
    }

    #{OverrideAnnotation}
    Map<String, dynamic> toJson() => ({
        #{toJsonKeyValues}
      });

    #{OverrideAnnotation}
    bool operator == (Object other) =>
            identical(this, other) || other is #{ClassName} &&
                runtimeType == other.runtimeType &&
                #{equalsKeyValues};

    #{OverrideAnnotation}
        int get hashCode => #{hashCodeKeyValues};
    }
    `;

export const dartUIDStub = `
#{OverrideAnnotation}
#{UIDType}#{Nullable} get $uid => #{UID};`;

export const dartCopyWithArg = `#{Type}#{Nullable} #{PropName}`;
export const dartCopyWithConstructorArg = `#{PropName}: #{PropName} ?? this.#{PropName}`;

export const dartCopyWithInstanceConstructorArg = `#{PropName}: #{InstanceName}.#{PropName} ?? #{PropName}`;

export const dartFromJsonArg = `#{PropName}: json['#{PropName}'] as #{Type}#{Nullable}`;
export const dartFromJsonRefArg = `#{PropName}: json['#{PropName}'] != null ? #{Type}.fromJson(json['#{PropName}'] as Map<String, dynamic>) : null`;

export const dartFromJsonScalarIntListArg = `#{PropName}: json['#{PropName}'] != null ? (json['#{PropName}'] as List<dynamic>).map((e) => int.parse(e.toString())).toList() : null`;
export const dartFromJsonScalarStringListArg = `#{PropName}: json['#{PropName}'] != null ? (json['#{PropName}'] as List<dynamic>).map((e) => e.toString()).toList() : null`;

export const dartFromJsonModelListArg = `#{PropName}: json['#{PropName}'] != null ? createModels<#{Type}>(json['#{PropName}'], #{Type}.fromJson) : null`;

export const dartFromJsonEnumArg = `#{PropName}: #{Type}.values.byName(json['#{PropName}'])`;
export const dartFromJsonEnumListArg = `#{PropName}: (json['#{PropName}']).map((item) => #{Type}.values.byName(json[item])).toList())`;
export const dartFromJsonDateTimeArg = `#{PropName}: json['#{PropName}'] != null ? DateTime.parse(json['#{PropName}']) : null`;

export const toJsonPropertyStub = `if(#{PropName} != null) '#{PropName}': #{PropName}`;
export const toJsonListPropertyStub = `if(#{PropName} != null) '#{PropName}': #{PropName}#{Nullable}.map((item) => item.toJson()).toList()`;

export const dartEqualStub = `#{PropName} == other.#{PropName}`;
export const dartListsEqualStub = `areListsEqual(#{PropName}, other.#{PropName})`;

export const dartHashCodeKeyValue = `#{PropName}.hashCode`;


export const dartConstructorArgument = `#{Required} this.#{PropName}`;
export const dartConstructorArgumentWithDefaultValue = `#{Required} this.#{PropName} = #{DefaultValue}`;


export const dartPropertyStub = `#{Type}#{Nullable} #{PropName};`;

export const dartPropertyStubWithDefaultValue = `#{Type}#{Nullable} #{PropName} = #{DefaultValue};`;

export const dartInterfacesAndModelFunctionsStub = `
  abstract interface class Id<K>} {
    abstract K? id;
  }
  
  abstract interface class IdString {
    abstract String? id;
  }
  
  abstract interface class ToJson {
    Map<String, dynamic> toJson();
  }
  
  typedef JsonModelFactory<T> = T Function(Map<String, dynamic> json);

  List<T> createModels<T>(json, JsonModelFactory<T> jsonFactory) {
    List<T> instances = [];
    for (final item in json) {
      instances.add(jsonFactory(item as Map<String, dynamic>));
    }
    return instances;
  }

  bool areListsEqual<T>(List<T>? list1, List<T>? list2) {
    if (list1 == null && list2 == null) return true;
    if (list1 == null || list2 == null) return false;
    if (list1.length != list2.length) return false;
    for (var i = 0; i < list1.length; i++) {
      if (list1[i] != list2[i]) return false;
    }
    return true;
  }
  `;