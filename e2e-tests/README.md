# Selenium E2E Test Suite

This folder contains an external black-box E2E suite for the frontend app.

## Stack
- Selenium WebDriver (Node.js)
- Mocha + Chai
- Chrome browser
- Async/await + explicit waits only

## Structure
- `tests/`: Test specs (navigation, auth, forms/UI, full flow)
- `pages/`: Page Object Model classes
- `utils/`: Driver factory, waits, config, session helpers, selectors

## Selector Policy
The suite only uses:
- `id`
- `name`
- `data-testid`

No class selectors are used.

## Setup
1. Copy `.env.example` to `.env`.
2. Set `BASE_URL` to your running frontend URL.
3. Optionally set `VALID_LOGIN_EMAIL` and `VALID_LOGIN_PASSWORD` for valid-login and full-flow tests.

## Run
```bash
cd e2e-tests
npm install
npm test
```

Headed mode:
```bash
cd e2e-tests
npm run test:headed
```

Run only authentication:
```bash
cd e2e-tests
npm run test:auth
```

## Notes
- Tests requiring valid credentials are automatically skipped when env vars are not provided.
- Logout is validated via external session invalidation (clearing browser storage/cookies), then checking protected-route redirect to `/login`.
- This suite does not modify frontend source code.
