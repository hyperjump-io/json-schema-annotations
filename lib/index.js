const JsonSchema = require("@hyperjump/json-schema");
const Annotations = require("./core");
const AnnotatedInstance = require("./annotated-instance");
const ValidationError = require("./validation-error");


JsonSchema.Keywords.metaData.annotation = (value) => value;

module.exports = {
  ...JsonSchema,
  annotate: Annotations.annotate,
  AnnotatedInstance: AnnotatedInstance,
  ValidationError: ValidationError
};
