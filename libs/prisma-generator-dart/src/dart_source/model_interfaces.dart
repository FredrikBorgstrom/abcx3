part of abcx3_prisma;

typedef JsonFactory<T> = T Function(Map<String, dynamic> json);

abstract interface class JsonSerializable {
  factory JsonSerializable.fromJson(Map<String, dynamic> json) {
    throw UnimplementedError();
  }
  Map<String, dynamic> toJson();
}

abstract interface class CopyWith<T> {
  T copyWith();
  T copyWithInstance(T model);
}

abstract interface class UID<K> {
  K? get $uid;
}

abstract interface class CopyWithAndUID<T, U> implements UID<U>, CopyWith<T> {}

abstract interface class PrismaModel<T, U>
    implements JsonSerializable, CopyWithAndUID<T, U> {}

// NOT USED:

abstract interface class FromJson {
  factory FromJson.fromJson(Map<String, dynamic> json) {
    throw UnimplementedError();
  }
}

abstract interface class FromJsonFactory<T> {
  JsonFactory<T> get fromJsonFactory;
}

abstract interface class ToJson {
  Map<String, dynamic> toJson();
}

abstract interface class Id<K> {
  K? id;
}

// abstract interface class PrismaIdModel<M, K> implements PrismaModel<M>, Id<K> {}
