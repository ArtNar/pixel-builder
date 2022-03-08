import React from 'react';
import { UserType as LocalUserType } from '../api/types';

export type UserType = LocalUserType;

type ContextValue = {
  userData?: UserType;
  setUserData?: (data: UserType) => void;
};

const Context = React.createContext<ContextValue>(null);

export default Context;
