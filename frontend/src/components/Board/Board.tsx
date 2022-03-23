import React from 'react';
import cn from 'classnames';
import { BoardProps } from './types';
import { MessageTypes } from '../../services/api/constants';
import styles from './Board.module.scss';

const POINT_DRAW_STEP = 4;
const POINT_RADIUS = 30;
const DEFAULT_INDENT = 2;
const pointRectSideSize = POINT_RADIUS * 2;

const Board: React.FC<BoardProps> = React.memo(
  ({ boardRef, board, currentColor, updatePointOnServer, setIsLoading, indent = DEFAULT_INDENT, disabled }) => {
    const positionRef = React.useRef({
      scale: 0.4,
      tx: 0,
      ty: 0,
    });
    const pointsRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const boardLastUpdateStartTime = React.useRef(null);

    const [initialized, setInitialized] = React.useState(false);

    const drawPoint = (currentPoint, row, column, indent) => {
      const canvas = boardRef.current;
      const context = canvas?.getContext('2d');

      if (!context) {
        return;
      }

      const point = new Path2D();

      context.clearRect(
        column * pointRectSideSize,
        row * pointRectSideSize,
        pointRectSideSize - indent,
        pointRectSideSize - indent
      );

      if (currentPoint?.active) {
        point.rect(
          column * pointRectSideSize,
          row * pointRectSideSize,
          pointRectSideSize - indent,
          pointRectSideSize - indent
        );
        context.fillStyle = currentPoint.color;
      } else {
        point.rect(
          column * pointRectSideSize,
          row * pointRectSideSize,
          pointRectSideSize - indent,
          pointRectSideSize - indent
        );
        context.fillStyle = '#fff';
        // point.arc(
        //   column * pointRectSideSize + POINT_RADIUS,
        //   row * pointRectSideSize + POINT_RADIUS,
        //   POINT_RADIUS / 2 + POINT_RADIUS / 10,
        //   0,
        //   Math.PI * 2
        // );
        // context.fillStyle = `rgba(255, 255, 255, 0.71)`;
      }

      context.fill(point);
    };

    const handleMessageReceive = React.useCallback(
      (event: MessageEvent) => {
        if (event.data?.type === MessageTypes.POINT_DRAW && event.data.message) {
          const point = event.data.message;
          const pointsCountAtBoardSide = Math.ceil(Math.sqrt(pointsRef.current.length));

          const row = Math.floor(point.id / pointsCountAtBoardSide);
          const column = point.id % pointsCountAtBoardSide;

          drawPoint(point, row, column, indent);
        }
      },
      [indent]
    );

    const handleClickOnBoard = React.useCallback(
      (clickEvent = null) => {
        const points = pointsRef.current;
        if (!boardRef.current || !points?.length) {
          return;
        }

        const row = Math.floor(clickEvent.offsetY / pointRectSideSize);
        const column = Math.floor(clickEvent.offsetX / pointRectSideSize);

        const pointsCountAtBoardSide = Math.ceil(Math.sqrt(points.length));
        const pointIdx = row * pointsCountAtBoardSide + column;
        const currentPoint = points[pointIdx];

        if (clickEvent && currentPoint) {
          pointsRef.current[pointIdx] = {
            ...currentPoint,
            active: !currentPoint.active,
            color: !currentPoint.active ? currentColor : 'transparent',
          };

          updatePointOnServer(points[pointIdx]);
        }
      },
      [updatePointOnServer, currentColor]
    );

    const drawBoardCompletely = React.useCallback((indent) => {
      if (!boardRef.current || !pointsRef.current.length) {
        return;
      }
      console.log('drawBoardCompletely');
      setIsLoading(true);

      boardLastUpdateStartTime.current = Date.now();
      const currentBoardUpdateStartTime = boardLastUpdateStartTime.current;

      const canvas = boardRef.current;
      const context = canvas?.getContext('2d');

      if (!context) {
        return;
      }

      const pointsCountAtBoardSide = Math.ceil(Math.sqrt(pointsRef.current.length));

      let i = 0;

      const redrawAllPoints = () => {
        if (i < pointsCountAtBoardSide - POINT_DRAW_STEP) {
          setTimeout(redrawAllPoints);
        } else {
          setTimeout(() => {
            boardLastUpdateStartTime.current = null;
            setInitialized(true);
            setIsLoading(false);
          });
        }

        for (; i < pointsCountAtBoardSide; i++) {
          context.clearRect(0, i * pointRectSideSize, canvas.width, pointRectSideSize);

          if (boardLastUpdateStartTime.current !== currentBoardUpdateStartTime) {
            break;
          }

          for (let j = 0; j < pointsCountAtBoardSide; j++) {
            const currentPoint = pointsRef.current[i * pointsCountAtBoardSide + j];

            drawPoint(currentPoint, i, j, indent);
          }

          if (i > 0 && i % POINT_DRAW_STEP === 0) {
            i++;
            break;
          }
        }
      };

      requestAnimationFrame(() => {
        redrawAllPoints();
      });
    }, []);

    const applyBoardStyles = React.useCallback(() => {
      requestAnimationFrame(() => {
        const state = positionRef.current;

        const transform = `translate(${state.tx}px, ${state.ty}px) scale(${state.scale})`;
        boardRef.current.style.webkitTransform = transform;
        boardRef.current.style.transform = transform;
      });
    }, []);

    const initializeCanvas = React.useCallback(
      (totalPointsCount: number) => {
        if (!boardRef.current || !totalPointsCount) {
          return;
        }

        setIsLoading(true);

        requestAnimationFrame(() => {
          const canvas = boardRef.current;
          const pointsCountAtBoardSide = Math.ceil(Math.sqrt(totalPointsCount));

          const boardHeight = pointRectSideSize * pointsCountAtBoardSide;
          const boardWidth = pointRectSideSize * pointsCountAtBoardSide;

          const state = positionRef.current;
          state.tx += 0;
          state.ty += 0;
          state.tx += window.innerWidth / 2 - boardWidth / 2;
          state.ty += window.innerHeight / 2 - boardHeight / 2;

          applyBoardStyles();

          const context = canvas.getContext('2d');
          context.canvas.height = boardHeight;
          context.canvas.width = boardWidth;

          setIsLoading(false);
        });
      },
      [applyBoardStyles]
    );

    const handleWheel = React.useCallback(
      (e) => {
        e.preventDefault();

        const state = positionRef.current;

        if (e.ctrlKey) {
          const s = Math.exp(-e.deltaY / 100);
          state.scale *= s;
        } else {
          const direction = -1;
          state.tx += e.deltaX * direction;
          state.ty += e.deltaY * direction;
        }

        applyBoardStyles();
      },
      [applyBoardStyles]
    );

    React.useEffect(() => {
      const containerNode = containerRef.current;
      containerNode.addEventListener('wheel', handleWheel, { passive: false });

      const boardNode = boardRef.current;
      if (!disabled) {
        boardNode.addEventListener('mousedown', handleClickOnBoard);
      }
      window.addEventListener('message', handleMessageReceive);

      return () => {
        containerNode.removeEventListener('wheel', handleWheel, { passive: false });
        boardNode.removeEventListener('mousedown', handleClickOnBoard);
        window.removeEventListener('message', handleMessageReceive);
      };
    }, [disabled, handleClickOnBoard, handleWheel, handleMessageReceive]);

    React.useEffect(() => {
      if (!initialized) {
        pointsRef.current = board?.points || [];
        initializeCanvas(pointsRef.current.length);
        drawBoardCompletely(indent);
      }
    }, [initialized, board, initializeCanvas, drawBoardCompletely, indent]);

    React.useEffect(() => {
      drawBoardCompletely(indent);
    }, [indent]);

    return (
      <div ref={containerRef} className={styles.container}>
        <canvas
          className={cn(styles.board, { [styles.visible]: initialized, [styles.disabled]: disabled })}
          ref={boardRef}
        />
      </div>
    );
  }
);

export default Board;
