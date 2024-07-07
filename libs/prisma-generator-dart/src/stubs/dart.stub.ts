export const dartBaseClassStub = `
#{AutoGeneratedWarningText}

import '../abcx3_common.library.dart';
#{AdditionalImports}

class #{ClassName}#{ParentClass} implements #{ImplementsPrismaModel} #{ImplementsId} {
    #{Properties}
    
    /// Creates a new instance of this class.
  /// All parameters are optional and default to null.
    #{ClassName}({#{ConstructorArgs}});

    #{UIDGetter}

    Map<String, GetPropertyValueFunction<#{Model}, dynamic>> propertyValueFunctionMap = {
      #{GetPropertyValueFunctions}
    };

    /// gets a function by property name that returns the property value from the model
    @override
  dynamic Function(#{Model}) getPropToValueFunction(String propertyName) {
    final propFunction = propertyValueFunctionMap[propertyName];
    if (propFunction == null) {
      throw Exception('Property "$propertyName" not found in #{Model}');
    }
    return propFunction;
  }

    #{EqualById}

    /// Creates a new instance of this class from a JSON object.
    #{OverrideAnnotation}
    factory #{ClassName}.fromJson(Json json) =>
      #{ClassName}(
        #{fromJsonArgs}
      );

      /// Creates a new instance populated with the values of this instance and the given values,
    /// where the given values has precedence.
      #{OverrideAnnotation}  
    #{ClassName} copyWith({
        #{CopyWithArgs}
        }) {
        return #{ClassName}(
            #{CopyWithConstructorArgs}
        );
    }

    /// Creates a new instance populated with the values of this instance and the given instance,
    /// where the given instance's values has precedence.

    #{OverrideAnnotation}
    #{ClassName} copyWithInstanceValues(#{ClassName} #{InstanceName}) {
        return #{ClassName}(
            #{CopyWithInstanceConstructorArgs}
        );
    }

    /// Updates this instance with the values of the given instance,
  /// where the given instance has precedence.

    #{OverrideAnnotation}
    #{ClassName} updateWithInstanceValues(#{ClassName} #{InstanceName}) {
        #{UpdateWithInstanceSetters}
        return this;
    }
    /// Converts this instance to a JSON object.
    #{OverrideAnnotation}
    Json toJson() => ({
        #{toJsonKeyValues}
      });

      /// Determines whether this instance and another object represent the same
      /// instance.
    #{OverrideAnnotation}
    bool operator == (Object other) =>
            identical(this, other) || other is #{ClassName} &&
                runtimeType == other.runtimeType &&
                #{equalsKeyValues};

    /// Updates this instance with the values of the given instance,
    /// where this instance has precedence.
    #{OverrideAnnotation}
        int get hashCode => #{hashCodeKeyValues};
    }
    `;

export const dartUIDStub = `
#{OverrideAnnotation}
#{Type}#{Nullable} get $uid => #{PropName};`;

export const getPropertyValueFunctionStub = `"#{fieldName}": (m) => m.#{fieldName},`;

export const dartEqualByIdStub = `
#{OverrideAnnotation}
bool equalById(UID<#{Type}> other) => $uid == other.$uid;`

export const dartCopyWithArg = `#{Type}#{Nullable} #{PropName}`;
export const dartCopyWithConstructorArg = `#{PropName}: #{PropName} ?? this.#{PropName}`;

export const dartCopyWithInstanceConstructorArg = `#{PropName}: #{InstanceName}.#{PropName} ?? #{PropName}`;
export const updateWithInstanceSetters = `#{PropName} = #{InstanceName}.#{PropName} ?? #{PropName}`;

export const dartFromJsonArg = `#{PropName}: json['#{PropName}'] as #{Type}#{Nullable}`;
export const dartFromJsonBigIntArg = `#{PropName}: json['#{PropName}'] != null ? BigInt.tryParse(json['#{PropName}']) : null`;
export const dartFromJsonRefArg = `#{PropName}: json['#{PropName}'] != null ? #{Type}.fromJson(json['#{PropName}'] as Json) : null`;

export const dartFromJsonScalarIntListArg = `#{PropName}: json['#{PropName}'] != null ? (json['#{PropName}'] as List<dynamic>).map((e) => int.tryParse(e.toString())).toList() : null`;
export const dartFromJsonScalarBigIntListArg = `#{PropName}: json['#{PropName}'] != null ? (json['#{PropName}'] as List<dynamic>).map((e) => BigInt.tryParse(e.toString())).toList() : null`;
export const dartFromJsonScalarStringListArg = `#{PropName}: json['#{PropName}'] != null ? (json['#{PropName}'] as List<dynamic>).map((e) => e.toString()).toList() : null`;

export const dartFromJsonModelListArg = `#{PropName}: json['#{PropName}'] != null ? createModels<#{Type}>(json['#{PropName}'], #{Type}.fromJson) : null`;

// export const dartFromJsonEnumArg = `#{PropName}: #{Type}.values.byName(json['#{PropName}'])`;
// export const dartFromJsonEnumListArg = `#{PropName}: (json['#{PropName}']).map((item) => #{Type}.values.byName(json[item])).toList())`;
export const dartFromJsonEnumArg = `#{PropName}: json['#{PropName}'] != null ? #{Type}.fromJson(json['#{PropName}']) : null`;
export const dartFromJsonEnumListArg = `#{PropName}: json['#{PropName}'] != null ? (json['#{PropName}']).map((item) => #{Type}.fromJson(item)).toList()) : null`;

export const dartFromJsonDateTimeArg = `#{PropName}: json['#{PropName}'] != null ? DateTime.parse(json['#{PropName}']) : null`;

export const toJsonPropertyStub = `if(#{PropName} != null) '#{PropName}': #{PropName}`;
export const toJsonObjectStub = `if(#{PropName} != null) '#{PropName}': #{PropName}#{Nullable}.toJson()`;
export const toJsonObjectListStub = `if(#{PropName} != null) '#{PropName}': #{PropName}#{Nullable}.map((item) => item.toJson()).toList()`;

export const dartEqualStub = `#{PropName} == other.#{PropName}`;
export const dartListsEqualStub = `areListsEqual(#{PropName}, other.#{PropName})`;

export const dartHashCodeKeyValue = `#{PropName}.hashCode`;

export const dartConstructorArgument = `#{Required} this.#{PropName}`;
export const dartConstructorArgumentWithDefaultValue = `#{Required} this.#{PropName} = #{DefaultValue}`;

export const dartPropertyStub = `#{Type}#{Nullable} #{PropName};`;

export const dartPropertyStubWithDefaultValue = `#{Type}#{Nullable} #{PropName} = #{DefaultValue};`;

export const dartEnumStub = `
#{AutoGeneratedWarningText}
enum #{ModelName} {
    #{EnumValues};
   
    toJson() => toString().split('.').last;

    factory #{ModelName}.fromJson(String name) => values.byName(name);
  
}
`;
