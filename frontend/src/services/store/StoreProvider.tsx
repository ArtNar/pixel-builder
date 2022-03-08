import React from 'react';
import Context from './StoreContext';
import ApiContext from '../api/ApiContext';
import TokenService from '../token';
import { Loader } from '../../components/Loader';

interface ProviderProps {
  children: any;
}

const Provider = ({ children }: ProviderProps) => {
  const { apiReady, getCurrentUser } = React.useContext(ApiContext);

  const [userData, setUserData] = React.useState(null);

  const [isLoadingData, setIsLoadingData] = React.useState(true);

  const handleSetUserData = React.useCallback((userData) => {
    setUserData(userData);
  }, []);

  React.useEffect(() => {
    const initData = async () => {
      setIsLoadingData(true);

      try {
        const user = await getCurrentUser();

        if (user) {
          setUserData(user);
        }
      } catch (error) {
        console.log(error.message);
      }

      setIsLoadingData(false);
    };

    if (apiReady && TokenService.token) {
      initData();
    } else {
      setIsLoadingData(false);
    }
  }, [apiReady, getCurrentUser]);

  return (
    <Context.Provider
      value={{
        userData,
        setUserData: handleSetUserData,
      }}>
      {isLoadingData ? <Loader /> : children}
    </Context.Provider>
  );
};

export default Provider;
