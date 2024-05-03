part of '../abcx3_stores_library.dart';

class ModelCreator<T> {
  final JsonFactory<T> jsonModelFactory;
  final HttpService authHttp;

  ModelCreator(this.jsonModelFactory)
      : authHttp = ServiceManager.I.get<AuthHttpService>()!;

  create(json) {
    if (json == null) {
      return null;
    } else if (json is List) {
      return createMany(json);
    } else {
      return createOne(json);
    }
  }

  List<T> createMany(json) {
    List<T> instances = [];
    for (final item in json) {
      instances.add(createOne(item as Json));
    }
    return instances;
  }

  T createOne(json) {
    return jsonModelFactory(json as Json);
  }

  // @override
  // void dispose() {}
}
