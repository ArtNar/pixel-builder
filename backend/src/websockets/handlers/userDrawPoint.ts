import { EVENTS } from "../constants";
import { MessageType, OptionsType } from "../types";

export default async function userDrawPoint(
  message: MessageType,
  options: OptionsType
) {
  const { boardManager, db } = options || {};

  const point = await boardManager.drawPoint(message.body, db);
  const boardUsers = await boardManager.getBoardUsers(message.body);

  const response = {
    id: message?.id,
    type: EVENTS.POINT_DRAW,
    body: point,
    recipients: boardUsers,
  };

  return response;
}
