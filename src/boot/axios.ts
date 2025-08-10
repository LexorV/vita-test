import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// Base URLs are proxied via devServer proxy in quasar.config.ts
// - Auth:   '/auth' → https://91.220.155.234:8080/FrontTestingService-auth
// - Backend '/api'  → http://91.220.155.234:8080/FrontTestingService-back
const api = axios.create({ baseURL: '/api' });
axios.defaults.withCredentials = true;
api.defaults.withCredentials = true;

// Perform login on app start using LOGIN and PASSOWRD from environment
async function performInitialLogin(): Promise<void> {
  const username = (process.env.LOGIN as string) || '';
  const password = (process.env.PASSWORD as string) || '';
  if (!username || !password) return;
  try {
    await axios.post(`/auth/login`, null, {
      params: {
        username,
        password,
      },
      withCredentials: true,
    });
  } catch {
    console.log('Auth login failed');
    // swallow error to not block app boot; real app should handle/notify
    // console.error('Auth login failed', err);
  }
}

export default defineBoot(async ({ app }) => {
  await performInitialLogin();
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
