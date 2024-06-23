
export const dartStoreStub = `
#{AutoGeneratedWarningText}

part of '../abcx3_stores_library.dart';

class #{Model}Store extends ModelStreamStore<#{ModelsIdDartType}, #{Model}> {

  static #{Model}Store? _instance;

  static #{Model}Store get instance {
    _instance ??= #{Model}Store();
    return _instance!;
  }

  #{Model}Store() : super(#{Model}.fromJson) {
    if (_instance != null) {
        throw Exception(
            '#{Model}Store is a singleton class and an instance of it already exists. '
                'This can happen if you are extending #{Model}Store, so it is recommended to NOT extend the store classes. '
                'Instead you should use #{Model}Store.instance to access the store instance. ');
      }
      _instance = this;
  }

  /// GET PROPERTIES FROM MODEL

  #{GetValMethods}

  /// GET THIS MODEL(S) BY PROPERTY VALUE

  #{GetByPropertyVal}

  #{GetManyByPropertyVal}

  // GET THIS MODEL BY RELATED MODEL ID IN MANY TO MANY RELATION

  

  /// GET RELATED MODELS WITH ID STORED IN THIS MODEL

  #{GetRelatedModelsWithId}

  /// GET RELATED MODELS 

  #{GetRelatedModels}

  //////// STREAM METHODS //////////

  /// GET THIS MODEL as STREAM

  #{GetAll$}

  #{GetByPropertyVal$}

  #{GetManyByPropertyVal$}

  /// GET RELATED MODELS WITH ID STORED IN THIS MODEL as STREAM

  #{GetRelatedModelsWithId$}

  /// GET RELATED MODELS as STREAM

  #{GetRelatedModels$}

  // ADD REF MODELS TO REF STORES

  #{UpdateRefStores}

  #{UpdateRefStoresForList}

}

#{ClassInclude}


enum #{Model}Endpoints implements Endpoint {

    #{Endpoints};

    const #{Model}Endpoints(this.path, this.method, this.responseType);

    @override
  final String path;

  @override
  final HttpMethod method;

  final Type responseType;

  static String withPathParameter(String path, dynamic param) {
    final regex = RegExp(r':([a-zA-Z]+)');
    return path.replaceFirst(regex, param.toString());
  }
}
`;

export const dartStoreClassIncludeStub = `
class #{Model}Include<T extends PrismaModel> implements StoreIncludes<T> {

    @override
    bool useCache;

    @override
    bool useAsync;

    @override
  ModelFilter<T>? modelFilter;
  
    @override
    late Function method;
  
      #{IncludeConstructors}
  }`;

export const dartStoreIncludesConstructor = `#{Model}Include.#{fieldName}({
    this.useCache = true,
    this.useAsync = true,
    ModelFilter<#{FieldType}>? modelFilter,
    #{IncludeType} includes}) {
    if (useAsync) {
        this.modelFilter = modelFilter as ModelFilter<T>?;
        method = (#{moDel}) => #{Model}Store.instance
            .get#{FieldName}$(#{moDel}, useCache: useCache, modelFilter: modelFilter, includes: includes);
      } else {
        method = (#{moDel}) => #{Model}Store.instance
            .get#{FieldName}(#{moDel}, modelFilter: modelFilter, includes: includes);
      }
}`;

export const dartStoreIncludesEmptyConstructor = `#{Model}Include.empty({this.useCache = true, this.useAsync = true});`;

export const dartStoreGetVal = `#{DartType}#{Nullable} get#{Model}#{FieldName}(#{Model} #{moDel}) => #{moDel}.#{fieldName};`;


export const dartStoreGetAll$ = `Stream<List<#{Model}>> getAll$({bool useCache = true, ModelFilter<#{Model}>? modelFilter, List<#{Model}Include>? includes}) {
    final allItems$ = getAllItems$(endpoint: #{Model}Endpoints.#{EndPointAllName}, modelFilter: modelFilter, useCache: useCache);
    if (includes == null || includes.isEmpty) {
        return allItems$;
      } else {
        return getManyIncluding$(allItems$, includes);
      }
    }
`;


