# UI Framework Strategy

The template retains Vant, NutUI, and Varlet as choices, while each production build selects exactly one:

```env
VITE_UI_FRAMEWORK=vant
```

Vite selects the matching resolver, SCSS injection, and `#ui-demo` alias. Business code has no scattered framework conditionals, and the other packages do not enter the current production graph.

Core Layout, AI Chat, and engineering examples use lightweight template styles and `SvgIcon` to avoid cross-framework coupling. Real projects should select one UI library during initialization; a future CLI can remove unselected dependencies.

## SVG Icons

Place product icons in `src/assets/icons/*.svg`. The plugin creates a sprite and the app uses typed `<SvgIcon name="ai" />`. Keep framework-provided icons local to that framework and outside the product icon union.

## Styling

Global design tokens live in `src/styles/index.scss`; component layouts use scoped SCSS. UnoCSS was not added because the current project does not need a second atomic styling paradigm. The viewport plugin converts business px values from a 750 design width and treats UI libraries as 375. Verify final 44 CSS-pixel touch targets, safe-area, dark scheme, and focus-visible behavior.
