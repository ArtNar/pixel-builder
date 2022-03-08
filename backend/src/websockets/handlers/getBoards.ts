import { EVENTS } from "../constants";
import { MessageType, OptionsType } from "../types";

export default async function getBoards(
  message: MessageType,
  options: OptionsType
) {
  const { boardManager, userManager, db } = options || {};

  const user = await userManager.getUserFromToken(message.token);

  const result = await boardManager.getBoards(
    { ...message.body, userId: user?.id },
    db
  );

  const response = {
    id: message?.id,
    type: EVENTS.GET_BOARDS,
    body: result,
  };

  return response;
}
