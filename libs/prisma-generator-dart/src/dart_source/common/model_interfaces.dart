part of '../abcx3_common.library.dart';

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
  bool equalById(UID<K> other);
}

abstract interface class CopyWithAndUID<T, U> implements CopyWith<T>, UID<U> {}

abstract interface class PrismaModel<K, T> implements JsonSerializable, CopyWith<T>, UID<K> {}

/*abstract interface class PrismaModel<T extends Object, U>
    implements JsonSerializable, CopyWithAndUID<T, U> {}*/

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
