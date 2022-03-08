import { uuid } from "uuidv4";
import { PointType, BoardType, UserType } from "./models";

const DEFAULT_POINTS_COUNT = 20 ** 2;
// const DEFAULT_POINTS_COUNT = 400 ** 2;

const DEFAULT_POINT = {
  active: false,
  color: "transparent",
};

export type CreateBoardInputType = {
  userId: UserType["id"];
} & Pick<BoardType, "name" | "size" | "closedAt" | "isPublic">;

export type GetBoardsInputType = {
  userId: UserType["id"];
};

export type GetBoardInputType = {
  boardId: BoardType["id"];
};

export type EnterLeaveBoardInputType = {
  userId: UserType["id"];
  boardId: BoardType["id"];
};

export type DrawPointInputType = {
  boardId: BoardType["id"];
  point: PointType;
};

export default class Board {
  private boardDb: any;

  constructor(boardDb: any) {
    this.boardDb = boardDb;
  }

  async drawPoint(options: DrawPointInputType): Promise<PointType> {
    const updatedAt = new Date().toISOString();

    const board = this.boardDb.get(options.boardId);

    // TODO: check if user allowed to edit the board

    const updatedPoint = { ...options.point, updatedAt };
    const newPoints = board.points.slice();
    newPoints.splice(updatedPoint.id, 1, updatedPoint);
    const updatedBoard = {
      ...board,
      points: newPoints,
    };

    this.boardDb.set(options.boardId, updatedBoard);

    return updatedPoint;
  }

  async createBoard(options: CreateBoardInputType): Promise<BoardType> {
    const createdAt = new Date().toISOString();
    const boardId = uuid();

    const points: PointType[] = new Array(options.size || DEFAULT_POINTS_COUNT)
      .fill(DEFAULT_POINT)
      .map((point, idx) => ({ ...point, id: idx, updatedAt: createdAt }));

    const board = {
      id: boardId,
      name: options.name,
      owner: options.userId,
      createdAt,
      closedAt: options.closedAt,
      isPublic: options.isPublic || false,
      size: options.size,
      points,
    };

    this.boardDb.set(boardId, board);

    return board;
  }

  async getBoards(
    options: GetBoardsInputType
  ): Promise<Pick<BoardType, "id" | "name">[]> {
    const boards = Array.from(this.boardDb, ([id, value]) => value);
    const userBoards = boards.filter(
      ({ owner, isPublic }) => owner === options.userId && !isPublic
    );
    const publicBoards = boards.filter(({ isPublic }) => isPublic);

    return [...userBoards, ...publicBoards].map(
      ({ points, owner, ...rest }) => rest
    );
  }

  async getBoard(options: GetBoardInputType): Promise<BoardType> {
    return this.boardDb.get(options.boardId);
  }
}
