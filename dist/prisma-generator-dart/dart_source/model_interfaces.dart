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

abstract interface class UniqueIdAndCopyWith<U, T> implements UniqueId<U>, CopyWith<T> {}
