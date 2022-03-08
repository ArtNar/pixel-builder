import { uuid } from "uuidv4";
import util from "util";
import handleWSMessage from "./handlers";
import { EVENTS } from "./constants";
import { MessageType, ServerType, OptionsType, WSType } from "./types";

const sockets: any = new Map();

const decoder = new util.TextDecoder("utf-8");

const checkIfUserHasAccess = (
  message: MessageType,
  ws: WSType,
  options: OptionsType
) => {
  if (
    message.type === EVENTS.USER_REGISTER ||
    message.type === EVENTS.USER_LOGIN
  ) {
    return true;
  }

  if (!message.token) {
    ws.send(
      JSON.stringify({
        id: message.id,
        type: message.type,
        error: {
          code: 400,
          message: "Token has not provided",
        },
      })
    );
    return;
  }

  const { userManager } = options || {};

  const isValidToken = userManager.isValidToken(message.token);

  if (isValidToken) {
    return true;
  }

  ws.send(
    JSON.stringify({
      id: message.id,
      type: message.type,
      error: {
        code: 401,
        message: "Unauthorized access attempt",
      },
    })
  );

  return false;
};

const makeServer = (server: ServerType, options: OptionsType) => {
  return {
    compression: 0,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 60,
    open: (ws: WSType) => {
      ws.id = uuid();

      ws.subscribe(EVENTS.POINT_DRAW);

      sockets.set(ws.id, { ws });
    },
    message: (ws: WSType, message: any) => {
      const parsedMessage: MessageType = JSON.parse(decoder.decode(message));

      const canProcess = checkIfUserHasAccess(parsedMessage, ws, options);

      if (canProcess) {
        handleWSMessage({ message: parsedMessage, ws, server, options });
      }
    },
    close: (ws: WSType) => {
      sockets.delete(ws.id);
    },
  };
};

export { makeServer };
