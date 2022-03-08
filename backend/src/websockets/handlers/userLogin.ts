import { EVENTS } from "../constants";
import { MessageType, OptionsType } from "../types";

export default async function userLogin(
  message: MessageType,
  options: OptionsType
) {
  const { userManager, db } = options || {};

  const result = await userManager.login(message.body, db);

  const response = {
    id: message?.id,
    type: EVENTS.USER_LOGIN,
    body: result?.user,
    token: result?.token,
  };

  return response;
}
