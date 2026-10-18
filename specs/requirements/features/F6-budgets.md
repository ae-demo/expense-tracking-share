# Budgets

## Purpose

Household members set monthly spending limits per category and see how spending compares.

Needs: F1, F2.

## User Stories

- F6.1 As a household member, I set a monthly spending limit in LKR for a category.
- F6.2 As a household member, I change a category's monthly limit.
- F6.3 As a household member, I remove a category's monthly limit.
- F6.4 As a household member, I see each category's spent amount against its limit, with a progress bar, for a month.
- F6.5 As a household member, I see a category highlighted when its spending passes 80% of its limit.
- F6.6 As a household member, I see a category highlighted differently when its spending passes 100% of its limit.
- F6.7 As a household member, I pick the month to see, and the current month is shown first.
- F6.8 As a household member, I see the budgets my partner set, and can change them.
- F6.9 As a household member, I see on the household expenses list what remains of the budgets for the month, overall and for each category.

## Decisions

- A budget is a monthly limit per category, in LKR.
- A limit repeats every month until it is changed.
- Spending is compared to limits in LKR as P4 requires.
- Changing a limit applies from the current month on, and past months keep the limit they had.
- Categories with no limit show spending without a bar.
- What remains of a category's budget is its limit minus what was spent in it; it shows as over by an amount when spending passes the limit.
- The overall remainder adds up the categories that have a limit; it is not a separate limit. *assumed*

## Out of Scope

- An overall monthly limit across all categories.
- Notifications by email or any other channel when a limit is reached.