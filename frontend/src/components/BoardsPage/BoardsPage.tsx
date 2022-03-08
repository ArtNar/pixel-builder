import React from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Skeleton } from 'antd';
import ApiContext from '../../services/api/ApiContext';
import { Paper } from '../Paper';
import { Button } from '../Button';
import { Loader } from '../Loader';
import { useModal } from '../Modal';
import styles from './BoardsPage.module.scss';

const modalKey = 'createBoardModal';
const getModalComponent = () => import('../modals/CreateNewBoard/CreateNewBoard');

const BoardsPage = () => {
  const navigate = useNavigate();
  const { getBoards } = React.useContext(ApiContext);

  const [openModal] = useModal(modalKey);

  const [boards, setBoards] = React.useState([]);
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
        <Paper className={styles.container}>
          <Button onClick={handleOpenModalCreateBoard}>Create board</Button>
          <List
            className="demo-loadmore-list"
            // loading={initLoading}
            itemLayout="horizontal"
            // loadMore={loadMore}
            dataSource={boards}
            renderItem={(item) => (
              <List.Item actions={[<Button onClick={handleItemClick(item.id)}>open</Button>]}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta className={styles.item} title={item.name} description="" />
                </Skeleton>
              </List.Item>
            )}
          />
        </Paper>
      )}
    </div>
  );
};

export default BoardsPage;
