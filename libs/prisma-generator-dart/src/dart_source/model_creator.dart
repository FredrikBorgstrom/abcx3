library model_creators;

import 'dart:convert';
import 'model_base.dart';
import 'package:abcx3/services/authentication/auth.library.dart';
import 'package:abcx3/services/service_manager.dart';
import 'package:rxdart/rxdart.dart';

part 'model_request.mixin.dart';

class ModelCreator<T> implements Disposable {
  final JsonModelFactory<T> jsonModelFactory;
  final AuthHttpService authHttp;

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
