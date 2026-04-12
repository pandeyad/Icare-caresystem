# `src/services/`

Service layer for the ICare UI. Pages should never import from `*.mock.ts`
or call `axios` directly — they go through one of the clients in this
folder.

## Layout

```
services/
├── index.ts                  ← barrel; pages import from here
├── gateway/
│   ├── gatewayClient.ts      ← the ONE axios instance + mockResponse helper
│   ├── tokenStore.ts         ← get/setAuthToken (localStorage today, cookie later)
│   ├── toastBridge.ts        ← registerToast + reportApiError
│   └── README.md             ← you are here
├── identity/    ← IdSvc + the gateway-proxied /api/me/permissions
├── me/          ← MeSvc — signed-in user's snapshot/shifts/own requests
├── calendar/    ← CalendarSvc aggregator (Rota+Request+Swap fan-in)
├── team/        ← TeamSvc
├── home/        ← HomeSvc + residents
├── clients/     ← ClientsSvc — per-client profile / audit / comments / service history
├── manage/      ← Manage hub fan-in (Rota overrides + Request approvals + Swaps + permissions CRUD)
├── swap/        ← SwapSvc — peer-to-peer swap requests
└── audit/       ← AuditSvc
```

## Boundary rules

1. **Only `gatewayClient.ts` imports `axios`.** Verified by:
   ```sh
   grep -RnE "from ['\"]axios['\"]" src/pages src/components src/auth src/app
   ```
   That command must return zero matches.

2. **No service file imports another service file.** Each client only
   imports from `../gateway/gatewayClient`, its own `*.types.ts`, and the
   mock file inside its own sub-folder. Cross-service aggregation only
   happens server-side in the gateway. The one exception is
   `calendarService`, which pulls events from multiple domains because
   it stands in for a gateway aggregator.

3. **Pages import the barrel.** Pages do
   `import { meService } from "../../services"` and then call
   `meService.getSnapshot()` — they never reach into a sub-folder.

## Mock-first contract

Every method in this layer follows the same recipe:

1. Import the same mock constant the page used to import.
2. Apply whatever local filter/transform the page used to apply inline.
3. Return `mockResponse(data)` for ~250ms simulated latency.
4. Prepend an inline `// TODO(integration): <METHOD> /api/... body=Type`
   comment naming the exact endpoint, HTTP verb, and request type. **The
   comment is the contract for the next phase.**

When the real backend lands, the mock body is replaced with a
`gatewayClient.get/post/patch/delete` call. Pages should not need to
change.

## Per-call options

Service methods accept an optional last argument
`{ silent?: boolean; signal?: AbortSignal }`. When `silent: true`, the
gateway client's response interceptor suppresses its automatic toast and
the caller handles the rejected promise inline. During the mock phase
this is a no-op (because `mockResponse` never rejects), but the option
is present so signatures don't change later.

## Environment

Set `VITE_GATEWAY_URL` to point at the real gateway. Default
`http://localhost:8080`. No env variable is required during the mock
phase — `gatewayClient` is wired up but no code path hits it.
