# Contributing

## Prerequisites
- Node.js 20+
- npm 9+
- Expo CLI (via `npx expo ...`)

## Setup
1. Install dependencies
   - `npm install`
2. Create local env
   - Copy `.env.example` to `.env`
   - Fill required `EXPO_PUBLIC_*` values

## Development
- Start dev server: `npm run start`
- Run Android: `npm run android`
- Run iOS: `npm run ios`

## Code Quality
- Typecheck: `npm run type-check`
- Lint: `npm run lint`
- Unit tests: `npm test`

## UI Reference Work
- Audit/spec: `docs/UI_REFERENCE_AUDIT.md`
- Route group: `/app/base`
- Design tokens + base UI: `/src/base`

## Pull Requests
- Keep PRs small and focused (one feature/fix per PR).
- Include screenshots/screen recordings for UI changes (iOS + Android if applicable).
- Update docs when adding/modifying reusable components:
  - Component APIs and usage
  - Any new design tokens

### PR Checklist
- [ ] `npm run type-check` passes
- [ ] `npm test` passes
- [ ] `npm run lint` has no errors
- [ ] UI verified on common widths (360 / 390 / 414+)
- [ ] UI reference changes align with audit checklist
