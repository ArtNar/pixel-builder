import { EVENTS } from "../constants";
import { MessageType, OptionsType } from "../types";

export default async function getUser(
  message: MessageType,
  options: OptionsType
) {
  const { userManager, db } = options || {};

  const result = await userManager.getUser(message.body, db);

  const response = {
    id: message?.id,
    type: EVENTS.GET_USER,
    body: result,
  };

  return response;
}
