part of abcx3_prisma;

class ModelCreator<T> implements Disposable {
  final JsonFactory<T> jsonModelFactory;
  final HttpService authHttp;

  ModelCreator(this.jsonModelFactory) : authHttp = ServiceManager.I.get<AuthHttpService>()!;

  create(json) {
    if (json is List) {
      return createMany(json);
    } else {
      return createOne(json);
    }
  }

  List<T> createMany(json) {
    List<T> instances = [];
    for (final item in json) {
      instances.add(createOne(item as Map<String, dynamic>));
    }
    return instances;
  }

  T createOne(json) {
    return jsonModelFactory(json as Map<String, dynamic>);
  }

  @override
  void dispose() {}
}
