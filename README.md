# Hyperjump - JSON Schema Annotations

JSON Schema Annotations (JSA) is built on [JSON Schema Core](https://github.com/hyperjump-io/json-schema-core).

* Supported JSON Schema Dialects
  * draft-04 | draft-06 | draft-07 | Draft 2019-09 | Draft 2020-12
  * Support for custom dialects can be configured
* Schemas can reference other schemas using a different draft
* Load schemas from filesystem (file://), network (http(s)://), or JavaScript

## Install
JSA includes support for node.js JavaScript (CommonJS and ES Modules),
TypeScript, and browsers.

### Node.js
```bash
npm install @hyperjump/json-schema-annotations
```

### Browser
When in a browser context, JSA is designed to use the browser's `fetch`
implementation instead of a node.js fetch clone. The Webpack bundler does this
properly without any extra configuration, but if you are using the Rollup
bundler you will need to include the `browser: true` option in your Rollup
configuration.

```javascript
  plugins: [
    resolve({
      browser: true
    }),
    commonjs()
  ]
```

### Versioning
This project is in beta and there may be breaking changes at any time. When it's
stable enough, I'll publish v1.0.0 and follow semantic versioning from there on
out.

## Usage
This package is an extension of [JSV](https://github.com/hyperjump-io/json-schema-validator#usage)
and includes its full API. Be sure to look at its documentation to see what else
you can do.

This package provides a function called `annotate` that takes a schema and a
value and returns an AnnotatedInstance object. The AnnotatedInstance object is a
wrapper around your value with functions that allow you to traverse the data
structure and get annotations for the values within. See the [AnnotatedInstance
API](#annotatedinstance) for the full list of what you can do.

```javascript
const JsonSchema = require("@hyperjump/json-schema-annotations");
const Instance = JsonSchema.AnnotatedInstance;


JsonSchema.add({
  "$id": "https://example.com/foo",
  "$schema": "https://json-schema.org/draft/2020-12/schema",

  "title": "Person",
  "unknown": "foo",

  "type": "object",
  "properties": {
    "name": {
      "$ref": "#/$defs/name",
      "deprecated": true
    },
    "givenName": {
      "$ref": "#/$defs/name",
      "title": "Given Name"
    },
    "familyName": {
      "$ref": "#/$defs/name",
      "title": "Family Name"
    }
  },

  "$defs": {
    "name": {
      "type": "string",
      "title": "Name"
    }
  }
});

const schema = await JsonSchema.get("https://example.com/foo");
const instance = await JsonSchema.annotate(schema, {
  name: "Jason Desrosiers",
  givenName: "Jason",
  familyName: "Desrosiers"
});

// Get the title of the instance
Instance.annotation(instance, "title"); // => ["Person"]

// Unknown keywords are collected as annotations
Instance.annotation(instance, "unknown"); // => ["foo"]

// The type keyword isn't an annotation
Instance.annotation(instance, "type"); // => []

// Get the title of each of the properties in the object
Instance.entries(instance)
  .map(([propertyName, propertyInstance]) => {
    Instance.annotation(propertyInstance, "title")); // => (Example) ["Given Name", "Name"]
  });

// List all locations in the instance that are deprecated
Instance.annotatedWith(instance, "deprecated"); // => ["/name"]
```

## TypeScript
Although the package is written in JavaScript, type definitions are included for
TypeScript support. The following example shows the types you might want to
know.

```typescript
import JsonSchema, { AnnotatedInstance } from "@hyperjump/json-schema-annotations";
import type { SchemaDocument, Draft202012Schema } from "@hyperjump/json-schema-annotations";


const schema: SchemaDocument = await JsonSchema.get("https://json-schema.hyperjump.io/schema");
const annotatePerson: Annotator = await JsonSchema.annotate(schema);
try {
  const instance: AnnotatedInstance = annotatePerson({ ... });
  // ...
} catch (error: unknown) {
  if (error instanceof ValidationError) {
    console.log(error.output);
  } else {
    console.log(error);
  }
}
```

## API
The following functions are available to you in addition to the
full API from [JSV](https://github.com/hyperjump-io/json-schema-validator#api).

* **annotate**: (schema: SDoc, instance: any, outputFormat: OutputFormat = FLAG) => Promise<AnnotatedInstance>

    Annotate an instance using the given schema. The function is curried to
    allow compiling the schema once and applying it to multiple instances. This
    may throw an InvalidSchemaError if there is a problem with the schema or a
    ValidationError if the instance doesn't validate against the schema.
* ** ValidationError**:
    output: OutputUnit -- The errors that were found while validating the
    instance.

### AnnotatedInstance
The AnnotatedInstance object is an extension of the Instance object from
[JSC](https://github.com/hyperjump-io/json-schema-core#instance). You have
access to the full Instance API in addition to following functions.

* **annotation**: (instance: AnnotatedInstance, keyword: string) => [any]

    Get the annotations for a given keyword at the location represented by the
    instance object.
* **annotatedWith**: (instance: AnnotatedInstance, keyword: string) => [JsonPointer]

    Get an array of JSON Pointers to all the locations that are annotated with
    the given keyword.
* **annotate**: (instance: AnnotatedInstance, keyword: string, value: any) => AnnotatedInstance

    Add an annotation to an instance. This is used internally, you probably
    don't need it.

## Contributing

### Tests

Run the tests

```bash
npm test
```

Run the tests with a continuous test runner

```bash
npm test -- --watch
```
