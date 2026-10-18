Feature: F1 Record expenses

  @story-F1.1 @story-F1.3 @story-F1.4
  Rule: A member records an expense with its amount, currency, date, merchant, category and note

    Scenario: Recording a groceries expense in LKR
      Given Nadeesha is signed in
      When she adds an expense of "12500.00" LKR on "2026-01-12" at "Keells Super" in the category "Groceries" with the note "Weekly shopping"
      Then the expense appears in the household list with merchant "Keells Super", category "Groceries" and amount "LKR 12500.00"

    Scenario: An expense in another currency keeps its own currency
      Given Nadeesha is signed in
      When she adds an expense of "18.50" USD on "2026-01-10" at "Uber"
      Then the expense is listed with the amount "USD 18.50"

    Scenario: An expense with no category chosen falls under Other
      Given Nadeesha is signed in
      When she adds an expense of "900.00" LKR on "2026-01-11" at "Corner Shop" without choosing a category
      Then the expense is listed in the category "Other"

  @story-F1.2
  Rule: Who paid defaults to the person recording and can be switched to the other partner

    Scenario: The recorder is the default payer
      Given Nadeesha is signed in
      When she opens the form to add an expense
      Then "Nadeesha Perera" is chosen as who paid

    Scenario: Recording an expense paid by the partner
      Given Nadeesha is signed in
      When she adds an expense of "5000.00" LKR on "2026-01-09" at "Pharmacy" and chooses "Kasun Perera" as who paid
      Then the expense is listed as paid by "Kasun Perera"

  @story-F1.1
  Rule: The currency defaults to the one used for the last expense

    Scenario: The next expense starts in the last currency used
      Given Nadeesha has just saved an expense in "USD"
      When she opens the form to add another expense
      Then "USD" is chosen as the currency

  @story-F1.5
  Rule: A member can attach a bill image to an expense recorded by hand

    Scenario: Attaching a bill
      Given Nadeesha is adding an expense of "6900.00" LKR at "Dialog"
      When she attaches the bill "dialog-jan.pdf" and saves
      Then the expense shows the bill "dialog-jan.pdf" as its attachment

  @story-F1.6
  Rule: Either partner can edit any expense, whoever recorded it

    Scenario: Kasun corrects an expense Nadeesha recorded
      Given Nadeesha recorded an expense of "4200.00" LKR at "Lanka Pharmacy"
      When Kasun changes its amount to "4500.00"
      Then the expense is listed with the amount "LKR 4500.00"

  @story-F1.7
  Rule: Either partner can delete any expense for good, after confirming

    Scenario: Deleting an expense after confirmation
      Given Nadeesha recorded an expense at "Lanka Pharmacy"
      When Kasun deletes it and confirms
      Then the expense is no longer in the household list

    @negative
    Scenario: Declining the confirmation keeps the expense
      Given Nadeesha recorded an expense at "Lanka Pharmacy"
      When Kasun starts to delete it and then keeps it
      Then the household list has the same expenses as before

  @story-F1.8
  Rule: An expense cannot be saved without an amount and a date

    @negative
    Scenario: A missing amount is flagged
      Given Nadeesha is adding an expense at "Keells Super" with no amount
      When she tries to save
      Then she is warned the amount is missing and the household list has the same expenses as before

    @negative
    Scenario: A missing date is flagged
      Given Nadeesha is adding an expense of "1200.00" LKR with the date cleared
      When she tries to save
      Then she is warned the date is missing and the household list has the same expenses as before
