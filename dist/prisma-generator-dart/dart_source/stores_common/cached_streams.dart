part of '../abcx3_stores_library.dart';

class CachedStreams {
  final List<CachedStream> _cachedStreams = [];

  void add(CachedStream cachedStream) {
    _cachedStreams.add(cachedStream);
  }

  CachedStream? getByRequest(String serializedRequest) {
    return _cachedStreams.find((cachedStream) => cachedStream.serializedRequest == serializedRequest);
  }

  void remove(CachedStream cachedStream) {
    _cachedStreams.remove(cachedStream);
  }

  void removeExpired() {
    _cachedStreams.removeWhere((cachedStream) => cachedStream.isExpired());
  }
}

class CachedStream<U> {
  static const MAX_AGE_OF_CACHED_REQUEST_IN_SECONDS = 30;

  Stream<U>? stream$;
  final DateTime dateTime;
  late final String serializedRequest;

  CachedStream({required Endpoint endpoint, dynamic param, Json? body, this.stream$}) : dateTime = DateTime.now() {
    serializedRequest = _serializeRequest(param: param, endpoint: endpoint, body: body);
  }

  bool hasNotExpired() {
    return !isExpired();
  }

  bool isExpired() {
    final now = DateTime.now();
    final age = now.difference(dateTime).inSeconds;
    return age > MAX_AGE_OF_CACHED_REQUEST_IN_SECONDS;
  }

  bool requestsAreEqual(CachedStream other) {
    return other.serializedRequest == serializedRequest;
  }

  String _serializeRequest({dynamic param, required Endpoint endpoint, Json? body}) {
    final dateTime = DateTime.now().toIso8601String();
    final serializedParam = param != null ? param.toString() : '';
    final serializedBody = body != null ? body.toString() : '';
    return '$dateTime ${endpoint.path} $serializedParam $serializedBody';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is CachedStream &&
        other.serializedRequest == serializedRequest &&
        other.dateTime == dateTime;
  }

  @override
  int get hashCode => serializedRequest.hashCode ^ dateTime.hashCode;

}