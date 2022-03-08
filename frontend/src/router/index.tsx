import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Page from './Page';

const Router = ({ routes }) => (
  <Routes>
    {routes.map((route) => (
      <Route key={route.path} path={route.path} element={<Page settings={route} />} />
    ))}
  </Routes>
);

export default Router;
