# Plan: i18n + UI premium (Sales Pulse)

Rama sugerida: `feat/i18n-premium-ui` (base: `feat/polish`).

## 1. Diagnóstico breve (pre-implementación)

- UI neutra, poco acento ejecutivo; header genérico.
- Cuatro series temporales competían por atención; funnel con etiquetas fijas en inglés en código.
- Foco del día como alerta roja única, sin recomendaciones accionables traducibles.

## 2. Objetivo del rediseño

Dashboard ejecutivo **Sales Pulse**: jerarquía clara, hero “Resumen ejecutivo”, 4 KPIs, embudo + una tendencia combinada, desktop “above the fold” donde sea viable.

## 3. Arquitectura i18n

- `src/i18n/translations.ts` — textos ES/EN y `METRIC_TITLE_KEY`, `focusRecommendation(lang, key)`.
- `src/i18n/language-context.ts` — contexto React.
- `src/i18n/language-provider.tsx` — estado idioma, `localStorage` (`sales-pulse-lang`), `document.documentElement.lang`.
- `src/i18n/useLanguage.ts` — `language`, `setLanguage`, `t`, `tFocusReco`, `tFunnelStep`.

Sin i18next.

## 4. Textos traducidos

Header, dataset, rango, hero/foco, KPIs (incl. win rate y métricas del grid), embudo, tendencia principal, vacíos.

## 5. Layout desktop

Grid inferior 2 columnas (embudo | tendencia); padding/gaps moderados; alturas de chart ~220px.

## 6. Responsive mobile

Scroll vertical aceptable; controles con área táctil cómoda.

## 7. Restricciones

Sin cambiar `metrics.json`; sin null→0 en promedios; sin logo Palvi; sin backend.

## 8. Criterios de aceptación

ES por defecto; toggle ES/EN; persistencia; `lang` en `<html>`; dataset/rango operativos; `pnpm lint` y `pnpm build` OK.

## 9. Segunda iteración

Locales `date-fns` en ejes, dark mode alineado a tokens, code-splitting de charts.
