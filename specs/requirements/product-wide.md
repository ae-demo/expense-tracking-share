# Product-wide

Rules that apply to more than one feature.

## Requirements

- P1 Every user signs in through single sign-on, and only signed-in household members can see or change data. \[org default\] Applies to: all.
- P2 Both household members have equal access to all data. Applies to: all.
- P3 An expense is recorded in the currency it was paid in; amounts are stored in minor units (cents). Applies to: F1, F3. 
- P4 Every total, report and budget comparison is shown converted to LKR. Applies to: F4, F5, F6.

## Decisions

- Sign-in is single sign-on through the platform identity provider. \[org default\]
- Bill reading from an uploaded image is done by an agent that pre-fills the expense; the member confirms before it is saved.
- Uploaded bill images are stored in object storage (aws-s3). \[org default\]
- Currency conversion to LKR: an exchange-rate service is needed; no provider named yet.
- The household is the two people in one household sign-in group; a partner appears in the who-paid choices after first signing in. *assumed*

## Open Questions

1. Which exchange rate applies when converting to LKR: the rate on the expense date, or the current rate at the time of viewing?
   - Rate on the expense date
   - Current rate when viewing