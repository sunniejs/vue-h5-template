import { beforeEach, describe, expect, it, vi } from 'vitest';

import { loginPassword } from '@/api/modules/auth';
import { getFeed, getTasks, toggleTask } from '@/api/modules/examples';
import { getUserProfile } from '@/api/modules/user';
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from '@/api/modules/projects';
import { triggerRequestError } from '@/api/modules/requestExamples';
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getProduct,
  getProducts,
  updateProduct,
} from '@/api/modules/products';
import type { ProductInput } from '@/api/modules/products';

const mocks = vi.hoisted(() => ({
  delete: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
}));
vi.mock('@/api/client', () => ({ apiClient: mocks }));

describe('aPI modules', () => {
  beforeEach(() => {
    mocks.get.mockReset();
    mocks.delete.mockReset();
    mocks.patch.mockReset();
    mocks.post.mockReset();
  });

  it('keeps authenticated CRUD inside the projects module', async () => {
    const controller = new AbortController();
    mocks.get.mockResolvedValue({ list: [] });
    mocks.post.mockResolvedValue({ id: 1 });
    mocks.patch.mockResolvedValue({ id: 1, status: 'paused' });
    mocks.delete.mockResolvedValue({ deleted: true, id: 1 });

    await getProjects({ page: 2, pageSize: 10 }, controller.signal);
    await getProject(1, controller.signal);
    await createProject({ name: 'Mobile launch' });
    await updateProject(1, { status: 'paused' });
    await deleteProject(1);

    expect(mocks.get).toHaveBeenNthCalledWith(1, '/projects', {
      params: { page: 2, pageSize: 10 },
      signal: controller.signal,
    });
    expect(mocks.get).toHaveBeenNthCalledWith(2, '/projects/1', {
      signal: controller.signal,
    });
    expect(mocks.post).toHaveBeenCalledWith('/projects', {
      name: 'Mobile launch',
    });
    expect(mocks.patch).toHaveBeenCalledWith('/projects/1', {
      status: 'paused',
    });
    expect(mocks.delete).toHaveBeenCalledWith('/projects/1');
  });

  it('keeps request error examples behind a typed module', async () => {
    mocks.get.mockResolvedValue(null);
    await triggerRequestError('forbidden');
    await triggerRequestError('timeout');
    expect(mocks.get).toHaveBeenNthCalledWith(
      1,
      '/examples/forbidden',
      undefined,
    );
    expect(mocks.get).toHaveBeenNthCalledWith(2, '/examples/timeout', {
      timeout: 100,
    });
  });

  it('keeps paths, bodies and abort signals inside typed modules', async () => {
    mocks.post.mockResolvedValue({ token: 'token' });
    const login = { name: 'Ada', password: 'secret' };
    await loginPassword(login);
    expect(mocks.post).toHaveBeenCalledWith('/auth/login', login);

    const controller = new AbortController();
    mocks.get.mockResolvedValue([]);
    await getTasks(controller.signal);
    await getUserProfile(controller.signal);
    await getFeed(6, 3, controller.signal);
    expect(mocks.get).toHaveBeenNthCalledWith(1, '/examples/tasks', {
      signal: controller.signal,
    });
    expect(mocks.get).toHaveBeenNthCalledWith(2, '/user/profile', {
      signal: controller.signal,
    });
    expect(mocks.get).toHaveBeenNthCalledWith(3, '/examples/feed', {
      params: { cursor: 6, limit: 3 },
      signal: controller.signal,
    });
  });

  it('maps mutations to a resource action', async () => {
    mocks.post.mockResolvedValue({ id: 2, done: true });
    await toggleTask(2);
    expect(mocks.post).toHaveBeenCalledWith('/examples/tasks/2/toggle');
  });

  it('keeps the public catalog and authenticated product CRUD in one typed domain module', async () => {
    const controller = new AbortController();
    const localized = {
      'zh-CN': '测试商品',
      'en-US': 'Test product',
      'ja-JP': 'テスト商品',
    };
    const input: ProductInput = {
      sku: 'TEST-1',
      name: localized,
      subtitle: localized,
      description: localized,
      category: 'digital',
      brand: 'Test',
      coverUrl: '/products/product-placeholder.svg',
      priceCents: 9900,
      originalPriceCents: 12_900,
      stock: 10,
      sales: 0,
      rating: 5,
      status: 'draft',
      featured: false,
    };
    mocks.get.mockResolvedValue({ list: [] });
    mocks.post.mockResolvedValue({ id: 8 });
    mocks.patch.mockResolvedValue({ id: 8 });
    mocks.delete.mockResolvedValue({ deleted: true, id: 8 });

    await getProducts({ page: 2, category: 'digital' }, controller.signal);
    await getProduct(8, controller.signal);
    await getAdminProducts({ status: 'draft' }, controller.signal);
    await createProduct(input);
    await updateProduct(8, { status: 'on_sale' });
    await deleteProduct(8);

    expect(mocks.get).toHaveBeenNthCalledWith(1, '/products', {
      params: { page: 2, category: 'digital' },
      signal: controller.signal,
    });
    expect(mocks.get).toHaveBeenNthCalledWith(2, '/products/8', {
      signal: controller.signal,
    });
    expect(mocks.get).toHaveBeenNthCalledWith(3, '/admin/products', {
      params: { status: 'draft' },
      signal: controller.signal,
    });
    expect(mocks.post).toHaveBeenCalledWith('/admin/products', input);
    expect(mocks.patch).toHaveBeenCalledWith('/admin/products/8', {
      status: 'on_sale',
    });
    expect(mocks.delete).toHaveBeenCalledWith('/admin/products/8');
  });
});
