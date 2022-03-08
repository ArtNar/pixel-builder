import React from 'react';
import { UserType, PointType, BoardType } from './types';

type ContextValue = {
  ws: any;
  apiReady: boolean;
  registerUser: (userData: UserType) => Promise<UserType>;
  loginUser: (userData: Partial<UserType>) => Promise<UserType>;
  getUser: (userId: string) => Promise<UserType>;
  getCurrentUser: () => Promise<UserType>;
  getUsers: () => Promise<UserType[]>;
  getBoardUsersQuantity: (boardId: BoardType['id']) => Promise<number>;
  drawPoint: (boardId: BoardType['id'], point: PointType) => Promise<PointType>;
  createBoard: (data: Pick<BoardType, 'name' | 'size' | 'closedAt' | 'isPublic'>) => Promise<BoardType>;
  getBoard: (boardId: BoardType['id']) => Promise<BoardType>;
  getBoards: () => Promise<BoardType[]>;
  enterBoard: (boardId: BoardType['id']) => Promise<number>;
  leaveBoard: (boardId: BoardType['id']) => Promise<number>;
};

const Context = React.createContext<ContextValue>(null);

export default Context;
