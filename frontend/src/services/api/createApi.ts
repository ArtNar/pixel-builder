const URI = 'ws://127.0.0.1:9001/ws';

let cacheInstance = null;

const createWebsocket = () => {
  try {
    cacheInstance = new WebSocket(URI);
  } catch (error) {
    console.error(error.message);
  }

  return cacheInstance;
};

export default () => cacheInstance || createWebsocket();
