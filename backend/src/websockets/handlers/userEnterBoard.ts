import { getUserIdFromToken } from "../../helpers/getUserIdFromToken";
import { EVENTS } from "../constants";
import { MessageType, OptionsType } from "../types";

export default async function userEnterBoard(
  message: MessageType,
  options: OptionsType
) {
  const userId = getUserIdFromToken(message.token);

  const { boardManager, db } = options || {};

  const boardUsers = await boardManager.enterBoard(
    { ...message.body, userId },
    db
  );

  const response = {
    id: message?.id,
    type: EVENTS.USER_ENTER_BOARD,
    body: boardUsers.length,
    recipients: boardUsers,
  };

  return response;
}
