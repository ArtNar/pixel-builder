const TOKEN_KEY = 'userToken';

class TokenService {
  storage = localStorage;

  get token() {
    return this.storage.getItem(TOKEN_KEY);
  }

  set token(token: string) {
    if (!token) {
      return;
    }

    this.storage.setItem(TOKEN_KEY, token);
  }
}

let cacheInstance = null;

const createTokenService = () => {
  try {
    cacheInstance = new TokenService();
  } catch (error) {
    console.error(error.message);
  }

  return cacheInstance;
};

export default cacheInstance || createTokenService();
