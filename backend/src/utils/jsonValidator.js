import Ajv from "ajv";

const ajv = new Ajv();

const requirementSchema = {
  type: "object",
  properties: {
    functional_requirements: { type: "array" },
    non_functional_requirements: { type: "array" },
    assumptions: { type: "array" },
    missing_information: { type: "array" }
  },
  required: [
    "functional_requirements",
    "non_functional_requirements",
    "assumptions",
    "missing_information"
  ]
};

export function validateRequirements(json) {
  const validate = ajv.compile(requirementSchema);
  const valid = validate(json);

  if (!valid) {
    throw new Error("Invalid JSON structure from LLM");
  }

  return json;
}

//This is production-grade thinking.