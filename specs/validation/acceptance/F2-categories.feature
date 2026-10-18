Feature: F2 Categories

  @story-F2.1
  Rule: A new household starts with a ready list of categories

    Scenario: The starter categories
      Given the household has just started using the app
      When Nadeesha opens the categories
      Then the list holds Groceries, Rent, Utilities, Transport, Dining out, Health, Entertainment and Other

  @story-F2.2
  Rule: A member can add a category with a name no other category has

    Scenario: Adding a category
      Given Nadeesha is signed in
      When she adds a category named uniquely for this run
      Then the categories list includes it

    @negative
    Scenario: A name differing only in letter case is refused
      Given the category "Groceries" exists
      When Nadeesha adds a category named "groceries"
      Then the categories list still has exactly one category named like "Groceries"

  @story-F2.3
  Rule: A member can rename a category

    Scenario: Renaming a category
      Given Nadeesha added a category named uniquely for this run
      When she renames it to "Pets"
      Then the categories list shows "Pets" and no longer shows the old name

    @negative
    Scenario: Renaming onto an existing name is refused
      Given the categories "Groceries" and "Rent" exist
      When Nadeesha renames "Rent" to "groceries"
      Then the category is still called "Rent"

  @story-F2.4
  Rule: Deleting a category moves its expenses to Other, and Other cannot be deleted

    Scenario: Deleting a category with expenses
      Given Nadeesha added a category named uniquely for this run and an expense in it
      When she deletes the category
      Then the expense is listed in the category "Other"

    @negative
    Scenario: Other cannot be deleted
      Given Nadeesha is signed in
      When she looks for a way to delete the category "Other"
      Then the category "Other" is still in the categories list

  @story-F2.5
  Rule: Both partners see the same categories

    Scenario: A category Nadeesha adds is visible to Kasun
      Given Nadeesha added a category named uniquely for this run
      When Kasun opens the categories
      Then the list includes that category
