part of '../abcx3_stores_library.dart';

class ModelCreator<T> {
  final JsonFactory<T> jsonModelFactory;
  final HttpService authHttp;

  ModelCreator(this.jsonModelFactory)
    : authHttp = ServiceManager.I.get<AuthHttpService>()!;

  dynamic create(Object? data) {
    if (data == null || data == '') {
      return null;
    } else if (data is List) {
      return createMany(data.cast<JsonMap>());
    } else {
      return createOne(data as JsonMap);
    }
  }

  List<T> createMany(List<JsonMap> jsonList) {
    List<T> instances = [];
    for (final item in jsonList) {
      instances.add(createOne(item));
    }
    return instances;
  }

  T createOne(JsonMap json) {
    return jsonModelFactory(json);
  }
}
