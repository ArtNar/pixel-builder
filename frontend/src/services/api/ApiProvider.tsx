import React from 'react';
import { v4 as uuid } from 'uuid';
import Context from './ApiContext';
import TokenService from '../token';
import createApi from './createApi';
import { Loader } from '../../components/Loader';
import { MessageTypes } from './constants';
import { UserType, PointType, BoardType } from './types';

const DEFAULT_REQUEST_TIMEOUT = 5000;

const ERROR_MSG_UNAVAILABLE_SERVER = 'Looks like we lost connection to the server, please reload the page';
const ERROR_MSG_TIMEOUT = 'Looks like the server is taking to long to respond, please try again in sometime';

interface ApiProviderProps {
  children: any;
}

const ws = createApi();

const ApiProvider = ({ children }: ApiProviderProps) => {
  const [apiReady, setApiReady] = React.useState(false);
  const [, setRequests] = React.useState([]);

  const addRequestToLog = (request: { id: string; resolver: (p: any) => any }) => {
    setRequests((prev) => [...prev, request]);
  };

  const removeRequestFromLog = (requestId: string) => {
    setRequests((prev) => prev.filter(({ id }) => id !== requestId));
  };

  const sendMessage = React.useCallback(<T extends unknown>(type: MessageTypes, data?: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      const requestId = uuid();

      addRequestToLog({
        id: requestId,
        resolver: resolve,
      });

      ws.send(JSON.stringify({ id: requestId, type, body: data, token: TokenService.token }));

      setTimeout(() => {
        removeRequestFromLog(requestId);
        reject(new Error(ERROR_MSG_TIMEOUT));
      }, DEFAULT_REQUEST_TIMEOUT);
    });
  }, []);

  const handleRegisterUser = React.useCallback(
    (userData: UserType) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return Promise.reject(new Error(ERROR_MSG_UNAVAILABLE_SERVER));
      }

      return sendMessage<UserType>(MessageTypes.USER_REGISTER, userData);
    },
    [sendMessage]
  );

  const handleLoginUser = React.useCallback(
    (userData: UserType) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return Promise.reject(new Error(ERROR_MSG_UNAVAILABLE_SERVER));
      }

      return sendMessage<UserType>(MessageTypes.USER_LOGIN, userData);
    },
    [sendMessage]
  );

  const handleGetUsers = React.useCallback(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error(ERROR_MSG_UNAVAILABLE_SERVER));
    }

    return sendMessage<UserType[]>(MessageTypes.GET_USERS);
  }, [sendMessage]);

  const handleGetUser = React.useCallback(
    (userId: string) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return Promise.reject(new Error(ERROR_MSG_UNAVAILABLE_SERVER));
      }

      return sendMessage<UserType>(MessageTypes.GET_USER, { userId });
    },
    [sendMessage]
  );

  const handleGetCurrentUser = React.useCallback(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error(ERROR_MSG_UNAVAILABLE_SERVER));
    }

    return sendMessage<UserType>(MessageTypes.GET_CURRENT_USER);
  }, [sendMessage]);

  const handleGetUsersQuantity = React.useCallback(
    (boardId: BoardType['id']) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return Promise.reject(new Error(ERROR_MSG_UNAVAILABLE_SERVER));
      }

      return sendMessage<number>(MessageTypes.GET_BOARD_USERS_QUANTITY, { boardId });
    },
    [sendMessage]
  );

  const handleCreateBoard = React.useCallback(
    (data: Pick<BoardType, 'name' | 'size' | 'closedAt' | 'isPublic'>) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return Promise.reject(new Error(ERROR_MSG_UNAVAILABLE_SERVER));
      }

      return sendMessage<BoardType>(MessageTypes.CREATE_BOARD, data);
    },
    [sendMessage]
  );

  const handleGetBoard = React.useCallback(
    (boardId: BoardType['id']) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return Promise.reject(new Error(ERROR_MSG_UNAVAILABLE_SERVER));
      }

      return sendMessage<BoardType>(MessageTypes.GET_BOARD, { boardId });
    },
    [sendMessage]
  );

  const handleGetBoards = React.useCallback(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error(ERROR_MSG_UNAVAILABLE_SERVER));
    }

    return sendMessage<BoardType[]>(MessageTypes.GET_BOARDS);
  }, [sendMessage]);

  const handleEnterBoard = React.useCallback(
    (boardId: BoardType['id']) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return Promise.reject(new Error(ERROR_MSG_UNAVAILABLE_SERVER));
      }

      return sendMessage<number>(MessageTypes.USER_ENTER_BOARD, { boardId });
    },
    [sendMessage]
  );

  const handleLeaveBoard = React.useCallback(
    (boardId: BoardType['id']) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return Promise.reject(new Error(ERROR_MSG_UNAVAILABLE_SERVER));
      }

      return sendMessage<number>(MessageTypes.USER_LEAVE_BOARD, { boardId });
    },
    [sendMessage]
  );

  const handleDrawPoint = React.useCallback(
    (boardId: BoardType['id'], point: PointType) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return Promise.reject(new Error(ERROR_MSG_UNAVAILABLE_SERVER));
      }

      return sendMessage<PointType>(MessageTypes.POINT_DRAW, { boardId, point });
    },
    [sendMessage]
  );

  const processErrorMessage = ({ type, error }) => {
    console.error(new Error(`${type}: ${error.message}`));
  };

  const processUnregisteredMessage = (msg) => {
    switch (msg.type) {
      case MessageTypes.POINT_DRAW:
        (function () {
          const data = msg.body;
          if (data) {
            window.postMessage({ type: MessageTypes.POINT_DRAW, message: data });
          }
        })();
        break;
      case MessageTypes.USER_ENTER_BOARD:
        (function () {
          const data = msg.body;
          if (data) {
            window.postMessage({ type: MessageTypes.USER_ENTER_BOARD, message: data });
          }
        })();
        break;
      case MessageTypes.USER_LEAVE_BOARD:
        (function () {
          const data = msg.body;
          if (data) {
            window.postMessage({ type: MessageTypes.USER_LEAVE_BOARD, message: data });
          }
        })();
        break;
      default:
        console.log('Unknown message type.');
    }
  };

  ws.onopen = (evt) => {
    setApiReady(ws.readyState === WebSocket.OPEN);

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);

      if (msg?.error) {
        processErrorMessage(msg);
      }

      if (msg?.token) {
        TokenService.token = msg.token;
      }

      if (msg?.id) {
        setRequests((requests) => {
          const resolver = requests.find(({ id }) => id === msg.id)?.resolver;

          if (resolver && typeof resolver === 'function') {
            resolver(msg.body);

            return requests.filter(({ id }) => id !== msg.id);
          }

          processUnregisteredMessage(msg);

          return requests;
        });
      } else {
        processUnregisteredMessage(msg);
      }
    };
  };

  return (
    <Context.Provider
      value={{
        ws,
        apiReady,
        registerUser: handleRegisterUser,
        loginUser: handleLoginUser,
        getUsers: handleGetUsers,
        getUser: handleGetUser,
        getCurrentUser: handleGetCurrentUser,
        getBoardUsersQuantity: handleGetUsersQuantity,
        drawPoint: handleDrawPoint,
        createBoard: handleCreateBoard,
        getBoard: handleGetBoard,
        getBoards: handleGetBoards,
        enterBoard: handleEnterBoard,
        leaveBoard: handleLeaveBoard,
      }}>
      {apiReady ? children : <Loader />}
    </Context.Provider>
  );
};

export default ApiProvider;
