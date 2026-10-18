# Domain model

The household's records: two members, the categories they share, their expenses (each in the currency it was paid in, with an optional bill), monthly category budgets, and cached exchange rates used to show everything in LKR.

```mermaid
erDiagram
    HouseholdMember ||--o{ Expense : "paid"
    HouseholdMember ||--o{ Expense : "recorded"
    Category ||--o{ Expense : "groups"
    Category ||--o{ Budget : "limited by"
    HouseholdMember {
        string id PK
        string subject "sign-in identity"
        string displayName
    }
    Category {
        string id PK
        string name "unique, case-insensitive"
        boolean isFallback "true for Other"
    }
    Expense {
        string id PK
        int amountCents "in the paid currency"
        string currency "ISO 4217"
        date expenseDate
        string merchant
        string note
        string categoryId FK
        string paidById FK
        string recordedById FK
        string billKey "object storage key, optional"
        string billFileName
        datetime createdAt
    }
    Budget {
        string id PK
        string categoryId FK
        string effectiveMonth "YYYY-MM from which the limit applies"
        int limitLkrCents "null when the limit was removed"
    }
    ExchangeRate {
        string currency PK
        date rateDate PK
        decimal lkrPerUnit
    }
```

- A category has no limit until a Budget row exists for it; a changed limit adds a row with a later `effectiveMonth`, so past months keep the limit they had.
- LKR amounts are not stored on an expense; they are computed from `ExchangeRate`.