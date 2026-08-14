# Playwright TypeScript API + C# UI shop tests

The same shop journeys covered twice:

- **API** — Playwright TypeScript with a fluent client (`endpoint().withForm().post(200)`)
- **UI** — Playwright C# / NUnit with page objects

Both target [Automation Exercise](https://www.automationexercise.com/).

| Journey | API | UI |
| --- | --- | --- |
| Product catalogue | `GET /api/productsList` | Products page lists items |
| Search for Dress | `POST /api/searchProduct` | Search box on the products page |
| Unique account | `POST /api/createAccount` | Signup form |
| Duplicate email | same endpoint, existing email | Signup form shows the existing-email error |

The API client is fluent: `endpoint()`, `withForm()` / `withPayload()`, then chained `get` / `post` with an expected status.

## API tests (TypeScript)

```bash
npm install
npx playwright install
npm test
```

## UI tests (C#)

```bash
cd ui
dotnet build --configuration Release
node bin/Release/net8.0/.playwright/package/cli.js install chromium
dotnet test --configuration Release --no-build
```

CI installs Chromium in the workflow. Headless is the default.
