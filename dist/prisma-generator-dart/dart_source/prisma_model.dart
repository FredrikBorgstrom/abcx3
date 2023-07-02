abstract interface class PrismaModel<T> {
  factory PrismaModel.fromJson(Map<String, dynamic> json) {
    throw UnimplementedError();
  }
  Map<String, dynamic> toJson();
  T copyWith();
  T copyWithInstance(T model);
}

abstract interface class Id<K> {
  K? id;
}

abstract interface class PrismaModelWithId<M, K> implements PrismaModel<M>, Id<K> {}
