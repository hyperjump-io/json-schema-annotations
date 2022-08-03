import fs from "fs";
import { expect } from "chai";
import md5 from "crypto-js/md5";
import type { SchemaObject, Annotator } from ".";
import JsonSchema from ".";
import AnnotatedInstance from "./annotated-instance";


type Suite = {
  title: string;
  schema: SchemaObject;
  subjects: Subject[];
};

type Subject = {
  title: string;
  instance: unknown;
  assertions: Assertion[];
};

type Assertion = {
  location: string;
  keyword: string;
  operation: string;
  expected: any[];
};

const host = "https://annotations.json-schema.hyperjump.io";
const dialect = "https://json-schema.org/draft/2020-12/schema";

const testSuiteFilePath = `${__dirname}/tests`;

fs.readdirSync(testSuiteFilePath, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .forEach((entry) => {
    const file = `${testSuiteFilePath}/${entry.name}`;
    const suites = JSON.parse(fs.readFileSync(file, "utf8")) as Suite[];

    suites.forEach((suite) => {
      describe(suite.title, () => {
        let annotate: Annotator;

        beforeEach(async () => {
          const id = `${host}/${md5(JSON.stringify(suite.schema))}`;
          JsonSchema.add(suite.schema, id, dialect);

          const schema = await JsonSchema.get(id);
          annotate = await JsonSchema.annotate(schema);
        });

        suite.subjects.forEach((subject) => {
          describe(subject.title, () => {
            let instance: any;

            beforeEach(() => {
              instance = annotate(subject.instance);
            });

            subject.assertions.forEach((assertion) => {
              it(`${assertion.location} => ${assertion.keyword} ${assertion.operation} ${JSON.stringify(assertion.expected)}`, () => {
                const annotations = AnnotatedInstance.annotation(AnnotatedInstance.get(assertion.location, instance), assertion.keyword);

                switch (assertion.operation) {
                  case undefined:
                  case "EQUALS":
                    expect(annotations).to.eql(assertion.expected);
                    break;
                  default:
                    throw Error(`Unknown operation '${assertion.operation}'`);
                }
              });
            });
          });
        });
      });
    });
  });
