import { makeServer } from "./server";
import { ServerType, OptionsType } from "./types";

export default function (
  server: ServerType,
  port: number,
  options: OptionsType
) {
  server.ws("/ws", makeServer(server, options)).listen(port, (token: any) => {
    token
      ? console.log(`Listening to port ${port}`)
      : console.log(`Failed to listen to port ${port}`);
  });
}
