import type { MockMethod, Recordable } from 'vite-plugin-mock';

interface Response {
  body: Recordable;
  query: Recordable;
}

export default [
  {
    url: '/mock-api/login',
    method: 'post',
    response: ({ body, query }: Response) => {
      console.log('body>>>>>>>>', body);
      console.log('query>>>>>>>>', query);
      return {
        code: 200,
        message: 'ok',
        data: { name: 'Evan', age: 26, token: 'mock-token-123456' },
      };
    },
  },
] as MockMethod[];
