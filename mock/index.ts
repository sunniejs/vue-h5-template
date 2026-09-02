import type { MockMethod } from 'vite-plugin-mock';
import type { Product, ProductInput } from '../src/api/modules/products';
import type {
  Project,
  ProjectInput,
  ProjectUpdateInput,
} from '../src/api/modules/projects';

interface MockContext {
  body: Record<string, unknown>;
  query: Record<string, string>;
  headers: Record<string, string>;
  url: string;
}

const tasks = [
  { id: 1, title: 'Review mobile checkout flow', done: true },
  { id: 2, title: 'Connect the generated API types', done: false },
  { id: 3, title: 'Test the offline experience', done: false },
];
let currentUserName = 'Demo User';

const localized = (zh: string, en: string, ja: string) => ({
  'zh-CN': zh,
  'en-US': en,
  'ja-JP': ja,
});
const now = new Date().toISOString();
let nextProductId = 13;
let nextProjectId = 4;
let projects: Project[] = [
  {
    id: 1,
    ownerId: 1,
    name: '移动商城首发',
    description: '完成商品目录、购物车与结算前流程。',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    ownerId: 1,
    name: 'AI 客服接入',
    description: '验证 SSE 流式响应和中止能力。',
    status: 'paused',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    ownerId: 1,
    name: 'H5 性能基线',
    description: '记录核心路由包体与移动端体验指标。',
    status: 'archived',
    createdAt: now,
    updatedAt: now,
  },
];
let products: Product[] = [
  {
    id: 1,
    sku: 'AURORA-01',
    name: localized(
      'Aurora 降噪耳机',
      'Aurora Noise-Cancelling Headphones',
      'Aurora ノイズキャンセリングヘッドホン',
    ),
    subtitle: localized(
      '沉浸声音，也听见生活',
      'Immersive sound with awareness when you need it',
      '没入感のある音と、必要なときの外音取り込み',
    ),
    description: localized(
      '轻量头戴设计，支持主动降噪、通透模式与长续航。',
      'A lightweight over-ear design with active noise cancellation, transparency mode, and all-day battery life.',
      '軽量なオーバーイヤー設計。アクティブノイズキャンセリング、外音取り込み、長時間再生に対応します。',
    ),
    category: 'digital',
    brand: 'Aurora',
    coverUrl: '/products/aurora-headphones.svg',
    priceCents: 129_900,
    originalPriceCents: 159_900,
    stock: 86,
    sales: 1280,
    rating: 4.8,
    status: 'on_sale',
    featured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    sku: 'MORI-COFFEE-02',
    name: localized(
      'Mori 手冲咖啡礼盒',
      'Mori Pour-over Coffee Set',
      'Mori ハンドドリップコーヒーセット',
    ),
    subtitle: localized(
      '把清晨交给一杯好咖啡',
      'A calmer morning, one cup at a time',
      '一杯のコーヒーから、穏やかな朝を',
    ),
    description: localized(
      '包含精选咖啡豆、滤杯与分享壶，适合居家和办公室。',
      'A curated coffee, dripper, and sharing server set for home or office.',
      '厳選豆、ドリッパー、サーバーを揃えた、自宅やオフィス向けのセットです。',
    ),
    category: 'lifestyle',
    brand: 'Mori',
    coverUrl: '/products/mori-coffee.svg',
    priceCents: 26_900,
    originalPriceCents: 32_900,
    stock: 42,
    sales: 694,
    rating: 4.7,
    status: 'on_sale',
    featured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    sku: 'NOVA-LAMP-03',
    name: localized(
      'Nova 氛围台灯',
      'Nova Ambient Desk Lamp',
      'Nova アンビエントデスクライト',
    ),
    subtitle: localized(
      '工作专注，夜晚柔和',
      'Focused by day and gentle at night',
      '昼は集中、夜はやさしい光',
    ),
    description: localized(
      '无级调光与三档色温，简洁灯体适合床头或书桌。',
      'Stepless dimming and three color temperatures in a compact bedside or desk design.',
      '無段階調光と3段階の色温に対応した、ベッドサイドやデスク向けのコンパクトなライトです。',
    ),
    category: 'home',
    brand: 'Nova',
    coverUrl: '/products/nova-lamp.svg',
    priceCents: 39_900,
    originalPriceCents: 45_900,
    stock: 18,
    sales: 438,
    rating: 4.6,
    status: 'on_sale',
    featured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    sku: 'TRAIL-PACK-04',
    name: localized(
      'Trail 城市轻量背包',
      'Trail Lightweight City Backpack',
      'Trail 軽量シティバックパック',
    ),
    subtitle: localized(
      '通勤与周末，一包装下',
      'One pack for commutes and weekends',
      '通勤も週末も、これ一つで',
    ),
    description: localized(
      '防泼水面料、独立电脑仓与透气背板，容量适合一日出行。',
      'Water-resistant fabric, a dedicated laptop sleeve, and a breathable back panel for day trips.',
      '撥水生地、独立PCスリーブ、通気性の高い背面を備えたデイパックです。',
    ),
    category: 'outdoor',
    brand: 'Trail',
    coverUrl: '/products/trail-backpack.svg',
    priceCents: 55_900,
    originalPriceCents: 69_900,
    stock: 31,
    sales: 820,
    rating: 4.9,
    status: 'on_sale',
    featured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    sku: 'LUMI-CHARGER-05',
    name: localized(
      'Lumi 三合一磁吸充电座',
      'Lumi 3-in-1 Magnetic Charger',
      'Lumi 3-in-1 マグネット充電スタンド',
    ),
    subtitle: localized(
      '一处收纳，整夜满电',
      'One place for an overnight charge',
      '一か所ですっきり、朝にはフル充電',
    ),
    description: localized(
      '同时为手机、耳机与手表充电，折叠结构方便差旅携带。',
      'Charges a phone, earbuds, and watch together in a foldable travel-ready body.',
      'スマートフォン、イヤホン、ウォッチを同時充電。折りたたんで旅行にも持ち運べます。',
    ),
    category: 'digital',
    brand: 'Lumi',
    coverUrl: '/products/product-placeholder.svg',
    priceCents: 42_900,
    originalPriceCents: 49_900,
    stock: 75,
    sales: 1034,
    rating: 4.7,
    status: 'on_sale',
    featured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 6,
    sku: 'KINTO-BOTTLE-06',
    name: localized(
      'Kinto 随行保温杯',
      'Kinto Travel Tumbler',
      'Kinto トラベルタンブラー',
    ),
    subtitle: localized(
      '轻量防漏，冷热皆宜',
      'Lightweight, leakproof, hot or cold',
      '軽量で漏れにくく、温冷どちらにも',
    ),
    description: localized(
      '磨砂杯身与可拆洗杯盖，适合通勤和户外使用。',
      'A matte body and washable lid made for commutes and weekends outside.',
      'マットな本体と洗いやすい蓋で、通勤にもアウトドアにも最適です。',
    ),
    category: 'lifestyle',
    brand: 'Kinto',
    coverUrl: '/products/mori-coffee.svg',
    priceCents: 23_900,
    originalPriceCents: 26_900,
    stock: 144,
    sales: 1865,
    rating: 4.8,
    status: 'on_sale',
    featured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 7,
    sku: 'PICO-SPEAKER-07',
    name: localized(
      'Pico 便携蓝牙音箱',
      'Pico Portable Speaker',
      'Pico ポータブルスピーカー',
    ),
    subtitle: localized(
      '小体积，也有完整声场',
      'Compact body, room-filling sound',
      '小さなボディで、部屋いっぱいの音',
    ),
    description: localized(
      'IP67 防水、12 小时续航，并支持双音箱立体声配对。',
      'IP67 water resistance, 12-hour battery, and stereo pairing.',
      'IP67防水、12時間再生、2台でのステレオペアリングに対応します。',
    ),
    category: 'digital',
    brand: 'Pico',
    coverUrl: '/products/aurora-headphones.svg',
    priceCents: 31_900,
    originalPriceCents: 36_900,
    stock: 63,
    sales: 748,
    rating: 4.6,
    status: 'on_sale',
    featured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 8,
    sku: 'NEST-THROW-08',
    name: localized(
      'Nest 羊毛混纺盖毯',
      'Nest Wool-blend Throw',
      'Nest ウールブレンドブランケット',
    ),
    subtitle: localized(
      '柔软亲肤，四季可用',
      'Soft comfort for every season',
      'やさしい肌触りで、四季を通して',
    ),
    description: localized(
      '细密织法与低饱和配色，可用于沙发、床尾或阅读角。',
      'A finely woven, muted throw for sofas, beds, and reading corners.',
      '繊細な織りと落ち着いた色合いで、ソファやベッド、読書スペースに。',
    ),
    category: 'home',
    brand: 'Nest',
    coverUrl: '/products/nova-lamp.svg',
    priceCents: 48_900,
    originalPriceCents: 56_900,
    stock: 27,
    sales: 392,
    rating: 4.7,
    status: 'on_sale',
    featured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 9,
    sku: 'FIELD-CHAIR-09',
    name: localized(
      'Field 折叠露营椅',
      'Field Folding Camp Chair',
      'Field 折りたたみキャンプチェア',
    ),
    subtitle: localized(
      '快速收纳，稳固承托',
      'Quick setup with dependable support',
      'すぐに広げて、しっかり支える',
    ),
    description: localized(
      '铝合金支架与耐磨座布，收纳后可放进汽车后备箱。',
      'An aluminum frame and durable seat that packs neatly into the car.',
      'アルミフレームと丈夫なシート。収納すれば車にもすっきり収まります。',
    ),
    category: 'outdoor',
    brand: 'Field',
    coverUrl: '/products/trail-backpack.svg',
    priceCents: 36_900,
    originalPriceCents: 42_900,
    stock: 48,
    sales: 516,
    rating: 4.6,
    status: 'on_sale',
    featured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 10,
    sku: 'MORI-TEA-10',
    name: localized(
      'Mori 冷泡茶组合',
      'Mori Cold Brew Tea Set',
      'Mori 水出しティーセット',
    ),
    subtitle: localized(
      '六种风味，清爽一整天',
      'Six refreshing blends for the day',
      '6つの味わいで、一日を爽やかに',
    ),
    description: localized(
      '独立茶包与耐热冷泡壶，适合办公室和居家饮用。',
      'Individual tea bags and a heat-safe pitcher for home or office.',
      '個包装のティーバッグと耐熱ピッチャーで、自宅やオフィスに。',
    ),
    category: 'lifestyle',
    brand: 'Mori',
    coverUrl: '/products/mori-coffee.svg',
    priceCents: 18_900,
    originalPriceCents: 21_900,
    stock: 98,
    sales: 1108,
    rating: 4.8,
    status: 'on_sale',
    featured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 11,
    sku: 'NOVA-CLOCK-11',
    name: localized(
      'Nova 极简床头钟',
      'Nova Minimal Bedside Clock',
      'Nova ミニマルベッドサイドクロック',
    ),
    subtitle: localized(
      '自动调光，不打扰睡眠',
      'Automatic dimming for calmer sleep',
      '自動調光で、眠りを妨げない',
    ),
    description: localized(
      '环境光感应、双闹钟与静音按键，夜间读数清晰。',
      'Ambient sensing, dual alarms, and quiet controls with a clear night display.',
      '環境光センサー、デュアルアラーム、静音ボタンを備え、夜も見やすい表示です。',
    ),
    category: 'home',
    brand: 'Nova',
    coverUrl: '/products/nova-lamp.svg',
    priceCents: 21_900,
    originalPriceCents: 25_900,
    stock: 55,
    sales: 667,
    rating: 4.5,
    status: 'on_sale',
    featured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 12,
    sku: 'TRAIL-POUCH-12',
    name: localized(
      'Trail 防水收纳包',
      'Trail Waterproof Organizer',
      'Trail 防水オーガナイザー',
    ),
    subtitle: localized(
      '分区清晰，旅行更轻松',
      'Clear organization for easier travel',
      '仕分けしやすく、旅をもっと軽快に',
    ),
    description: localized(
      '防泼水拉链与可视网袋，适合收纳线材、洗漱或户外小物。',
      'Water-resistant zips and mesh dividers for cables, toiletries, and trail essentials.',
      '撥水ファスナーとメッシュ仕切りで、ケーブルや洗面用品、小物を整理できます。',
    ),
    category: 'outdoor',
    brand: 'Trail',
    coverUrl: '/products/trail-backpack.svg',
    priceCents: 15_900,
    originalPriceCents: 18_900,
    stock: 132,
    sales: 975,
    rating: 4.7,
    status: 'on_sale',
    featured: false,
    createdAt: now,
    updatedAt: now,
  },
];

