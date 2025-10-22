
@abcx3/prisma-generator-dart

Generate Dart model classes and fully-typed reactive Stores for every Prisma model. In addition to `fromJson`/`toJson` for models, this generator emits rich Store types with streaming, caching, include helpers for relations, endpoint metadata and Prisma-style filters.

## Features

- Models
  - `fromJson` constructors (incl. nested objects)
  - `toJson` (omits null-valued properties since 1.2.0)
  - `==` and `hashCode` by property values
  - `copyWith` and `copyWithInstance` (since 1.4.0)
  - `_count` support for list-type fields (e.g. `posts` → `$postsCount`)
- Stores
  - Per-model `<Model>Store` built on `ModelStreamStore` for reactive updates
  - `getAll$`, `getBy<Field>$`, `getManyBy<Field>$` stream helpers
  - `ModelFilter`, `LogicalFilterGroup`, `PropertyFilter`, `FilterOperator` for Prisma-like server-side filtering
  - Include helpers to lazily load relations (`<Model>Include`)
  - Deduplication and in-memory caching
  - Recursive upserts for relation graphs
- Endpoints
  - Each store embeds a `<Model>Endpoints` enum with route + method per supported call
  - Optional global endpoint generation by scanning a NestJS backend (see GenerateEndpoints)

## Installation

- Add the generator to the workspace that contains your Prisma schema (often the backend repo):

  bash
  npm i -D @abcx3/prisma-generator-dart


## Usage

Open your `schema.prisma` and add a generator block that targets your Flutter/Dart app output folder:

```prisma
// schema.prisma
generator dart {
  provider                = "node ./node_modules/@abcx3/prisma-generator-dart/index.js"
  output                  = "/absolute/path/to/your/flutter/app/lib/gen_models"
  // Optional settings
  FormatWithDart          = true
  MakeAllPropsOptional    = true
  UpdateStoresDefaultRecursiveDepth = 4
  // GenerateEndpoints     = true                 // also generate a single routes file by scanning backend
  // BackendPath           = "../abcx3-backend" // backend root to scan for NestJS controllers
  // EndpointsOutputPath   = "gen_backend_routes.dart"
  // outputSetupForDevtools = true               // also emit setup_stores_devtool.dart
}
```


### Configuration reference

| Name                          | Type     | Default              | Description |
| ----------------------------- | -------- | -------------------- | ----------- |
| `provider`                    | string   | —                    | Must be `node ./node_modules/@abcx3/prisma-generator-dart/index.js` |
| `output`                      | string   | —                    | Absolute path inside your Flutter app (e.g. `lib/gen_models`). The folder is created if missing. |
| `dryRun`                      | boolean  | `false`              | Write nothing, print to console instead. |
| `FormatWithDart`              | boolean  | `true`               | Runs `dart format` on the generated output. |
| `MakeAllPropsOptional`        | boolean  | `true`               | Emit model fields as nullable by default. |
| `UpdateStoresDefaultRecursiveDepth` | number | `4`            | Default recursion depth for relation upserts inside stores. |
| `GenerateEndpoints`           | boolean  | `false`              | Also generate a single `gen_backend_routes.dart` enum by scanning your backend. |
| `BackendPath`                 | string   | `../abcx3-backend`   | Root of your NestJS backend for route scanning (when `GenerateEndpoints` is true). |
| `EndpointsOutputPath`         | string   | `gen_backend_routes.dart` | Output file for the routes enum (inside `output`). |
| `outputSetupForDevtools`      | boolean  | `false`              | Also emit a `setup_stores_devtool.dart` helper. Requires `abcx3_dart_store_devtool`. |

#### DevTools setup file

When `outputSetupForDevtools` is true, the generator writes a `setup_stores_devtool.dart` file next to the generated libraries. Import and call `setupAbcx3StoresDevTool()` from your Flutter `main()` in debug builds to stream all store updates to the DevTools UI. Requires the `abcx3_dart_store_devtool` package in the Flutter app.


Using the generated Stores

- Import the stores library into your Flutter app:

  dart
  import 'package:your_app/gen_models/abcx3_stores_library.dart';

- Ensure an `AuthHttpService` is available from your app’s service locator. Stores obtain it via:

  dart
  // ModelCreator uses ServiceManager.I.get<AuthHttpService>() under the hood
  // Provide an implementation of HttpService that performs authenticated HTTP requests.

- Fetch all with optional filter:

  dart
  final users$ = UserStore.instance.getAll$(
    modelFilter: ModelFilter<User>([
      LogicalFilterGroup([
        PropertyFilter<User, String>(
          property: 'email',
          operatorsAndValues: [FilterOperatorAndValue(FilterOperator.contains, '@gmail.com')],
        ),
        PropertyFilter<User, int>(
          property: 'age',
          operatorsAndValues: [FilterOperatorAndValue(FilterOperator.gte, 18)],
        ),
      ], logicalOperator: LogicalOperator.AND),
    ]),
  );

- Fetch by property value (unique vs many):

  dart
  // Unique field → T?
  final alice$ = UserStore.instance.getByEmail$('alice@example.com');

  // Non-unique field → List<T>
  final adults$ = UserStore.instance.getByAge$(18);

- Include relation fields in the response:

  dart
  final postWithAuthor$ = PostStore.instance.getById$(
    42,
    includes: [
      PostInclude.author(modelFilter: ModelFilter([ /* ... */ ])),
      PostInclude.comments(),
    ],
  );

- All store stream helpers dedupe and cache results, and upsert into their in-memory store automatically.


How stores call the backend (with NestJS generator)

- Each `<Model>Store` contains a `<Model>Endpoints` enum. Entries match the NestJS generator’s routes:
  - `getAll` → `POST /model`
  - `getBy<Field>` / `getManyBy<Field>` → `POST /model/by<Field>/:field`
  - relation list id queries → `POST /model/by<FieldName>Ids/:fieldNameIds`
- Stream methods call `AuthHttpService.request(endpoint, param: ..., body: { modelFilter })`.
- If you also enable `GenerateEndpoints` the generator writes a global `Abc3Route` enum that lists all routes discovered in the backend (useful for custom calls beyond the stores).


Model filter JSON shape

- Stores serialize filters into the same logical structure expected by the NestJS services:

  json
  {
    "modelFilter": {
      "AND": [ { "age": { "gte": 18 } } ],
      "OR":  [ { "email": { "contains": "@gmail.com" } } ]
    }
  }



## Contributing

Parts of this code come from a fork of [prisma-utils]([https://github.com/prisma-utils/prisma-utils/) by Johannes Schobel.
If you'd like to contribute, just fork the project and make a pull request.

### Building

Run `pnpm build` from the repo root to build the library.
