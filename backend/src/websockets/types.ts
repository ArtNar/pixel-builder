import { TemplatedApp, WebSocket } from "uWebSockets.js";
import { EVENTS } from "./constants";
import { DbConnectionType } from "../db/dbClient";
import { UserManager } from "../managers/user";
import { BoardManager } from "../managers/board";

export type MessageType = {
  id?: string;
  type: EVENTS;
  body?: any;
  error?: {
    code: number;
    message: string;
  };
  token?: string;
  recipients?: string[];
};

export type WSType = WebSocket;

export type OptionsType = {
  db: DbConnectionType;
  userManager: UserManager;
  boardManager: BoardManager;
};

export type ServerType = TemplatedApp;
