import React from 'react';
import { useNavigate } from 'react-router-dom';
import Statistic from 'antd/lib/statistic/Statistic';
import List from 'antd/lib/list';
import Skeleton from 'antd/lib/skeleton/Skeleton';
import ApiContext from '../../services/api/ApiContext';
import { Paper } from '../Paper';
import { Button } from '../Button';
import { Loader } from '../Loader';
import { useModal } from '../Modal';
import styles from './BoardsPage.module.scss';
import { BoardType } from '../../services/api/types';

const { Countdown } = Statistic;

const modalKey = 'createBoardModal';
const getModalComponent = () => import('../modals/CreateNewBoard/CreateNewBoard');

const BoardsPage = () => {
  const navigate = useNavigate();
  const { getBoards } = React.useContext(ApiContext);

  const [openModal] = useModal(modalKey);

  const [boards, setBoards] = React.useState<BoardType[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchBoards = React.useCallback(async () => {
    setIsLoading(true);
    const response = await getBoards();

    setBoards(response);
    setIsLoading(false);
  }, [getBoards]);

  const handleOpenModalCreateBoard = React.useCallback(() => {
    openModal(getModalComponent, {
      onClose: fetchBoards,
    });
  }, [openModal, fetchBoards]);

  const handleItemClick = React.useCallback(
    (id) => () => {
      navigate(`/board/${id}`);
    },
    [navigate]
  );

  React.useEffect(() => {
    if (!fetchBoards) {
      return;
    }

    fetchBoards();
  }, [fetchBoards]);

  return (
    <div className={styles.root}>
      {isLoading && <Loader className={styles.loader} />}
      {!isLoading && (
        <div className={styles.wrapper}>
          <Button className={styles.createBoardButton} onClick={handleOpenModalCreateBoard}>
            Create board
          </Button>
          <Paper className={styles.container}>
            <List
              className="demo-loadmore-list"
              // loading={initLoading}
              itemLayout="horizontal"
              // loadMore={loadMore}
              dataSource={boards}
              renderItem={(item) => (
                <List.Item actions={[<Button onClick={handleItemClick(item.id)}>open</Button>]}>
                  <Skeleton title={false} loading={isLoading} active>
                    <List.Item.Meta className={styles.item} title={item.name} description="" />
                    {item.isPublic ? <span className={styles.public}>public</span> : ''}
                    {item.closedAt ? <Countdown className={styles.deadline} value={item.closedAt} /> : null}
                  </Skeleton>
                </List.Item>
              )}
            />
          </Paper>
        </div>
      )}
    </div>
  );
};

export default BoardsPage;
