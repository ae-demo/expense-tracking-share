# Product-wide

Rules that apply to more than one feature.

## Requirements

- P1 Every user signs in through single sign-on, and only signed-in household members can see or change data. \[org default\] Applies to: all.
- P2 Both household members have equal access to all data. Applies to: all.
- P3 Amounts are in a single currency, stored in minor units (cents). Applies to: F1, F3, F5, F6. *assumed*

## Decisions

- Sign-in is single sign-on through the platform identity provider. \[org default\]
- Bill reading from an uploaded image is done by an agent. *assumed*