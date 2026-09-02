export {};

declare global {
  /** 通用键值对类型，用于配置对象、环境变量等 */
  export type Recordable<T = unknown> = Record<string, T>;

  /** 构建/开发环境注入的环境变量（经 build/utils.ts 的 wrapperEnv 解析） */
  interface ViteEnv {
    /** 接口请求基础路径（src/utils/request 读取） */
    VITE_API_BASE_URL: string;
    /** AI Streaming API 前缀，可独立代理到 FastAPI 服务 */
    VITE_AI_API_BASE_URL: string;
    VITE_USE_MOCK: boolean;
    VITE_USE_ERUDA: boolean;
    VITE_USE_COMPRESS: boolean;
    VITE_USE_REPORT: boolean;
    VITE_USE_HTTPS: boolean;
    VITE_PWA_ENABLED: boolean;
    /** 仅在生产构建中启用 Sharp/SVGO 图片优化 */
    VITE_IMAGE_OPTIMIZE: boolean;
    /** 为 Axios 请求自动附加 X-Request-ID */
    VITE_REQUEST_ID_ENABLED: boolean;
    /** 当前生产构建唯一启用的移动 UI 框架 */
    VITE_UI_FRAMEWORK: 'vant' | 'nutui' | 'varlet';
    /** 是否移除开发代理路径中的 API 前缀 */
    VITE_API_PROXY_REWRITE?: boolean;
    /** 开发环境真实后端地址；配置后 /api 请求将被代理转发到该地址 */
    VITE_API_TARGET?: string;
    /** 开发环境 AI 服务地址；配置后优先代理 AI 路径 */
    VITE_AI_API_TARGET?: string;
  }

  /**
   * 让 import.meta.env 获得上述变量的类型提示。
   * 这里用 interface 而不是 type，是为了将来引入 vite/client 时能与它的
   * ImportMetaEnv 做声明合并，而不是重复声明。
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ImportMetaEnv extends ViteEnv {}

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
