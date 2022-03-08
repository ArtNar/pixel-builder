import { EVENTS } from "../constants";
import { MessageType, OptionsType } from "../types";

export default async function userRegister(
  message: MessageType,
  options: OptionsType
) {
  const { userManager, db } = options || {};

  const result = await userManager.register(message.body, db);

  const response = {
    id: message?.id,
    type: EVENTS.USER_REGISTER,
    body: result?.user,
    token: result?.token,
  };

  return response;
}
