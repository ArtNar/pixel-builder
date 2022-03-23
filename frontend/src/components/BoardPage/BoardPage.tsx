import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import debounce from 'just-debounce-it';
import { HexColorPicker } from 'react-colorful';
import { Statistic } from 'antd';
import moment from 'moment';
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

const { Countdown } = Statistic;

const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const boardRef = React.useRef(null);

  const { userData } = React.useContext(StoreContext);
  const { drawPoint, getBoard, enterBoard, leaveBoard } = React.useContext(ApiContext);

  const [board, setBoard] = React.useState<BoardType>(null);
  const [boardIndent, setBoardIndent] = React.useState<number>();
  const [totalUsers, setTotalUsers] = React.useState(null);
  const [currentColor, setCurrentColor] = React.useState('#fff');
  const [isLoading, setIsLoading] = React.useState(false);

  const boardDisabled = React.useMemo(() => {
    const closedDate = board?.closedAt;

    if (!closedDate) {
      return false;
    }

    const dateStart = moment(new Date());
    const dateFinish = moment(board.closedAt);

    return dateFinish <= dateStart;
  }, [board?.closedAt]);

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

  const handleClickSaveImage = React.useCallback(() => {
    setBoardIndent(0);

    setTimeout(() => {
      const dataURL = boardRef.current.toDataURL('image/jpeg', 1.0);

      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'canvas.jpeg';
      document.body.appendChild(a);
      a.click();
      setBoardIndent(2);
    }, 1000);
  }, []);

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
      setIsLoading(true);

      const response = await getBoard(boardId);

      setBoard(response);

      setIsLoading(false);
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
      <Board
        boardRef={boardRef}
        board={board}
        indent={boardIndent}
        currentColor={currentColor}
        updatePointOnServer={updatePointOnServer}
        setIsLoading={setIsLoading}
        disabled={boardDisabled}
      />
      <div className={styles.sideMenuWrapper}>
        <Button className={styles.backButton} onClick={handleClickGoToBoardsList}>
          Back to boards
        </Button>
        <Paper className={styles.sideMenu}>
          {board?.closedAt ? <Countdown className={styles.deadline} value={board.closedAt} /> : null}
          {userData && (
            <div className={styles.userData}>
              <div className={styles.userDataTitle}>Current user:</div>
              <div className={styles.userDataItem}>{userData.name}</div>
            </div>
          )}
          {!!totalUsers && (
            <div className={styles.usersData}>
              <div className={styles.usersDataTitle}>Online users:</div>
              <div className={styles.usersDataItem}>{totalUsers}</div>
            </div>
          )}
          {!boardDisabled && (
            <div className={styles.colorPicker}>
              <HexColorPicker color={currentColor} onChange={handleChangeColor} />
              <FormInput
                className={styles.colorInput}
                value={currentColor}
                onChange={handleChangeColor}
                placeholder="HEX"
              />
            </div>
          )}
        </Paper>
        <Button className={styles.saveButton} onClick={handleClickSaveImage}>
          Save image
        </Button>
      </div>
    </div>
  );
};

export default BoardPage;
