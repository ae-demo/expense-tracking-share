# Categories

## Purpose

Household members group expenses into categories such as groceries or rent.

## User Stories

- F2.1 As a household member, I start with a ready list of categories: Groceries, Rent, Utilities, Transport, Dining out, Health, Entertainment and Other.
- F2.2 As a household member, I add a category.
- F2.3 As a household member, I rename a category.
- F2.4 As a household member, I delete a category.
- F2.5 As a household member, I see the same list of categories as my partner.

## Decisions

- Every expense has a category; an expense with no category chosen falls under Other.
- Deleting a category moves its expenses to Other. *assumed*
- Other cannot be deleted. *assumed*
- Category names are unique, ignoring upper and lower case. *assumed*

## Out of Scope

- Sub-categories.