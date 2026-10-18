Feature: F6 Budgets

  @story-F6.1 @story-F6.8
  Rule: A member can set a monthly limit in LKR for a category, and both partners see it

    Scenario: Setting a limit
      Given Nadeesha is signed in and "Transport" has no limit
      When she sets the limit for "Transport" to "5000.00" LKR
      Then "Transport" shows the limit "LKR 5,000.00"

    Scenario: Kasun sees and changes Nadeesha's limit
      Given Nadeesha set the limit for "Transport" to "5000.00" LKR
      When Kasun changes it to "6000.00" LKR
      Then "Transport" shows the limit "LKR 6,000.00"

  @story-F6.2
  Rule: A changed limit applies from the current month, and past months keep theirs

    Scenario: Past months keep the old limit
      Given "Groceries" had the limit "12000.00" LKR in December 2025
      When Nadeesha changes it to "15000.00" LKR in January 2026
      Then December 2025 still shows "LKR 12,000.00" and January 2026 shows "LKR 15,000.00"

  @story-F6.3
  Rule: A member can remove a category's limit

    Scenario: Removing a limit
      Given "Transport" has a limit
      When Nadeesha removes it
      Then "Transport" shows no limit and no progress bar

  @story-F6.4 @story-F6.7
  Rule: Each category shows spent against its limit for a chosen month, the current month first

    Scenario: Spent against limit
      Given "Groceries" has the limit "15000.00" LKR and "12500.00" LKR was spent in January 2026
      When Nadeesha opens the budgets
      Then January 2026 is shown and "Groceries" shows spent "LKR 12,500.00" of "LKR 15,000.00" with a progress bar

    Scenario: A limit repeats every month
      Given "Utilities" has a limit that was set in December 2025
      When Nadeesha chooses January 2026
      Then "Utilities" shows the same limit

    Scenario: A category with no limit shows spending only
      Given "Health" has no limit
      When Nadeesha opens the budgets
      Then "Health" shows what was spent and no progress bar

  @story-F6.5
  Rule: A category passing 80% of its limit is highlighted

    Scenario: Over 80%
      Given "Groceries" has the limit "15000.00" LKR and "12500.00" LKR was spent this month
      When Nadeesha opens the budgets
      Then "Groceries" is highlighted as over 80%

    @negative
    Scenario: Under 80% is not highlighted
      Given "Utilities" has the limit "10000.00" LKR and "6900.00" LKR was spent this month
      When Nadeesha opens the budgets
      Then "Utilities" is shown as on track

  @story-F6.6
  Rule: A category passing 100% of its limit is highlighted differently

    Scenario: Over the limit
      Given "Transport" has the limit "5000.00" LKR and "5550.00" LKR was spent this month
      When Nadeesha opens the budgets
      Then "Transport" is highlighted as over budget, differently from over 80%
