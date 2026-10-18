Feature: F5 Reports and summaries

  @story-F5.1 @story-F5.2
  Rule: The report shows the total spent in the chosen month in LKR, starting with the current month

    Scenario: The current month is shown first
      Given today is in January 2026 and January has expenses
      When Nadeesha opens the monthly report
      Then the month shown is January 2026 and its total is the sum of January's expenses in LKR

    Scenario: Choosing another month
      Given expenses exist in December 2025
      When Nadeesha chooses December 2025
      Then the total is the sum of December's expenses in LKR

    Scenario: A month with no expenses has a total of zero
      Given no expense is dated in November 2025
      When Nadeesha chooses November 2025
      Then the total shown is "LKR 0.00"

  @story-F5.3 @story-F5.4
  Rule: The total is shown as a table and a chart with a bar per day

    Scenario: One bar per day with expenses
      Given January 2026 has expenses on 3 different days
      When Nadeesha opens the monthly report for January 2026
      Then the table and chart show 3 days, each with its LKR total

  @story-F5.5
  Rule: The previous month's total is shown beside the chosen month's

    Scenario: Comparing with December
      Given December 2025 and January 2026 both have expenses
      When Nadeesha opens the monthly report for January 2026
      Then the December 2025 total is shown beside the January 2026 total
