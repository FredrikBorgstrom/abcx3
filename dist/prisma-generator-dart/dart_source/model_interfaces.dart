part of abcx3_prisma;

abstract interface class FromJson {
  FromJson.fromJson(Map<String, dynamic> json) {
    throw UnimplementedError();
  }
}

abstract interface class ToJson {
  Map<String, dynamic> toJson();
}

abstract interface class CopyWith<T> {
  T copyWith();
  T copyWithInstance(T model);
}

abstract interface class UniqueId<K> {
  K? get uniqueId;
}

abstract interface class UniqueIdAndCopyWith<U, M>
    implements UniqueId<U>, CopyWith<M> {}

abstract interface class PrismaModel<M, U>
    implements FromJson, ToJson, UniqueIdAndCopyWith<U, M> {}

typedef JsonModelFactory<T> = T Function(Map<String, dynamic> json);
