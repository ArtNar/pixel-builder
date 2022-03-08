import { EVENTS } from "../constants";
import { MessageType, OptionsType } from "../types";

export default async function createBoard(
  message: MessageType,
  options: OptionsType
) {
  const { boardManager, userManager, db } = options || {};

  const user = await userManager.getUserFromToken(message.token);

  const result = await boardManager.createBoard(
    { ...message.body, userId: user?.id },
    db
  );

  const response = {
    id: message?.id,
    type: EVENTS.CREATE_BOARD,
    body: result,
  };

  return response;
}
