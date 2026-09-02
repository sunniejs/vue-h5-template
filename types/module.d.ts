declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const Component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    unknown
  >;
  export default Component;
}

declare module 'virtual:*' {
  const result: unknown;
  export default result;
}
