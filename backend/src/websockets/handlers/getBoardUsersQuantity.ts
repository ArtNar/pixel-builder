import { EVENTS } from "../constants";
import { MessageType, OptionsType } from "../types";

export default async function getBoardUsersQuantity(
  message: MessageType,
  options: OptionsType
) {
  const { boardManager } = options || {};

  const users = await boardManager.getBoardUsers(message.body);

  const response = {
    id: message?.id,
    type: EVENTS.GET_BOARD_USERS_QUANTITY,
    body: users.length,
  };

  return response;
}
