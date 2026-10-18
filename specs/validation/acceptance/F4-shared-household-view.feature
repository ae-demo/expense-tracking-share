Feature: F4 Shared household view

  @story-F4.1 @story-F4.11
  Rule: Both partners see every expense either recorded, in one list

    Scenario: Kasun sees an expense Nadeesha just recorded
      Given Kasun has the household list open
      When Nadeesha records an expense of "7700.00" LKR at "Fresh Bakery" on "2026-01-14"
      Then Kasun's list shows "Fresh Bakery" with date, category, who paid and amount without Kasun signing in again

  @story-F4.2
  Rule: Each amount is shown in LKR beside the currency it was paid in

    Scenario: A dollar expense shows its LKR value
      Given an expense of "18.50" USD was recorded
      When Nadeesha views the list
      Then that row shows "USD 18.50" and an amount in LKR

    @negative
    Scenario: An expense with no exchange rate is left out of totals
      Given an expense in a currency whose rate is unavailable
      When Nadeesha views the list
      Then the row has no LKR amount and the totals do not include it

  @story-F4.3
  Rule: The newest expenses by expense date come first

    Scenario: Ordering by expense date
      Given expenses dated "2026-01-03" and "2026-01-12" were recorded
      When Nadeesha views January 2026
      Then the expense dated "2026-01-12" is above the one dated "2026-01-03"

  @story-F4.4
  Rule: The list can be filtered by month

    Scenario: Filtering to December
      Given expenses exist in December 2025 and January 2026
      When Nadeesha filters to December 2025
      Then every listed expense is dated in December 2025

  @story-F4.5
  Rule: The list can be filtered by category

    Scenario: Filtering to Groceries
      Given expenses exist in Groceries and Rent
      When Nadeesha filters to the category "Groceries"
      Then every listed expense is in "Groceries"

  @story-F4.6
  Rule: The list can be filtered by who paid

    Scenario: Filtering to what Kasun paid
      Given Nadeesha and Kasun each paid for expenses
      When Nadeesha filters to "Kasun Perera"
      Then every listed expense is paid by "Kasun Perera"

  @story-F4.7
  Rule: The list can be searched by merchant or note text

    Scenario: Searching by merchant
      Given expenses at "Keells Super" and "Uber" exist
      When Nadeesha searches for "keells"
      Then every listed expense is at "Keells Super"

    @negative
    Scenario: A search with no match lists nothing
      Given expenses exist
      When Nadeesha searches for text that no merchant or note contains
      Then the list has no expenses

  @story-F4.8 @story-F4.9
  Rule: Totals at the top follow the filters, in LKR, and split by who paid

    Scenario: The month's total and each partner's share
      Given in January 2026 Nadeesha paid expenses worth "LKR 23,600.00" and Kasun paid expenses worth "LKR 155,550.00"
      When Nadeesha views January 2026
      Then the total shown is the sum of both, and each partner's amount shown is what they paid

    Scenario: Totals follow the category filter
      Given January 2026 has expenses in Groceries and Rent
      When Nadeesha filters to "Groceries"
      Then the total shown equals the Groceries expenses only

  @story-F4.10
  Rule: A member can open an expense to see its details and bill

    Scenario: Opening an expense with a bill
      Given an expense at "Dialog" has the bill "dialog-jan.pdf"
      When Nadeesha opens it
      Then she sees its date, category, who paid, both amounts, note and the bill "dialog-jan.pdf"
