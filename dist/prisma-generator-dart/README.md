# @prisma-utils/prisma-crud-generator

This library automatically creates Dart class files for all your Prisma models. Besides an ordinary constructor it will also create a fromJson constructor for every class.

## Features

- fromJson constructors
- handles default values in constructors
- all model classes and Enums can be encapsulated by a common namespace

## Installation



```bash
npm i prisma-generator-dart -D
```


## Usage

Open your `prisma.schema` file to add a new `generator`.

```prisma
# prisma.schema file

generator dart {
  provider = "node ./node_modules/prisma-generator-dart/src/generator.js"
  output = "absolute/path/to/your/flutter/project/lib/generated_models"
  # dryRun = true / false
}
```


### General Configuration Parameters

The main parameters for this generator as as follows:

| Parameter Name | Type    | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                              |
| -------------- | ------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| provider       | string  | -             | The name of the generator - must be set to `prisma-crud-generator`                                                                                                                                                                                                                                                                                                                       |
| output         | string  | -             | Path where all the files are generated to. You can use `#{model}` to insert the lowercase name of the currently processed model (i.e., `user`), `#{Model}` for the real model name (written as is, i.e., `User`), `#{MODEL}` for the uppercase name (i.e., `USER`), and `#{moDel}` for the camelCased version of the model name (i.e., `userName`; only the first letter is lowercased). |
| dryRun         | boolean | false         | don't write any content but output everything to the console instead                                                                                                                                                                                                                                                                                                                     |
|                                                                                                                                                                                                                                                                                                  |



## Contributing

Parts of this code come from a fork of [prisma-utils]([https://github.com/prisma-utils/prisma-utils/) by Johannes Schobel.

### Building

Run `pnpm build` to build the library.


