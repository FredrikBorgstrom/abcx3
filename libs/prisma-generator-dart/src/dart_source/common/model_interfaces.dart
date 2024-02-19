part of '../abcx3_common.library.dart';

typedef Json = Map<String, dynamic>;

typedef JsonFactory<T> = T Function(Json json);

typedef GetPropertyValueFunction<I, O> = O? Function(I model);

abstract interface class JsonSerializable {
  factory JsonSerializable.fromJson(Json json) {
    throw UnimplementedError();
  }
  Json toJson();
}

abstract interface class CopyWith<T> {
  T copyWith();
  T copyWithInstanceValues(T model);
  T updateWithInstanceValues(T model);
}

abstract interface class GetPropToValueFunction<T> {
  dynamic Function(T model) getPropToValueFunction(String propName);
}

abstract interface class UID<K> {
  K? get $uid;
  bool equalById(UID<K> other);
}

abstract interface class CopyWithAndUID<T, U> implements CopyWith<T>, UID<U> {}

abstract interface class PrismaModel<K, T>
    implements
        JsonSerializable,
        CopyWith<T>,
        UID<K>,
        GetPropToValueFunction<T> {}

/*abstract interface class PrismaModel<T extends Object, U>
    implements JsonSerializable, CopyWithAndUID<T, U> {}*/

// NOT USED:

abstract interface class FromJson {
  factory FromJson.fromJson(Json json) {
    throw UnimplementedError();
  }
}

abstract interface class FromJsonFactory<T> {
  JsonFactory<T> get fromJsonFactory;
}

abstract interface class ToJson {
  Json toJson();
}

abstract interface class Id<K> {
  K? id;
}

// abstract interface class PrismaIdModel<M, K> implements PrismaModel<M>, Id<K> {}
