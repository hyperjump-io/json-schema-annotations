import type { SchemaDocument, OutputFormat, Result } from "@hyperjump/json-schema";
import type { AnnotatedJsonDocument } from "./annotated-instance";


export type Core = {
  annotate: (
    (schema: SchemaDocument, value: unknown, outputFormat?: OutputFormat) => Promise<AnnotatedJsonDocument>
  ) & (
    (schema: SchemaDocument) => Promise<Annotator>
  );
};

export type Annotator = (value: unknown, outputFormat?: OutputFormat) => AnnotatedJsonDocument;

declare const core: Core;
export default core;
