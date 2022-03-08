import "dotenv/config";
import { App } from "uWebSockets.js";
import logger from "./lib/logger";
import { initServer } from "./lib/initServer";
import createUserManager from "./managers/user";
import createBoardManager from "./managers/board";
import createDB from "./db/dbClient";
import websockets from "./websockets";

initServer()
  .then(() => {
    const port = +(process.env.PORT || 3000);

    const server = App();

    const db = createDB().getDb();
    const userManager = createUserManager();
    const boardManager = createBoardManager();

    websockets(server, port, {
      db,
      userManager,
      boardManager,
    });
  })
  .catch((e) => {
    logger.error(e);
  });
