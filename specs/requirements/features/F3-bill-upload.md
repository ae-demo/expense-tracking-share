# Bill upload

## Purpose

A household member uploads an image of a bill and an agent reads it to pre-fill an expense, which the member confirms.

Needs: F1, F2.

## User Stories

- F3.1 As a household member, I upload a bill as a JPG, PNG or PDF.
- F3.2 As a household member, I see the amount, currency, date, merchant and suggested category an agent read from the bill, pre-filled in a new expense.
- F3.3 As a household member, I correct any pre-filled value before I confirm.
- F3.4 As a household member, I confirm the pre-filled expense to save it with the bill attached.
- F3.5 As a household member, when the bill cannot be read, I get a blank expense form with the bill attached.
- F3.6 As a household member, I discard an upload without saving an expense.

## Decisions

- The agent extracts the amount, currency, date, merchant and a suggested category from the bill.
- Nothing is saved until the member confirms.
- The saved expense keeps the bill and shows it as its attachment.
- Bill files are stored in object storage. \[org default\]
- Each upload is limited to 10 MB.
- The suggested category is one of the existing categories, or Other.
- Each upload makes one expense.

## Out of Scope

- Several expenses from one bill.
- Reading bills received by email.