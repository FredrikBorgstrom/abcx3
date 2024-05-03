part of '../abcx3_stores_library.dart';

mixin ModelRequestMixin<T> on ModelCreator<T> {
  final _cachedStreams = MemCachedStreams();

  Stream<T?> getOne$(
      {dynamic param,
      required Endpoint endpoint,
      ModelFilter? modelFilter,
      Json? body}) {
    return get$<T?>(
        param: param,
        endpoint: endpoint,
        modelFilter: modelFilter,
        body: body,
        nullReturnsEmptyList: false);
  }

  Stream<List<T>> getMany$(
      {dynamic param,
      required Endpoint endpoint,
      ModelFilter? modelFilter,
      Json? body}) {
    return get$<List<T>>(
        param: param, endpoint: endpoint, modelFilter: modelFilter, body: body);
  }

  Stream<U> get$<U>(
      {dynamic param,
      required Endpoint endpoint,
      ModelFilter? modelFilter,
      Json? body,
      bool nullReturnsEmptyList = true}) {
    if (modelFilter != null) {
      body ??= {};
      body['modelFilter'] = modelFilter.toJson();
    }

    final cachedStream =
        MemCachedStream(param: param, endpoint: endpoint, body: body);
    final existingCachedStream =
        _cachedStreams.getByRequest(cachedStream.serializedRequest);
    if (existingCachedStream != null) {
      if (existingCachedStream.hasNotExpired()) {
        return existingCachedStream.stream$ as Stream<U>;
      } else {
        _cachedStreams.remove(existingCachedStream);
      }
    }

    final broadcastStream$$ = FromCallableStream<U>(() => authHttp
            .request(endpoint, param: param, body: body)
            .then((result) => handleRequestResult(result, nullReturnsEmptyList))
            .then((result) {
          _cachedStreams.remove(cachedStream);
          return result;
        })).asBroadcastStream();
    cachedStream.stream$ = broadcastStream$$;
    _cachedStreams.add(cachedStream);
    return broadcastStream$$;
  }

  handleRequestResult<U>(
      Result<U, DioException> result, bool nullReturnsEmptyList) {
    if (result.isSuccess) {
      final json = result.success ?? (nullReturnsEmptyList ? [] : null);
      final models = create(json);
      return models;
    } else {
      throw result.failure!;
    }
  }
}
