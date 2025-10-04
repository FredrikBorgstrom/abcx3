
This library automatically creates Dart class files for all your Prisma models. Besides an ordinary constructor it will also create a fromJson constructor for every class.

## Features

- fromJson constructors which also supports nested objects
- toJson method (properties with null values are not emitted since version 1.2.0)
- overrides equal operator so that objects are considered equal when their property values are equal
- overrides hashCode based on object's property values
- handles default values in constructors
- all model classes and Enums can be encapsulated by a common namespace
- copyWith and copyWithInstance method added since version 1.4.0 
- supports queries that generate '_count' for all list-type fields, for instance 'posts' will generate a '$postsCount' property in the Dart class

## Installation

```bash
npm i prisma-generator-dart -D
```


## Usage

Open your `prisma.schema` file to add a new `generator`.

```prisma
# prisma.schema file

generator dart {
  provider = "node ./node_modules/@abcx3/prisma-generator-nestjs/index.js"
  output = "absolute/path/to/your/flutter/project/lib/generated_models"
  # dryRun = true / false
}
```


### General Configuration Parameters

The main parameters for this generator as as follows:

| Parameter Name | Type    | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                              |
| -------------- | ------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| provider       | string  | -             | The name of the generator - must be set to `node ./node_modules/@abcx3/prisma-generator-dart/index.js`                                                                                                                                                                                                                                                                                                                       |
| output         | string  | -             | Destination path for the generated files. This should be an absolute path to your flutter/dart project. The folder will be created if it doesn't exist. Name it for instance 'gen_models' |
| dryRun         | boolean | false         | don't write any content but output everything to the console instead                                                                                                                                                                                                                                                                                                                     |
| outputSetupForDevtools | boolean | false | Also emit `setup_stores_devtool.dart` next to the generated libraries. Requires the host app to depend on `abcx3_dart_store_devtool`. |

#### DevTools setup file

When `outputSetupForDevtools` is true, the generator writes a `setup_stores_devtool.dart` file into the generator output folder. Import and call `setupAbcx3StoresDevTool()` from your Flutter `main()` in debug builds to stream all store updates to the DevTools UI. This mirrors the helper used in the ABCx3 app and expects the `abcx3_dart_store_devtool` package to be available.



## Contributing

Parts of this code come from a fork of [prisma-utils]([https://github.com/prisma-utils/prisma-utils/) by Johannes Schobel.
If you'd like to contribute, just fork the project and make a pull request.

### Building

Run `pnpm build` to build the library.

