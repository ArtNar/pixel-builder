import logger from "../lib/logger";

const handleProcessEvents = () => {
  try {
    process.on("uncaughtException", (error) => {
      logger.error(error);
      console.warn(error);
    });

    process.on("uncaughtException", async (error) => {
      logger.error(error);
      console.warn(error);
    });

    process.on("unhandledRejection", async (error) => {
      logger.error(error);
      console.warn(error);
    });
  } catch (e) {
    throw new Error(
      `[startup.handleProcessEvents] ${(e as Error).message || e}`
    );
  }
};

export function initServer() {
  return new Promise((resolve, reject) => {
    try {
      handleProcessEvents();
      resolve(undefined);
    } catch (e) {
      reject(`[startup] ${(e as Error).message}`);
    }
  });
}
