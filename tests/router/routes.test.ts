import { describe, expect, it } from 'vitest';
import routes from '@/router/routes';
import type { RouteRecordRaw } from 'vue-router';

function flattenRoutes(routeRecords: RouteRecordRaw[]): RouteRecordRaw[] {
  return routeRecords.flatMap((route) => [
    route,
    ...flattenRoutes(route.children ?? []),
  ]);
}

describe('routes', () => {
  const allRoutes = flattenRoutes(routes);

  it('keeps primary tab routes configured', () => {
    expect(allRoutes.map((route) => route.path)).toEqual(
      expect.arrayContaining([
        '/',
        'home',
        'shop',
        'shop/products/:id',
        'shop/cart',
        'shop/admin/products',
        'examples',
        'examples/query',
        'examples/workspace',
        'examples/mobile',
        'member',
        '/ai/chat',
        '/login',
        '/offline',
      ]),
    );
  });

  it('protects the product management route without protecting the public catalog', () => {
    expect(
      allRoutes.find((route) => route.name === 'shop')?.meta?.requiresAuth,
    ).not.toBe(true);
    expect(
      allRoutes.find((route) => route.name === 'product-admin')?.meta
        ?.requiresAuth,
    ).toBe(true);
  });

  it('redirects unknown history routes to home', () => {
    const fallbackRoute = routes.find(
      (route) => route.path === '/:pathMatch(.*)*',
    );

    expect(fallbackRoute?.redirect).toEqual({ name: 'home' });
  });
});
