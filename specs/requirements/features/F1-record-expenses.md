# Record expenses

## Purpose

A household member adds, edits and deletes expenses with amount, currency, date, merchant, category, note and who paid.

## User Stories

- F1.1 As a household member, I add an expense with an amount, a currency, a date and a note.
- F1.2 As a household member, I choose who paid, defaulting to myself or the other partner. Needs: F2.
- F1.3 As a household member, I enter the merchant of an expense as free text.
- F1.4 As a household member, I pick a category for an expense, or leave it as Other. Needs: F2.
- F1.5 As a household member, I attach a bill image to an expense I record by hand.
- F1.6 As a household member, I edit any expense, whoever recorded it.
- F1.7 As a household member, I delete any expense, whoever recorded it.
- F1.8 As a household member, I am warned about a missing amount or date before an expense is saved.

## Decisions

- Who paid defaults to the person recording the expense and can be switched to the other partner.
- Either partner can edit or delete any expense.
- The currency defaults to the one used for the last expense.
- An attached bill image is stored in object storage. \[org default\]
- Deleting an expense removes it for good, after a confirmation.

## Out of Scope

- Splitting an expense between the partners or tracking who owes whom.
- Recurring expenses.

