import { getUserIdFromToken } from "../../helpers/getUserIdFromToken";
import { MessageType, ServerType, OptionsType, WSType } from "../types";
import { EVENTS } from "../constants";
// import logger from "../../lib/logger";

import userRegister from "./userRegister";
import userLogin from "./userLogin";
import getUser from "./getUser";
import getUsersList from "./getUsersList";
import getBoardUsersQuantity from "./getBoardUsersQuantity";
import userDrawPoint from "./userDrawPoint";
import getBoard from "./getBoard";
import getBoards from "./getBoards";
import createBoard from "./createBoard";
import userEnterBoard from "./userEnterBoard";
import userLeaveBoard from "./userLeaveBoard";

export default async function handleWSMessage({
  message,
  server,
  ws,
  options,
}: {
  message: MessageType;
  server: ServerType;
  ws: WSType;
  options: OptionsType;
}) {
  const send = (response: MessageType) => {
    const { recipients = [], ...rest } = response;

    if (recipients?.length) {
      recipients.forEach((userId) => {
        server.publish(`user/id/${userId}`, JSON.stringify(rest));
      });
    } else {
      ws.send(JSON.stringify(rest));
    }
  };

  // const sendToAll = (event: EVENTS, response: MessageType) =>
  //   server.publish(event, JSON.stringify(response));

  const subscribeToPersonalMessage = (userId: string) => {
    if (userId && !ws.isSubscribed(`user/id/${userId}`)) {
      ws.subscribe(`user/id/${userId}`);
    }
  };

  switch (message.type) {
    case EVENTS.USER_REGISTER:
      (async function () {
        const response = await userRegister(message, options);

        const userId = response.body?.id || "";
        subscribeToPersonalMessage(userId);

        return send(response);
      })();
      break;
    case EVENTS.USER_LOGIN:
      (async function () {
        const response = await userLogin(message, options);

        const userId = response.body?.id || "";
        subscribeToPersonalMessage(userId);

        if (!response.body) {
          return send({
            id: message.id,
            type: message.type,
            error: {
              code: 404,
              message: "User with provided credentials does not exist",
            },
          });
        }

        return send(response);
      })();
      break;
    case EVENTS.GET_USERS:
      return send(await getUsersList(message, options));
    case EVENTS.GET_USER:
      return send(await getUser(message, options));
    case EVENTS.GET_CURRENT_USER:
      (async function () {
        const userId = getUserIdFromToken(message.token);

        subscribeToPersonalMessage(userId);

        return send(
          await getUser(
            {
              ...message,
              body: userId,
            },
            options
          )
        );
      })();
      break;
    case EVENTS.GET_BOARD:
      return send(await getBoard(message, options));
    case EVENTS.GET_BOARDS:
      return send(await getBoards(message, options));
    case EVENTS.CREATE_BOARD:
      return send(await createBoard(message, options));
    case EVENTS.USER_ENTER_BOARD:
      return send(await userEnterBoard(message, options));
    case EVENTS.USER_LEAVE_BOARD:
      return send(await userLeaveBoard(message, options));
    case EVENTS.GET_BOARD_USERS_QUANTITY:
      return send(await getBoardUsersQuantity(message, options));
    case EVENTS.POINT_DRAW:
      (async function () {
        const response = await userDrawPoint(message, options);
        send(response);
      })();
      break;
  }
}
