import { MockMethod, Recordable } from 'vite-plugin-mock';

interface response {
  body: Recordable;
  query: Recordable;
}

export default [
  {
    url: '/api/login',
    method: 'post',
    response: ({ body, query }: response) => {
      console.log('body>>>>>>>>', body);
      console.log('query>>>>>>>>', query);
      return {
        code: 200,
        message: 'ok',
        data: { name: 'Evan', age: 26 },
      };
    },
  },
] as MockMethod[];
