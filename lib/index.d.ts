import type JsonSchema from "@hyperjump/json-schema";
import type { Core } from "./core";


export type JsonSchemaAnnotations = typeof JsonSchema & Core;

export const annotate: Core["annotate"];

export * from "@hyperjump/json-schema";
export { Annotator } from "./core";
export * from "./annotated-instance";

declare const jsonSchema: JsonSchemaAnnotations;
export default jsonSchema;
