import {
  GetBoardsInputType,
  GetBoardInputType,
  EnterLeaveBoardInputType,
  DrawPointInputType,
  CreateBoardInputType,
} from "../../db/board";
import { DbConnectionType } from "../../db/dbClient";
import { createSingleton } from "../../helpers/createSingleton";

const boardsUsers: any = new Map();

export class BoardManager {
  async getBoards(options: GetBoardsInputType, db: DbConnectionType) {
    return db.board.getBoards(options);
  }

  async getBoard(options: GetBoardInputType, db: DbConnectionType) {
    return db.board.getBoard(options);
  }

  async getBoardUsers(options: GetBoardInputType) {
    return boardsUsers.get(options.boardId) || [];
  }

  async enterBoard(options: EnterLeaveBoardInputType, db: DbConnectionType) {
    boardsUsers.set(options.boardId, [
      ...(boardsUsers.get(options.boardId) || []).filter(
        (userId: EnterLeaveBoardInputType["userId"]) =>
          userId !== options.userId
      ),
      options.userId,
    ]);

    return boardsUsers.get(options.boardId);
  }

  async leaveBoard(options: EnterLeaveBoardInputType, db: DbConnectionType) {
    boardsUsers.set(
      options.boardId,
      (boardsUsers.get(options.boardId) || []).filter(
        (userId: EnterLeaveBoardInputType["userId"]) =>
          userId !== options.userId
      )
    );

    return boardsUsers.get(options.boardId);
  }

  async createBoard(options: CreateBoardInputType, db: DbConnectionType) {
    return db.board.createBoard(options);
  }

  async drawPoint(options: DrawPointInputType, db: DbConnectionType) {
    return db.board.drawPoint(options);
  }
}

const BOARD_MANAGER_KEY = "BOARD_MANAGER";
export default () =>
  createSingleton(global, BOARD_MANAGER_KEY, () => new BoardManager());
