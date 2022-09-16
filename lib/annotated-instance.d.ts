import type { Json, JsonObject, JsonType } from "@hyperjump/json-schema";


export type AnnotatedInstance = {
  annotate: (instance: AnnotatedJsonDocument, keyword: string, value: string) => AnnotatedJsonDocument;
  annotation: <A>(instance: AnnotatedJsonDocument, keyword: string) => A[];
  annotatedWith: (instance: AnnotatedJsonDocument, keyword: string) => AnnotatedJsonDocument[];
  nil: AnnotatedJsonDocument<undefined>;
  cons: (instance: Json, id?: string) => AnnotatedJsonDocument;
  get: (uri: string, context?: AnnotatedJsonDocument) => AnnotatedJsonDocument;
  uri: (doc: AnnotatedJsonDocument) => string;
  value: <A extends Json>(doc: AnnotatedJsonDocument<A>) => A;
  has: (key: string, doc: AnnotatedJsonDocument<JsonObject>) => boolean;
  typeOf: (
    (doc: AnnotatedJsonDocument, type: "null") => doc is AnnotatedJsonDocument<null>
  ) & (
    (doc: AnnotatedJsonDocument, type: "boolean") => doc is AnnotatedJsonDocument<boolean>
  ) & (
    (doc: AnnotatedJsonDocument, type: "object") => doc is AnnotatedJsonDocument<JsonObject>
  ) & (
    (doc: AnnotatedJsonDocument, type: "array") => doc is AnnotatedJsonDocument<Json[]>
  ) & (
    (doc: AnnotatedJsonDocument, type: "number" | "integer") => doc is AnnotatedJsonDocument<number>
  ) & (
    (doc: AnnotatedJsonDocument, type: "string") => doc is AnnotatedJsonDocument<string>
  ) & (
    (doc: AnnotatedJsonDocument, type: JsonType) => boolean
  ) & (
    (doc: AnnotatedJsonDocument) => (type: JsonType) => boolean
  );
  step: (key: string, doc: AnnotatedJsonDocument<JsonObject | Json[]>) => AnnotatedJsonDocument<typeof doc.value>;
  entries: (doc: AnnotatedJsonDocument<JsonObject>) => [string, AnnotatedJsonDocument][];
  keys: (doc: AnnotatedJsonDocument<JsonObject>) => string[];
  map: (
    <A>(fn: MapFn<A>, doc: AnnotatedJsonDocument<Json[]>) => A[]
  ) & (
    <A>(fn: MapFn<A>) => (doc: AnnotatedJsonDocument<Json[]>) => A[]
  );
  forEach: (
    (fn: ForEachFn, doc: AnnotatedJsonDocument<Json[]>) => void
  ) & (
    (fn: ForEachFn) => (doc: AnnotatedJsonDocument<Json[]>) => void
  );
  filter: (
    (fn: FilterFn, doc: AnnotatedJsonDocument<Json[]>) => AnnotatedJsonDocument[]
  ) & (
    (fn: FilterFn) => (doc: AnnotatedJsonDocument<Json[]>) => AnnotatedJsonDocument[]
  );
  reduce: (
    <A>(fn: ReduceFn<A>, acc: A, doc: AnnotatedJsonDocument<Json[]>) => A
  ) & (
    <A>(fn: ReduceFn<A>) => (acc: A, doc: AnnotatedJsonDocument<Json[]>) => A
  ) & (
    <A>(fn: ReduceFn<A>) => (acc: A) => (doc: AnnotatedJsonDocument<Json[]>) => A
  );
  every: (
    (fn: FilterFn, doc: AnnotatedJsonDocument<Json[]>) => boolean
  ) & (
    (fn: FilterFn) => (doc: AnnotatedJsonDocument<Json[]>) => boolean
  );
  some: (
    (fn: FilterFn, doc: AnnotatedJsonDocument<Json[]>) => boolean
  ) & (
    (fn: FilterFn) => (doc: AnnotatedJsonDocument<Json[]>) => boolean
  );
  length: (doc: AnnotatedJsonDocument<Json[] | string>) => number;
};

type MapFn<A> = (element: AnnotatedJsonDocument, index: number) => A;
type ForEachFn = (element: AnnotatedJsonDocument, index: number) => void;
type FilterFn = (element: AnnotatedJsonDocument, index: number) => boolean;
type ReduceFn<A> = (accumulator: A, currentValue: AnnotatedJsonDocument, index: number) => A;

export type AnnotatedJsonDocument<A extends Json | undefined = Json> = {
  id: string;
  pointer: string;
  instance: Json;
  value: A;
  annotations: {
    [pointer: string]: {
      [keyword: string]: unknown[]
    }
  }
};

declare const instance: AnnotatedInstance;
export default instance;
