Feature: F3 Bill upload

  @story-F3.1
  Rule: A member can upload a bill as a JPG, PNG or PDF

    Scenario: Uploading a photo of a bill
      Given Nadeesha is signed in
      When she uploads the bill photo "keells-receipt.jpg"
      Then she is shown an expense to review

    @negative
    Scenario: A file of another type is not accepted
      Given Nadeesha is signed in
      When she tries to upload the file "notes.docx"
      Then no expense is started and the household list has the same expenses as before

    @negative
    Scenario: A file over the size limit is not accepted
      Given Nadeesha is signed in
      When she tries to upload a photo of 8 MB
      Then no expense is started and the household list has the same expenses as before

  @story-F3.2
  Rule: The values an agent read from the bill are pre-filled in a new expense

    Scenario: A readable bill pre-fills the expense
      Given Nadeesha uploads a bill from "Keells Super" for "8450.00" LKR dated "2026-01-15"
      When the bill has been read
      Then the new expense shows merchant "Keells Super", amount "8450.00", currency "LKR", date "2026-01-15" and a suggested category

    Scenario: The suggested category is one that exists
      Given Nadeesha uploads a grocery bill
      When the bill has been read
      Then the suggested category is "Groceries" or another category in the categories list

  @story-F3.3
  Rule: A member can correct any pre-filled value before confirming

    Scenario: Correcting the amount
      Given the bill from "Keells Super" was read with the amount "8450.00"
      When Nadeesha changes the amount to "8540.00"
      Then the expense to confirm shows the amount "8540.00"

  @story-F3.4
  Rule: Nothing is saved until the member confirms, and the saved expense keeps the bill

    Scenario: Confirming saves the expense with its bill
      Given the bill "keells-receipt.jpg" was read and Nadeesha is reviewing the expense
      When she confirms it
      Then the household list has one more expense than before and it shows the bill "keells-receipt.jpg"

    @negative
    Scenario: Reviewing without confirming saves nothing
      Given the bill "keells-receipt.jpg" was read and Nadeesha is reviewing the expense
      When she leaves without confirming
      Then the household list has the same expenses as before

  @story-F3.5
  Rule: A bill that cannot be read gives a blank expense form with the bill attached

    Scenario: An unreadable bill
      Given Nadeesha uploads a blurred photo "blurred.jpg" that cannot be read
      When the bill has been read
      Then she is shown an empty expense form with the bill "blurred.jpg" attached

  @story-F3.6
  Rule: A member can discard an upload without saving an expense

    Scenario: Discarding an upload
      Given the bill "keells-receipt.jpg" was read and Nadeesha is reviewing the expense
      When she discards the upload
      Then the household list has the same expenses as before
