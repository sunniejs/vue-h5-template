# UI フレームワーク戦略

`VITE_UI_FRAMEWORK` が Vant、NutUI、Varlet の Resolver と Demo Alias をビルド時に一つだけ選択します。実業務ページで複数 Framework を混在させません。

各 UI Demo は Button だけでなく、状態、設定 List、Switch、Progress、Tag など実際の Interaction を示します。Product Icon は `src/assets/icons` と `<SvgIcon />` を使い、UI Library 固有 Icon と分離します。

アプリ固有 Layout は Scoped SCSS と Design Token を使います。Atomic Utility を長く並べることを必須にしません。

