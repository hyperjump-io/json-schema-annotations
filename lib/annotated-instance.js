const { Instance } = require("@hyperjump/json-schema-core");


const nil = Object.freeze({ ...Instance.nil, annotations: {} });
const cons = (instance, id = "") => Object.freeze({ ...nil, id, instance, value: instance });

const annotation = (instance, keyword) => instance.annotations?.[instance.pointer]?.[keyword] || [];

const annotate = (instance, keyword, value) => {
  return Object.freeze({
    ...instance,
    annotations: {
      ...instance.annotations,
      [instance.pointer]: {
        ...instance.annotations[instance.pointer],
        [keyword]: [
          value,
          ...(instance.annotations[instance.pointer]?.[keyword] || [])
        ]
      }
    }
  });
};

const annotatedWith = (instance, keyword) => {
  const instances = [];

  for (const instancePointer in instance.annotations) {
    if (keyword in instance.annotations[instancePointer]) {
      instances.push(Instance.get(`#${instancePointer}`, instance));
    }
  }

  return instances;
};

module.exports = {
  ...Instance,
  nil, cons, annotation, annotate, annotatedWith
};
