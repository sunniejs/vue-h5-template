# UI and Mobile Adaptation

## UI Libraries

The template integrates Vant, NutUI, and Varlet through `unplugin-vue-components` and `unplugin-auto-import`. The demo compares all three; production applications should not treat long-term mixing as the default.

For a product project:

1. Select one primary UI library.
2. Remove unused UI packages and resolvers from `package.json`.
3. Clean up `component.ts`, `autoImport.ts`, and related imports in `src/main.ts`.
4. Remove unused demo sections and run `pnpm check`.

## Viewport Conversion

`postcss.config.mjs` uses `cnjm-postcss-px-to-viewport`:

- Application styles use a 750px design width.
- Vant, NutUI, and Varlet dependency styles use a 375px design width.
- Values at or below 1px are preserved for thin borders.
- Default targets are Android 8+, iOS 12+, and Chrome 80+.

## Safe Areas and Scrolling

- The layout uses `100dvh`, an independent vertical scroller, and `overscroll-behavior`.
- The tabbar enables bottom safe-area handling.
- The fixed purchase bar reserves `env(safe-area-inset-bottom)`.

Any new fixed bottom action must reserve matching content padding so it does not cover page content.
