import React, { Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import StoreContext from '../services/store/StoreContext';
import { Loader } from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';

const Page = ({ settings: { component: Component, onlyPrivate, onlyPublic } }) => {
  const { userData } = React.useContext(StoreContext);
  const location = useLocation();

  const isAuthenticated = !!userData?.name;

  if (onlyPrivate && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (onlyPublic && isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/" />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary>
        <Component />
      </ErrorBoundary>
    </Suspense>
  );
};

export default Page;
