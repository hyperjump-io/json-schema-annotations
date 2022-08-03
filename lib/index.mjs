import JsonSchema from "./index.js";


export const add = JsonSchema.add;
export const get = JsonSchema.get;
export const validate = JsonSchema.validate;
export const annotate = JsonSchema.annotate;
export const compile = JsonSchema.compile;
export const interpret = JsonSchema.interpret;
export const setMetaOutputFormat = JsonSchema.setMetaOutputFormat;
export const setShouldMetaValidate = JsonSchema.setShouldMetaValidate;
export const addMediaTypePlugin = JsonSchema.addMediaTypePlugin;
export const FLAG = JsonSchema.FLAG;
export const BASIC = JsonSchema.BASIC;
export const DETAILED = JsonSchema.DETAILED;
export const VERBOSE = JsonSchema.VERBOSE;
export const Keywords = JsonSchema.Keywords;
export const InvalidSchemaError = JsonSchema.InvalidSchemaError;
export const ValidationError = JsonSchema.ValidationError;
export const AnnotatedInstance = JsonSchema.AnnotatedInstance;

export default JsonSchema;
