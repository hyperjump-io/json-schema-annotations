const curry = require("just-curry-it");
const PubSub = require("pubsub-js");
const { Core, BASIC } = require("@hyperjump/json-schema-core");
const Instance = require("./annotated-instance");
const ValidationError = require("./validation-error");


const annotate = async (schema, json = undefined, outputFormat = undefined) => {
  const compiled = await Core.compile(schema);
  const interpretAst = (json) => interpret(compiled, Instance.cons(json), outputFormat);

  return json === undefined ? interpretAst : interpretAst(json, outputFormat);
};

const interpret = curry(({ ast, schemaUri }, instance, outputFormat = BASIC) => {
  const output = [instance];
  const subscriptionToken = PubSub.subscribe("result", outputHandler(output));

  const result = Core.interpret({ ast, schemaUri }, instance, outputFormat);

  PubSub.unsubscribe(subscriptionToken);

  if (!result.valid) {
    throw new ValidationError(result);
  }

  return output[0];
});

const outputHandler = (output) => {
  let isPassing = true;
  const instanceStack = [];

  return (message, resultNode) => {
    if (message == "result.start") {
      instanceStack.push(output[0]);
      isPassing = true;
    } else if (message === "result" && isPassing) {
      output[0] = Instance.get(resultNode.instanceLocation, output[0]);

      if (resultNode.valid) {
        if (Core.getKeyword(resultNode.keyword).annotation) {
          const [, keyword] =  resultNode.keyword.split("#");
          const annotation = Core.getKeyword(resultNode.keyword).annotation(resultNode.ast);
          output[0] = Instance.annotate(output[0], keyword, annotation);
        }
      } else {
        output[0] = instanceStack[instanceStack.length - 1];
        isPassing = false;
      }
    } else if (message === "result.end") {
      instanceStack.pop();
    }
  };
};

module.exports = { annotate };
