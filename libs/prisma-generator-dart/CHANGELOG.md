## [2.0.0] Breaking changes: Removed the option ModelsImplementBaseClass and all classes now implement multiple interfaces. If there is a field which is set as ID for the model, it will generate a 'uniqueId' getter for that method, which means that the ID field can have any name and type.

## [1.4.0] Added copyWith and copyWithInstance methods. Classes supports '_count' properties for list-type fields, for instance 'posts' will generate a '$postsCount' property in the Dart class.

## [1.3.1] Upgraded dependencies in package.json

## [1.3.0] Prisma-generator-dart: Breaking change! Model classes now implement an 'Id' interface if the model has an integer 'id' property, or the 'IdString' interface if the model has a string 'id' property. You can turn off this behavior, so that the model classes dp not implement any interfaces, by setting the argument "ModelsImplementBaseClass" to false in the dart generator settings in your schema file.

## [1.2.0] Prisma-generator-dart: properties with null values are no longer emitted from the toJson method

## [1.1.2] Prisma-generator-dart: Equal now supports comparing nested objects  (2023-05-18)

## [1.1.0] Prisma-generator-dart: Added overrides for equal and hashCode (2023-05-16)


