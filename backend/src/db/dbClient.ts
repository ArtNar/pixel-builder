import UserRepository from "./user";
import BoardRepository from "./board";
import { createSingleton } from "../helpers/createSingleton";

export type DbClientType = {
  user: UserRepository;
  board: BoardRepository;
};

export type DbConfigType = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

export type DbConnectionType = DbClientType;

class DbClient {
  private config: DbConfigType;
  private db?: DbConnectionType;

  constructor(config: DbConfigType) {
    this.config = config;
  }

  private getConnectionString() {
    const conf = this.config;
    const cn = `postgres://${conf.user}@${conf.host}:${conf.port}/${conf.database}`;
    return cn;
  }

  private createConnection() {
    if (!this.config) {
      throw new Error("DbConfig expected");
    }

    // TODO: connect to db
    const cn = this.getConnectionString();

    const db = {
      user: new UserRepository(new Map()),
      board: new BoardRepository(new Map()),
    };

    return db;
  }

  getDb() {
    if (!this.db) {
      this.db = this.createConnection();
    }
    return this.db;
  }
}

const DB_CLIENT_KEY = "DB_CLIENT";
export default () =>
  createSingleton(
    global,
    DB_CLIENT_KEY,
    () => new DbClient({} as DbConfigType)
  );
