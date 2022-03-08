import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import debounce from 'just-debounce-it';
import { HexColorPicker } from 'react-colorful';
import StoreContext from '../../services/store/StoreContext';
import ApiContext from '../../services/api/ApiContext';
import { Timer, TIMER_VARIANTS } from '../Timer';
import { Paper } from '../Paper';
import { Button } from '../Button';
import { Board } from '../Board';
import { Loader } from '../Loader';
import { FormInput } from '../form/FormInput';
import { BoardType } from '../../services/api/types';
import styles from './BoardPage.module.scss';
import { MessageTypes } from '../../services/api/constants';

const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const { userData } = React.useContext(StoreContext);
  const { drawPoint, getBoard, enterBoard, leaveBoard } = React.useContext(ApiContext);

  const [board, setBoard] = React.useState<BoardType>(null);
  const [totalUsers, setTotalUsers] = React.useState(null);
  const [currentColor, setCurrentColor] = React.useState('#fff');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleMessageReceive = React.useCallback((event: MessageEvent) => {
    if (
      (event.data?.type === MessageTypes.USER_ENTER_BOARD || event.data?.type === MessageTypes.USER_LEAVE_BOARD) &&
      typeof event.data.message === 'number'
    ) {
      const usersAtBoard = event.data.message;

      setTotalUsers(usersAtBoard);
    }
  }, []);

  const updatePointOnServer = React.useCallback(
    async (point) => {
      setIsLoading(true);

      const pointDataFromServer = await drawPoint(boardId, point);

      setIsLoading(false);

      if (pointDataFromServer) {
        window.postMessage({ type: MessageTypes.POINT_DRAW, message: pointDataFromServer });
      }
    },
    [drawPoint, boardId]
  );

  const handleSetColorDebounced = debounce((value) => setCurrentColor(value), 200);

  const handleChangeColor = React.useCallback(handleSetColorDebounced, [handleSetColorDebounced]);

  const handleClickGoToBoardsList = React.useCallback(() => {
    navigate(`/`);
  }, [navigate]);

  React.useEffect(() => {
    const run = async () => {
      const response = await enterBoard(boardId);

      setTotalUsers(response);
    };

    if (enterBoard) {
      run();
    }

    return () => {
      const run = async () => {
        await leaveBoard(boardId);
      };

      if (leaveBoard) {
        run();
      }
    };
  }, [enterBoard, leaveBoard, boardId]);

  React.useEffect(() => {
    if (!getBoard || !boardId) {
      return;
    }

    const run = async () => {
      const response = await getBoard(boardId);

      setBoard(response);
    };

    run();
  }, [getBoard, boardId]);

  React.useEffect(() => {
    window.addEventListener('message', handleMessageReceive);

    return () => {
      window.removeEventListener('message', handleMessageReceive);
    };
  }, [handleMessageReceive]);

  return (
    <div className={styles.root}>
      {isLoading && <Loader className={styles.loader} />}
      <Board board={board} currentColor={currentColor} updatePointOnServer={updatePointOnServer} />
      <Paper className={styles.sideMenu}>
        <Timer className={styles.timer} variant={TIMER_VARIANTS.small} dateFinish={board?.closedAt} />
        {userData && (
          <div className={styles.userData}>
            <div className={styles.userDataTitle}>Current user:</div>
            <div className={styles.userDataItem}>{userData.name}</div>
          </div>
        )}
        {!!totalUsers && (
          <div className={styles.usersData}>
            <div className={styles.usersDataTitle}>Total users:</div>
            <div className={styles.usersDataItem}>{totalUsers}</div>
          </div>
        )}
        <div className={styles.colorPicker}>
          <HexColorPicker color={currentColor} onChange={handleChangeColor} />
          <FormInput
            className={styles.colorInput}
            value={currentColor}
            onChange={handleChangeColor}
            placeholder="HEX"
          />
        </div>
        <Button onClick={handleClickGoToBoardsList}>To boards</Button>
      </Paper>
    </div>
  );
};

export default BoardPage;
