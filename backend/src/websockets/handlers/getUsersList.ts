import { EVENTS } from "../constants";
import { MessageType, OptionsType } from "../types";

export default async function getUserList(
  message: MessageType,
  options: OptionsType
) {
  const { userManager, db } = options || {};

  const result = await userManager.getUsers(db);

  const response = {
    id: message?.id,
    type: EVENTS.GET_USERS,
    body: result,
  };

  return response;
}
