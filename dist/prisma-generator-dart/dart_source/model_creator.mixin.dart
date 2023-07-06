part of abcx3_prisma;

mixin ModelCreatorMixin<T> {
  late JsonModelFactory<T>? jsonModelFactory;

  initModelCreatorMixin(JsonModelFactory<T> jsonModelFactory) {
    this.jsonModelFactory = jsonModelFactory;
  }

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
    if (jsonModelFactory != null) {
      return jsonModelFactory!(json as Map<String, dynamic>);
    } else {
      throw Exception(
          "jsonModelFactory is null in ModelCreatorMixin. Set it using initModelCreatorMixin.");
    }
  }
}
