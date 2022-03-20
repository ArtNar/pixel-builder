const URI = 'ws://44.200.251.143:9001/ws';

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
