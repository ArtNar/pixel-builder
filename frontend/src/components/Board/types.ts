import { PointType as LocalPointType, BoardType as LocalBoardType } from '../../services/api/types';

export type BoardProps = {
  className?: string;
  board: LocalBoardType;
  currentColor?: string;
  updatePointOnServer: (point: PointType) => Promise<unknown>;
};

export type PointType = LocalPointType;
