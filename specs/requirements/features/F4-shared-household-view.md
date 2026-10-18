# Shared household view

## Purpose

Both household members see the same list of all expenses and who paid each.

Needs: F1.

## User Stories

- F4.1 As a household member, I see every expense either of us recorded in one list, with date, merchant, category, who paid and the amount.
- F4.2 As a household member, I see each amount in LKR beside the currency it was paid in.
- F4.3 As a household member, I see the newest expenses first, by expense date.
- F4.4 As a household member, I filter the list by month.
- F4.5 As a household member, I filter the list by category. Needs: F2.
- F4.6 As a household member, I filter the list by who paid.
- F4.7 As a household member, I search the list by merchant or note text.
- F4.8 As a household member, I see the total spent this month in LKR at the top of the list.
- F4.9 As a household member, I see how much each partner paid this month, in LKR, at the top of the list.
- F4.10 As a household member, I open an expense from the list to see its details and bill. 
- F4.11 As a household member, I see an expense my partner just added without signing in again. *assumed*

## Decisions

- The list shows both partners' expenses to both partners; nothing is private.
- Amounts are converted to LKR as P4 requires.
- The totals at the top follow the filters in use. *assumed*
- The list is paged in groups of 50 expenses. *assumed*

## Out of Scope

- Private expenses visible to one partner only.
- Showing who owes whom.