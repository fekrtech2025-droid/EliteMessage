# Flowcharts and Sequence Diagrams

Status date: 2026-04-12

## Customer Authentication Flow

```mermaid
sequenceDiagram
  participant U as Customer User
  participant CW as Customer Web
  participant API as API
  participant DB as PostgreSQL

  U->>CW: Open signin/signup
  U->>CW: Submit credentials or choose Google
  CW->>API: Auth request
  API->>DB: Validate or create user/session
  API-->>CW: Access token + refresh cookie / redirect flow
  CW-->>U: Authenticated customer workspace
```

## Instance Creation to API Usage

```mermaid
flowchart TD
  A["Customer signs in"] --> B["Create instance"]
  B --> C["Instance record created"]
  C --> D["Open instance detail"]
  D --> E["Link WhatsApp / authenticate runtime"]
  E --> F["Instance status becomes authenticated"]
  F --> G["Retrieve API instance ID and token guidance"]
  G --> H["Call public API endpoints from backend"]
```

## Worker and Lifecycle Operation Sequence

```mermaid
sequenceDiagram
  participant CW as Customer/Admin UI
  participant API as API
  participant R as Redis/BullMQ
  participant WK as Worker
  participant DB as PostgreSQL

  CW->>API: Request instance operation
  API->>DB: Persist operation as pending
  API->>R: Enqueue work
  R->>WK: Deliver job
  WK->>DB: Update operation/runtime state
  WK->>API: Report heartbeat/internal updates
  API->>DB: Persist lifecycle event
  API-->>CW: Updated state becomes visible in UI
```

## Webhook Delivery Flow

```mermaid
sequenceDiagram
  participant API as API
  participant DB as PostgreSQL
  participant Target as Customer Webhook Endpoint
  participant Admin as Admin UI

  API->>DB: Create webhook delivery record
  API->>Target: Send signed webhook request
  Target-->>API: HTTP response
  API->>DB: Persist delivery status and attempt metadata
  Admin->>API: View delivery history / replay where supported
```

## Documentation Note

These diagrams represent the intended current runtime relationships at a level suitable for product, architecture, and onboarding documentation. Detailed route payloads and entity fields remain documented in the API and schema references.
