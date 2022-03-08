import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import StoreProvider from '../../services/store/StoreProvider';
import ApiProvider from '../../services/api/ApiProvider';
import ModalProvider from '../Modal/ModalProvider';
import Router from '../../router';
import { routes } from '../../router/routes';
import { detectIEEdge } from '../../helpers/detectIEEdge';
import { IE_DETECTED_MSG } from './constants';
import styles from './App.module.scss';
import 'antd/dist/antd.css';

const App = () => {
  const isIE = detectIEEdge();

  return (
    <div className={styles.app}>
      {isIE ? (
        <div className={styles.fallbackMsg}>{IE_DETECTED_MSG}</div>
      ) : (
        <ApiProvider>
          <ModalProvider>
            <StoreProvider>
              <BrowserRouter>
                <Router routes={routes} />
              </BrowserRouter>
            </StoreProvider>
          </ModalProvider>
        </ApiProvider>
      )}
    </div>
  );
};

export default App;
