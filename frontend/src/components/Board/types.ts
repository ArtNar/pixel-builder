import { PointType as LocalPointType, BoardType as LocalBoardType } from '../../services/api/types';

export type BoardProps = {
  className?: string;
  board: LocalBoardType;
  currentColor?: string;
  indent?: number;
  boardRef: any;
  disabled?: boolean;
  updatePointOnServer: (point: PointType) => Promise<unknown>;
  setIsLoading: (isLoading: boolean) => any;
};

export type PointType = LocalPointType;
