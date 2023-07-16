export const dartStoreLibrary = `
library abcx3_stores_library;

import 'package:abcx3/gen_models/common/abcx3_prisma.library.dart';
import 'package:abcx3/gen_models/models_library.dart';
import 'package:rxdart/rxdart.dart';

#{StoreParts}

part 'stores/game_store_copy.dart';
`;

