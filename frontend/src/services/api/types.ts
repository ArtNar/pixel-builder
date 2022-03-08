export type UserType = {
  id?: string;
  name: string;
  email: string;
  password: string;
};

export type PointType = {
  id: number;
  active: boolean;
  color: string;
  owner?: UserType;
  updatedAt: string;
};

export type BoardType = {
  id: string;
  name: string;
  owner: UserType['id'];
  createdAt: string;
  closedAt: string;
  isPublic: boolean;
  size: number;
  points: PointType[];
};
