//LOGGING UTILITY (STRUCTURED LOGS)

export function logInfo(message, data = {}) {
  console.log(
    JSON.stringify({
      level: "INFO",
      timestamp: new Date().toISOString(),
      message,
      ...data
    })
  );
}

export function logError(message, data = {}) {
  console.error(
    JSON.stringify({
      level: "ERROR",
      timestamp: new Date().toISOString(),
      message,
      ...data
    })
  );
}
