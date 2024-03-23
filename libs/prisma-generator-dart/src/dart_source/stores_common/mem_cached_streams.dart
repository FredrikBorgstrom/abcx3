part of '../abcx3_stores_library.dart';

class MemCachedStreams {
  final List<MemCachedStream> _memCachedStreams = [];

  void add(MemCachedStream cachedStream) {
    _memCachedStreams.add(cachedStream);
  }

  MemCachedStream? getByRequest(String serializedRequest) {
    return _memCachedStreams.find(
        (cachedStream) => cachedStream.serializedRequest == serializedRequest);
  }

  void remove(MemCachedStream cachedStream) {
    _memCachedStreams.remove(cachedStream);
  }

  void removeExpired() {
    _memCachedStreams.removeWhere((cachedStream) => cachedStream.isExpired());
  }
}

class MemCachedStream<U> {
  static const MAX_AGE_OF_CACHED_REQUEST_IN_SECONDS = 30;

  Stream<U>? stream$;
  final DateTime dateTime;
  late final String serializedRequest;

  MemCachedStream(
      {required Endpoint endpoint, dynamic param, Json? body, this.stream$})
      : dateTime = DateTime.now() {
    serializedRequest =
        _serializeRequest(param: param, endpoint: endpoint, body: body);
    print('serializedRequest: $serializedRequest');
    print('dateTime: $dateTime');
  }

  bool hasNotExpired() {
    return !isExpired();
  }

  bool isExpired() {
    final now = DateTime.now();
    final age = now.difference(dateTime).inSeconds;
    print('age: $age');
    print('is expired: ${age > MAX_AGE_OF_CACHED_REQUEST_IN_SECONDS}');
    return age > MAX_AGE_OF_CACHED_REQUEST_IN_SECONDS;
  }

  bool requestsAreEqual(MemCachedStream other) {
    return other.serializedRequest == serializedRequest;
  }

  String _serializeRequest(
      {dynamic param, required Endpoint endpoint, Json? body}) {
    // final dateTime = DateTime.now().toIso8601String();
    final serializedParam = param != null ? param.toString() : '';
    final serializedBody = body != null ? body.toString() : '';
    return '${endpoint.path}$serializedParam$serializedBody';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is MemCachedStream &&
        other.serializedRequest == serializedRequest &&
        other.dateTime == dateTime;
  }

  @override
  int get hashCode => serializedRequest.hashCode ^ dateTime.hashCode;
}