const feed = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  title:
    [
      'Mobile performance budget',
      'Streaming UI patterns',
      'Type-safe request layers',
    ][index % 3] ?? 'Vue H5 practice',
  summary: `A practical note for production mobile H5 teams · #${index + 1}`,
  category: ['Performance', 'AI', 'Architecture'][index % 3] ?? 'Vue',
}));

function success<T>(data: T, requestId?: string) {
  return { code: 200, msg: 'ok', data, requestId };
}

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body, headers }: MockContext) => {
      const name =
        typeof body.name === 'string' && body.name.trim()
          ? body.name.trim()
          : 'Demo User';
      currentUserName = name;
      return success(
        { name, token: 'mock-token-v2', expiresIn: 7200 },
        headers['x-request-id'],
      );
    },
  },
  {
    url: '/api/user/profile',
    method: 'get',
    response: ({ headers }: MockContext) =>
      success(
        { id: 1, name: currentUserName, role: 'admin', plan: 'pro' },
        headers['x-request-id'],
      ),
  },
  {
    url: '/api/examples/tasks',
    method: 'get',
    response: ({ headers }: MockContext) =>
      success(tasks, headers['x-request-id']),
  },
  {
    url: '/api/examples/tasks/:id/toggle',
    method: 'post',
    response: ({ query, headers }: MockContext) => {
      const task =
        tasks.find((item) => item.id === Number(query.id)) ?? tasks[0];
      if (task) task.done = !task.done;
      return success(task, headers['x-request-id']);
    },
  },
  {
    url: '/api/examples/feed',
    method: 'get',
    response: ({ query, headers }: MockContext) => {
      const cursor = Math.max(0, Number(query.cursor) || 0);
      const limit = Math.min(20, Math.max(1, Number(query.limit) || 6));
      const list = feed.slice(cursor, cursor + limit);
      return success(
        {
          list,
          total: feed.length,
          page: Math.floor(cursor / limit) + 1,
          pageSize: limit,
          hasMore: cursor + list.length < feed.length,
        },
        headers['x-request-id'],
      );
    },
  },
  {
    url: '/api/projects',
    method: 'get',
    response: ({ query, headers }: MockContext) => {
      const page = Math.max(1, Number(query.page) || 1);
      const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20));
      const list = projects.slice((page - 1) * pageSize, page * pageSize);
      return success(
        {
          list,
          total: projects.length,
          page,
          pageSize,
          hasMore: page * pageSize < projects.length,
        },
        headers['x-request-id'],
      );
    },
  },
  {
    url: '/api/projects',
    method: 'post',
    response: ({ body, headers }: MockContext) => {
      const input = body as unknown as ProjectInput;
      const timestamp = new Date().toISOString();
      const project: Project = {
        id: nextProjectId++,
        ownerId: 1,
        name: input.name.trim(),
        description: input.description ?? '',
        status: input.status ?? 'active',
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      projects = [project, ...projects];
      return success(project, headers['x-request-id']);
    },
  },
  {
    url: '/api/projects/:id',
    method: 'get',
    response: ({ query, headers }: MockContext) => {
      const project = projects.find((item) => item.id === Number(query.id));
      return project
        ? success(project, headers['x-request-id'])
        : { code: 404, msg: 'Project not found', data: null };
    },
  },
  {
    url: '/api/projects/:id',
    method: 'patch',
    response: ({ body, query, headers }: MockContext) => {
      const index = projects.findIndex((item) => item.id === Number(query.id));
      if (index === -1)
        return { code: 404, msg: 'Project not found', data: null };
      const current = projects[index];
      if (!current) return { code: 404, msg: 'Project not found', data: null };
      projects[index] = {
        ...current,
        ...(body as unknown as ProjectUpdateInput),
        updatedAt: new Date().toISOString(),
      };
      return success(projects[index], headers['x-request-id']);
    },
  },
  {
    url: '/api/projects/:id',
    method: 'delete',
    response: ({ query, headers }: MockContext) => {
      const id = Number(query.id);
      projects = projects.filter((item) => item.id !== id);
      return success({ deleted: true, id }, headers['x-request-id']);
    },
  },
  {
    url: '/api/products',
    method: 'get',
    response: ({ query, headers }: MockContext) => {
      const page = Math.max(1, Number(query.page) || 1);
      const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || 8));
      const keyword = (query.keyword ?? '').trim().toLowerCase();
      let list = products.filter((item) => item.status === 'on_sale');
      if (query.category)
        list = list.filter((item) => item.category === query.category);
      if (keyword)
        list = list.filter((item) =>
          `${item.sku} ${item.brand} ${Object.values(item.name).join(' ')}`
            .toLowerCase()
            .includes(keyword),
        );
      if (query.sort === 'sales') list.sort((a, b) => b.sales - a.sales);
      else if (query.sort === 'price_asc')
        list.sort((a, b) => a.priceCents - b.priceCents);
      else if (query.sort === 'price_desc')
        list.sort((a, b) => b.priceCents - a.priceCents);
      else
        list.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) || b.sales - a.sales,
        );
      const total = list.length;
      const pageList = list.slice((page - 1) * pageSize, page * pageSize);
      return success(
        {
          list: pageList,
          total,
          page,
          pageSize,
          hasMore: page * pageSize < total,
        },
        headers['x-request-id'],
      );
    },
  },
  {
    url: '/api/products/:id',
    method: 'get',
    response: ({ query, headers }: MockContext) =>
      success(
        products.find((item) => item.id === Number(query.id)),
        headers['x-request-id'],
      ),
  },
  {
    url: '/api/admin/products',
    method: 'get',
    response: ({ query, headers }: MockContext) => {
      const keyword = (query.keyword ?? '').trim().toLowerCase();
      let list = [...products];
      if (query.status)
        list = list.filter((item) => item.status === query.status);
      if (keyword)
        list = list.filter((item) =>
          `${item.sku} ${item.brand} ${Object.values(item.name).join(' ')}`
            .toLowerCase()
            .includes(keyword),
        );
      return success(
        { list, total: list.length, page: 1, pageSize: 50, hasMore: false },
        headers['x-request-id'],
      );
    },
  },
  {
    url: '/api/admin/products',
    method: 'post',
    response: ({ body, headers }: MockContext) => {
      const timestamp = new Date().toISOString();
      const product: Product = {
        ...(body as unknown as ProductInput),
        id: nextProductId++,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      products = [product, ...products];
      return success(product, headers['x-request-id']);
    },
  },
  {
    url: '/api/admin/products/:id',
    method: 'patch',
    response: ({ body, query, headers }: MockContext) => {
      const index = products.findIndex((item) => item.id === Number(query.id));
      if (index === -1)
        return { code: 404, msg: 'Product not found', data: null };
      const current = products[index];
      if (!current) return { code: 404, msg: 'Product not found', data: null };
      products[index] = {
        ...current,
        ...(body as Partial<ProductInput>),
        updatedAt: new Date().toISOString(),
      };
      return success(products[index], headers['x-request-id']);
    },
  },
  {
    url: '/api/admin/products/:id',
    method: 'delete',
    response: ({ query, headers }: MockContext) => {
      const id = Number(query.id);
      products = products.filter((item) => item.id !== id);
      return success({ deleted: true, id }, headers['x-request-id']);
    },
  },
  {
    url: '/api/examples/unauthorized',
    method: 'get',
    statusCode: 401,
    response: () => ({ code: 401, msg: 'Session expired', data: null }),
  },
  {
    url: '/api/examples/bad-request',
    method: 'get',
    statusCode: 400,
    response: () => ({
      code: 400,
      msg: 'Invalid request parameters',
      data: { field: 'keyword' },
    }),
  },
  {
    url: '/api/examples/forbidden',
    method: 'get',
    statusCode: 403,
    response: () => ({ code: 403, msg: 'Insufficient permission', data: null }),
  },
  {
    url: '/api/examples/not-found',
    method: 'get',
    statusCode: 404,
    response: () => ({ code: 404, msg: 'Resource not found', data: null }),
  },
  {
    url: '/api/examples/conflict',
    method: 'get',
    statusCode: 409,
    response: () => ({
      code: 409,
      msg: 'Resource version conflict',
      data: null,
    }),
  },
  {
    url: '/api/examples/validation',
    method: 'get',
    response: () => ({
      code: 422,
      msg: 'Business validation failed',
      data: { fields: ['name'] },
    }),
  },
  {
    url: '/api/examples/server-error',
    method: 'get',
    statusCode: 500,
    response: () => ({ code: 500, msg: 'Internal server error', data: null }),
  },
  {
    url: '/api/examples/timeout',
    method: 'get',
    timeout: 350,
    response: () => success({ completed: true }),
  },
] as MockMethod[];
