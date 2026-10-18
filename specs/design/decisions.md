# Technical decisions

- \[architecture\] The bill is read by an agent the web app calls directly, with the file attached; the agent returns the values and saves nothing. *assumed* (F3)
- \[architecture\] Bill files go from the browser to object storage through a short-lived upload link the API issues, never through the API's own servers. *assumed* (F1, F3)
- \[architecture\] The bill-reading agent keeps its own conversation store, separate from the expense database. *assumed* (F3)
- \[data-model\] Amounts are stored in minor units of the currency paid; LKR amounts are computed, never stored. *assumed* (F1, F4, F5, F6)
- \[data-model\] A changed budget limit adds a row from the current month, so past months keep their limit. *assumed* (F6)
- \[data-model\] Exchange rates are cached per currency and day. *assumed* (F4, F5, F6)
- \[security\] Every household member holds the same permissions; there is one role. *assumed* (all)
- \[expense-api\] The budgets list also returns each category's remainder and the overall remainder, so the expenses screen needs no second call. *assumed* (F6)
- \[expense-api\] A list returns 50 expenses per page. *assumed* (F4)
- \[expense-api\] An expense whose rate is unavailable is returned with no LKR amount and left out of totals. *assumed* (F4, F5, F6)
- \[bill-reader\] The agent answers with one JSON object of the values it read, or an empty object when it cannot read the bill. *assumed* (F3)