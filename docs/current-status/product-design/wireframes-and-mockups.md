# Wireframes and Mockups

Status date: 2026-04-12

## Note

The repository currently stores implemented UI code rather than a dedicated Figma or wireframe package. The wireframes below are low-fidelity structural representations of the current product surfaces.

## Customer Signin

```text
+---------------------------------------------------------------+
| Topbar / brand                                                 |
+-----------------------------+---------------------------------+
| Brand / logo panel          | Signin card                     |
|                             | - email                         |
|                             | - password                      |
|                             | - sign in                       |
|                             | - continue with Google          |
|                             | - help dialog                   |
+-----------------------------+---------------------------------+
```

## Customer Dashboard

```text
+-------------------+-------------------------------------------+
| Sidebar           | Sticky topbar                             |
| - workspace       +-------------------------------------------+
| - dashboard       | Page title / breadcrumb row               |
| - messages        +-------------------------------------------+
| - API docs        | Hero / summary / signals                  |
| - settings        +-------------------------------------------+
| - subscription    | Work cards / tables / API access panels   |
+-------------------+-------------------------------------------+
```

## Customer API Documents Page

```text
+---------------------------------------------------------------+
| Page header / breadcrumb                                       |
+---------------------------------------------------------------+
| Quick start summary                                            |
+---------------------------------------------------------------+
| Reference selectors: workspace, instance, language            |
+---------------------------------------------------------------+
| Endpoint cards + copy buttons                                 |
+---------------------------------------------------------------+
| Code examples by language                                     |
+---------------------------------------------------------------+
| Webhook examples + signature verification                     |
+---------------------------------------------------------------+
```

## Admin Control Plane

```text
+-------------------+-------------------------------------------+
| Admin sidebar     | Admin topbar                              |
| - users           +-------------------------------------------+
| - workspaces      | Dashboard / explorer header               |
| - workers         +-------------------------------------------+
| - messages        | Tables / cards / detail content           |
| - support         |                                           |
| - audit           |                                           |
+-------------------+-------------------------------------------+
```

## Mockup Guidance

High-fidelity mockups should continue to reflect the implemented layout patterns already present in the Next.js apps rather than reinvent the information architecture.
