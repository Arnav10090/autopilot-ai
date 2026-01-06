//Generic Retry + Validation Utility

import Ajv from "ajv";

const ajv = new Ajv();

export async function validateWithRetry({
  runAgent,
  schema,
  maxRetries = 2
}) {
  const validate = ajv.compile(schema);
  let lastError;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const output = await runAgent();

      const valid = validate(output);
      if (valid) return output;

      lastError = validate.errors;
      throw new Error("Schema validation failed");
    } catch (err) {
      if (attempt > maxRetries) {
        throw new Error(
          `Validation failed after ${maxRetries} retries: ${JSON.stringify(lastError)}`
        );
      }
    }
  }
}