export const dartStoreGetByPropertyVal = `
#{Model}? getBy#{FieldName}(
    #{FieldType} #{fieldName},
    {ModelFilter<#{Model}>? modelFilter, List<#{Model}Include>? includes}
    ) =>
    getIncluding(get#{Model}#{FieldName}, #{fieldName}, modelFilter: modelFilter, includes: includes);`;


export const dartStoreGetManyByPropertyVal = `
List<#{Model}> getBy#{FieldName}(
    #{FieldType} #{fieldName},
    {ModelFilter<#{Model}>? modelFilter, List<#{Model}Include>? includes}
    ) =>
    getManyIncluding(get#{Model}#{FieldName}, #{fieldName}, modelFilter: modelFilter, includes: includes);`;



/* export const staticGetPropValFunctionStub = `Map<String, GetPropertyValueFunction<#{Model}, dynamic>> get propertyValueFunctionMap => {
    #{GetPropertyValueFunctions}
  };`; */


// export const getPropertyValueFunctionStub = `"#{fieldName}": get#{Model}#{FieldName},`;


/// GET RELATED MODELS WITH ID STORED IN THIS MODEL:

export const dartStoreGetRelatedModelsWithId = `#{StreamReturnType} get#{FieldName}(
    #{Model} #{moDel}, {ModelFilter? modelFilter, #{IncludeType} includes}) {
    if (#{moDel}.#{relationFromField} == null) {
        return null;
    } else {
        final #{fieldName} = #{FieldType}Store.instance.getById(#{moDel}.#{relationFromField}!, includes: includes);
        #{moDel}.#{fieldName} = #{fieldName};
        // setIncludedReferences(#{fieldName}, includes: includes);
        return #{fieldName};
    }
}`;

// GET RELATED MODELS FOR MANY TO MANY RELATION:



/// GET RELATED MODELS:

export const dartStoreGetRelatedModels = `#{StreamReturnType} get#{FieldName}(
    #{Model} #{moDel}, {ModelFilter<#{FieldType}>? modelFilter, #{IncludeType} includes}) {
    final #{fieldName} = #{RelatedModelStore}.instance.getBy#{RelationToFieldName}(#{moDel}.$uid!, modelFilter: modelFilter, includes: includes);
    #{moDel}.#{fieldName} = #{fieldName};
    // #{setRefModelFunction}(#{fieldName}, includes: includes);
    return #{fieldName};
}`;

export const dartStoreUpdateRefStores = `#{Model} updateRefStores(#{Model} #{moDel}, {int recursiveDepth = #{UpdateStoresRecursiveDepth_SETTING}}) {
    if (recursiveDepth > 0) {
        recursiveDepth--;
        #{UpdateRefStoreForFields}
    }
    return upsert(#{moDel});
}`;

export const dartStoreUpdateRefStoresForList = `List<#{Model}> updateRefStoresForList(List<#{Model}> #{moDel}s, {int recursiveDepth = #{UpdateStoresRecursiveDepth_SETTING}}) {
    final updated#{Model}s = <#{Model}>[];
    for (var #{moDel} in #{moDel}s) {
        updated#{Model}s.add(updateRefStores(#{moDel}, recursiveDepth: recursiveDepth));
    }
    return updated#{Model}s;
}`;

export const dartStoreUpdateRefStoreForField = `if (#{moDel}.#{fieldName} != null) {
        #{FieldType}Store.instance.updateRefStores(#{moDel}.#{fieldName}!, recursiveDepth: recursiveDepth);
    }`;

export const dartStoreUpdateRefStoreForListField = `if (#{moDel}.#{fieldName} != null) {
        #{FieldType}Store.instance.updateRefStoresForList(#{moDel}.#{fieldName}!, recursiveDepth: recursiveDepth);
    }`;

