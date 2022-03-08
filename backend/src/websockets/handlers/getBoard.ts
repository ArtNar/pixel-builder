import { EVENTS } from "../constants";
import { MessageType, OptionsType } from "../types";

export default async function getBoard(
  message: MessageType,
  options: OptionsType
) {
  const { boardManager, db } = options || {};

  const result = await boardManager.getBoard(message.body, db);

  const response = {
    id: message?.id,
    type: EVENTS.GET_BOARD,
    body: result,
  };

  return response;
}
