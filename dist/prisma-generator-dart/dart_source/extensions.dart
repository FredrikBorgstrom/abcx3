part of abcx3_prisma;

extension IterableX<T> on Iterable<T> {
  T? find(bool Function(T) test) {
    T? foundItem;
    for (var item in this) {
      if (test(item)) {
        foundItem = item;
        break;
      }
    }
    return foundItem;
  }

  Iterable<T> removeList(List<T> itemsToRemove) {
    return where((e) => !itemsToRemove.contains(e));
  }
}

extension StringCasingExtension on String {
  String toCapitalized() =>
      length > 0 ? '${this[0].toUpperCase()}${substring(1).toLowerCase()}' : '';
  String toTitleCase() => replaceAll(RegExp(' +'), ' ')
      .split(' ')
      .map((str) => str.toCapitalized())
      .join(' ');
}

extension EmailValidator on String {
  bool isValidEmail() {
    return RegExp(
            r'^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$')
        .hasMatch(this);
  }
}