export const dartStoreGetByPropertyVal$ = `
    Stream<#{Model}?> getBy#{FieldName}$(
        #{FieldType} #{fieldName},
        {bool useCache = true,
        ModelFilter<#{Model}>? modelFilter,
        List<#{Model}Include>? includes}) {
    final item$ = getByFieldValue$<#{FieldType}>(
        getPropVal: get#{Model}#{FieldName},
        value: #{fieldName},
        modelFilter: modelFilter,
        endpoint: #{Model}Endpoints.#{EndPointName},
        useCache: useCache);
    if (includes == null || includes.isEmpty) {
        return item$;
    } else {
        return getIncluding$<#{Model}?>(item$, includes);
    }
}
`;

export const dartStoreGetManyByPropertyVal$ = `
    Stream<List<#{Model}>> getBy#{FieldName}$(
        #{FieldType} #{fieldName},
        {bool useCache = true,
        ModelFilter<#{Model}>? modelFilter,
        List<#{Model}Include>? includes}) {
    final items$ = getManyByFieldValue$<#{FieldType}>(
        getPropVal: get#{Model}#{FieldName},
        value: #{fieldName},
        modelFilter: modelFilter,
        endpoint: #{Model}Endpoints.#{EndPointManyName},
        useCache: useCache);
    if (includes == null || includes.isEmpty) {
        return items$;
    } else {
        return getManyIncluding$<#{Model}>(items$, includes);
    }
}
`;



export const dartStoreGetRelatedModelsWithId$ = `Stream<#{StreamReturnType}> get#{FieldName}$(
    #{Model} #{moDel}, {bool useCache = true, ModelFilter<#{FieldType}>? modelFilter, #{IncludeType} includes}) {
    if (#{moDel}.#{relationFromField} == null) {
        return Stream.value(null);
    } else {
        return #{FieldType}Store.instance.getById$(
            #{moDel}.#{relationFromField}!,
            useCache: useCache,
            modelFilter: modelFilter,
            includes: includes)
        .doOnData((#{fieldName}) {
            #{moDel}.#{fieldName} = #{fieldName};
        });
    }
}`;

export const dartStoreGetRelatedModels$ = `Stream<#{StreamReturnType}> get#{FieldName}$(
    #{Model} #{moDel}, {bool useCache = true, ModelFilter<#{FieldType}>? modelFilter, #{IncludeType} includes}) {
    return #{RelatedModelStore}.instance.getBy#{RelationToFieldName}$(
        #{moDel}.$uid!,
        useCache: useCache,
        modelFilter: modelFilter,
        includes: includes)
    .doOnData((#{fieldName}) {
        #{moDel}.#{fieldName} = #{fieldName};
    });

}`;


export const dartStoreEndpointName = `getBy#{FieldName}`;

export const dartStoreEndpointManyName = `getManyBy#{FieldName}`;

export const dartStoreEndpointAllName = `getAll`;

export const dartStoreEndpoint = `#{EndPointName}('/#{moDel}/by#{FieldName}/:#{fieldName}', HttpMethod.post, #{Model})`;

export const dartStoreEndpointMany = `#{EndPointManyName}('/#{moDel}/by#{FieldName}/:#{fieldName}', HttpMethod.post, List<#{Model}>)`;

export const dartStoreEndpointAll = `#{EndPointAllName}('/#{moDel}', HttpMethod.post, List<#{Model}>)`;


/// Property name to getter function map
/* Map<String, GetPropertyValueFunction<#{Model}, dynamic>> get propertyValueFunctionMap => {
  #{GetPropertyValueFunctions}
}; */


/// gets a function by property name that returns the property value from the model
/* Function getPropToValueFunction(String propertyName) {
  final propFunction = propertyValueFunctionMap[propertyName];
  if (propFunction == null) {
    throw Exception('Property "$propertyName" not found in #{Model}');
  }
  return propFunction;
} */
