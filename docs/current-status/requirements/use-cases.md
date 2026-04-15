# Use Cases

Status date: 2026-04-12

## UC-01 Customer signs up

- Primary actor: Customer user
- Preconditions: User is not yet registered
- Main flow:
  1. User opens the customer app
  2. User completes the signup form or chooses Google signup
  3. System creates the user and workspace membership baseline
  4. User reaches authenticated customer routes
- Success outcome: Customer session exists and workspace access is available

## UC-02 Customer creates an instance

- Primary actor: Customer user
- Preconditions: Customer is authenticated and has workspace access
- Main flow:
  1. User opens the dashboard or instance creation flow
  2. User creates a new instance
  3. System persists the instance and related initial records
  4. UI exposes runtime and API access details
- Success outcome: Instance exists with internal and public identifiers

## UC-03 Customer links WhatsApp and uses API

- Primary actor: Customer user
- Preconditions: Instance exists
- Main flow:
  1. User opens instance detail
  2. User scans the QR code / authenticates the runtime
  3. System updates runtime state and status
  4. User retrieves token guidance from the API access card or API docs page
  5. User sends a message through the public API
- Success outcome: Authenticated instance can be used through the API

## UC-04 Admin investigates a delivery problem

- Primary actor: Platform admin
- Preconditions: Admin is authenticated
- Main flow:
  1. Admin opens messages or instance detail
  2. Admin filters outbound messages, inbound messages, or webhook deliveries
  3. Admin reviews status, attempts, and audit-related context
  4. Admin replays or escalates where supported
- Success outcome: Delivery issue is traceable and actionable

## UC-05 Support handles a customer issue

- Primary actor: Support/admin user
- Preconditions: Support case exists or customer escalates an issue
- Main flow:
  1. Support reviews workspace, instance, support, and audit data
  2. Support identifies the failure or configuration issue
  3. Support communicates next action or resolves the issue
- Success outcome: Issue is handled using platform data rather than ad hoc investigation
