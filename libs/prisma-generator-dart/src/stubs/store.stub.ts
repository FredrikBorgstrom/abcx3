
export const dartStoreStub = `
#{AutoGeneratedWarningText}

part of abcx3_stores;


class #{Model}Store<T extends #{Model}> extends ModelStreamStore<int, T> {

  static #{Model}Store? _instance;

  static #{Model}Store get instance {
    _instance ??= #{Model}Store();
    return _instance!;
  }

  #{Model}Store() : super(#{Model}.fromJson as JsonFactory<T>);

  /// GET PROPERTIES FROM MODEL

  #{GetValMethods}

  /// GET THIS MODEL

  #{GetAll$}

  #{GetByPropertyVal$}

  #{GetManyByPropertyVal$}

  /// GET RELATED MODELS WITH ID STORED IN THIS MODEL

  #{GetRelatedModelsWithId$}

  /// GET RELATED MODELS 

  #{GetRelatedModels$}


}

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



export const dartStoreGetVal = `#{FieldType}#{Nullable} get#{Model}#{FieldName}(#{Model} #{model}) => #{model}.#{fieldName};`;

export const dartStoreGetAll$ = `Stream<List<T>> getAll$({bool useCache = true}) => getAllItems$(endpoint: #{Model}Endpoints.#{EndPointAllName}, useCache: useCache);`;


export const dartStoreGetByPropertyVal$ = `Stream<T?> getBy#{FieldName}$(#{FieldType} #{fieldName}, {bool useCache = true}) =>
getByFieldValue$<#{FieldType}>(getPropVal: get#{Model}#{FieldName}, value: #{fieldName}, endpoint: #{Model}Endpoints.#{EndPointName}, useCache: useCache);`;

export const dartStoreGetManyByPropertyVal$ = `Stream<List<T>> getBy#{FieldName}$(#{FieldType} #{fieldName}, {bool useCache = true}) =>
getManyByFieldValue$<#{FieldType}>(getPropVal: get#{Model}#{FieldName}, value: #{fieldName}, endpoint: #{Model}Endpoints.#{EndPointManyName}, useCache: useCache);`;


export const dartStoreGetRelatedModelsWithId$ = `Stream<#{RelatedModelType}?> get#{FieldName}$(#{Model} #{model}, {bool useCache = true}) {
    if (#{model}.#{fieldName} != null && useCache) {
        return Stream.value(#{model}.#{fieldName}!);
      } else {
        return #{FieldType}Store.instance.getById$(#{model}.#{relationFromField}!)
            .doOnData((#{fieldName}) {
                #{model}.#{fieldName} = #{fieldName};
        });
      }
}`;

export const dartStoreGetRelatedModels$ = `Stream<#{RelatedModelType}?> get#{FieldName}$(#{Model} #{model}, {bool useCache = true}) {
    if (#{model}.#{fieldName} != null && useCache) {
        return Stream.value(#{model}.#{fieldName}!);
      } else {
        return #{RelatedModelStore}.instance.getBy#{RelationToFieldName}$(#{model}.$uid!)
            .doOnData((#{fieldName}) {
                #{model}.#{fieldName} = #{fieldName};
        });
      }
}`;
// export const dartStoreEndpointName = `by#{FieldName}_$#{fieldName}_get_one`;

// export const dartStoreEndpointManyName = `by#{FieldName}_$#{fieldName}_get_many`;

export const dartStoreEndpointName = `getBy#{FieldName}`;

export const dartStoreEndpointManyName = `getManyBy#{FieldName}`;

export const dartStoreEndpointAllName = `getAll`;

export const dartStoreEndpoint = `#{EndPointName}('/#{model}/by#{FieldName}/:#{fieldName}', HttpMethod.get, #{Model})`;

export const dartStoreEndpointMany = `#{EndPointManyName}('/#{model}/by#{FieldName}/:#{fieldName}', HttpMethod.get, List<#{Model}>)`;

export const dartStoreEndpointAll = `#{EndPointAllName}('/#{model}', HttpMethod.get, List<#{Model}>)`;



