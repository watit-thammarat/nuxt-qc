import Cookie from 'js-cookie';
import cookieParser from 'cookieparser';

import { TOKEN } from '../constants/auth';

export const setToken = token => {
  Cookie.set(TOKEN, token);
};

export const getToken = cookie => {
  if (!cookie) {
    return;
  }
  const { token } = cookieParser.parse(cookie);
  return token;
};

export const removeToken = () => {
  Cookie.remove(TOKEN);
};
