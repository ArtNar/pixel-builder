const URI = process.env.API_URI || 'ws://localhost:9001/ws';

let cacheInstance = null;

const createWebsocket = () => {
  try {
    cacheInstance = new WebSocket(URI);
  } catch (error) {
    console.error(error.message);
  }

  return cacheInstance;
};

export default () => {
  if (cacheInstance && cacheInstance.readyState) {
    return cacheInstance;
  }

  return createWebsocket();
};
