# 環境とビルド

主要変数：

| 変数 | 用途 |
| --- | --- |
| `VITE_USE_MOCK` | 開発 Mock の有効化 |
| `VITE_API_BASE_URL` | Axios API Prefix |
| `VITE_API_TARGET` | Gin 開発 Proxy Target |
| `VITE_AI_API_BASE_URL` | AI Stream Prefix |
| `VITE_AI_API_TARGET` | FastAPI 開発 Proxy Target |
| `VITE_UI_FRAMEWORK` | `vant` / `nutui` / `varlet` |
| `VITE_PWA_ENABLED` | PWA の有効化 |
| `VITE_IMAGE_OPTIMIZE` | Production 画像最適化 |
| `VITE_USE_REPORT` | Bundle Report |

Secret を `VITE_*` に保存しないでください。これらは Browser Bundle から参照できます。Production Mock は既定で無効です。

