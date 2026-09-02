import 'vue-router';

export {};

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    section?: 'home' | 'shop' | 'examples' | 'ai' | 'member';
    keepAlive?: boolean;
    requiresAuth?: boolean;
    guestOnly?: boolean;
    hideHeader?: boolean;
    hideAiEntry?: boolean;
    fullscreen?: boolean;
  }
}
