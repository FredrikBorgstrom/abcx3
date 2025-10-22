@abcx3/prisma-generator-nestjs

Generate NestJS modules, controllers and services for every Prisma model in your schema. It’s designed to work great on its own, and it’s the companion backend generator for @abcx3/prisma-generator-dart client “stores”.

When used together:
- The NestJS generator creates predictable routes per model (POST-only for data fetch so model filters can be sent in the request body).
- The Dart generator embeds matching route metadata into each generated Store (<Model>Endpoints enum) so Dart stores can call the backend themselves, including passing complex Prisma-like filters.


Installation

- Add the generator to your backend project:

  bash
  npm i -D @abcx3/prisma-generator-nestjs

- Add a generator block to your prisma schema (backend):

  prisma
  // schema.prisma (backend)
  generator nestjs {
    provider                         = "node ./node_modules/@abcx3/prisma-generator-nestjs/index.js"
    output                           = "./src/gen"       // where to emit modules/controllers/services
    GenerateControllers               = true              // enable controllers so routes are created
    GenerateModule                    = true
    GenerateServices                  = true
    WrapWithNeverthrow                = true              // make service methods return Result<..., Error>
    PrismaServiceImportPath           = "prisma/prisma.service"
    PrismaModuleName                  = "PrismaModule"
    PrismaModuleImportPath            = "src/prisma/prisma.module"
    PrismaClientImportPath            = "@prisma/client"
    // Optional extras
    // prefix                          = "gen"            // file name prefix (default)
    // secondaryOutputPath             = "./src/routes"   // also emit a copy without auto-gen banner
    // GenerateEmptyControllersAndServices = true         // emit empty classes if you want to hand-roll logic
    // GuardClass                      = "JwtAuthGuard"   // add a Nest guard decorator to all routes
    // GuardImportPath                 = "src/auth/jwt.guard"
  }

- Generate files:

  bash
  npx prisma generate


What gets generated

- Per Prisma model (e.g. User):
  - `src/gen/user/user.module.ts` – imports `PrismaModule`, exports the service, optionally registers controller
  - `src/gen/user/user.service.ts` – typed data access over PrismaService with helpers for filtering
  - `src/gen/user/user.controller.ts` – REST endpoints matching the Dart Stores’ expectations
- Shared helper:
  - `src/gen/store_common.ts` – filter types and reusable helpers used by all services


Generated routes (used by Dart Stores)

- Controllers use POST so the request body can carry a Prisma-style filter.
- For a model `User`, routes look like:
  - `POST /user` → `getAll(req.body?.modelFilter)`
  - For scalar/id/unique fields (e.g. `email`):
    - `POST /user/byEmail/:email` → `getByFieldValues({ email }, req.body?.modelFilter)` or `getManyByFieldValues` for non-unique fields
  - For list/object relation fields (many-to-many):
    - `POST /user/byPostsIds/:postsIds` with `postsIds` as comma-separated `id`s

Request body modelFilter shape

- The body may contain a `modelFilter` compatible with Prisma WhereInput logical operators:

  json
  {
    "modelFilter": {
      "AND": [
        { "email": { "contains": "@gmail.com" } },
        { "age": { "gte": 18 } }
      ],
      "OR": [
        { "firstName": { "startsWith": "A" } }
      ]
    }
  }

- Supported operators mirror Prisma: `equals, not, gt, gte, lt, lte, inList, notInList, contains, startsWith, endsWith, notContains, notStartsWith, notEndsWith, isNull, isNotNull`.


Using guards

- If you configure `GuardClass` and `GuardImportPath`, the generator adds `@UseGuards(YourGuard)` to all routes and imports the guard where needed.

Neverthrow wrapping

- With `WrapWithNeverthrow = true` (default), service method return types are converted from `Promise<T | Error>` into `Promise<Result<T, Error>>` and error throws become `err(...)` values.


Working with @abcx3/prisma-generator-dart

- The Dart generator emits, for every model, a `<Model>Endpoints` enum that matches the routes this generator produces:
  - `getAll` → `POST /model`
  - `getBy<Field>` / `getManyBy<Field>` → `POST /model/by<Field>/:field`
  - relation list id queries → `POST /model/by<FieldName>Ids/:fieldNameIds`
- The generated Dart Stores (e.g. `UserStore`) call these endpoints through an `AuthHttpService` and attach `modelFilter` into the POST body when provided.

Example

- Given a Prisma model:

  prisma
  model User {
    id      Int     @id @default(autoincrement())
    email   String  @unique
    name    String?
    age     Int?
  }

- This generator creates `src/gen/user/user.controller.ts` with routes:

  ts
  @Controller('user')
  export class UserController {
    constructor(private readonly service: UserService) {}

    @Post()
    getAll(@Req() req?) {
      return this.service.getAll(req?.body?.modelFilter);
    }

    @Post('byEmail/:email')
    getByEmail(@Req() req, @Param('email') email: string) {
      return this.service.getByFieldValues({ email }, req?.body?.modelFilter);
    }
  }

- And a `user.service.ts` using Prisma and helpers from `store_common.ts` to apply logical filters.


Advanced options

- `output`: directory where files are written. Combined with an internal base path for model folders.
- `prefix`: string prefixed to generated file names (default: `gen_...`).
- `secondaryOutputPath`: also emit a second copy without the auto-generated banner and with an empty prefix. Useful for publishing a transformed set (e.g. move into `src/routes`).
- `GenerateEmptyControllersAndServices`: when true, emits empty classes so you can fill methods yourself while still keeping generated modules and structure.


Troubleshooting

- Ensure `PrismaServiceImportPath`, `PrismaModuleName` and `PrismaModuleImportPath` match your app.
- Routes are POST by design to allow `modelFilter` in the request body; if your HTTP client expects GET for listing, either keep POST for filtering or add your own GET routes alongside the generated ones.
