# Data Model

## Metadata

### User

> A named person who uses the app and is authenticated in some way.

- Name, etc.

### Profile

> A collection of accounts, transactions, etc. owned by one or more users.

- Name, owners, etc.

### Currency

- Code
- Display symbol

### Asset

> A non-cash instrument with a value that changes over time, such as a share or a house. The value may be manually or automatically updated.

- Name
- Base currency

### Category

- Name
- Features:
  - Memo balance
  - Interest income
  - Dividend income
  - Capital acquisition
  - Capital disposal
  - Capital event fee

## Actual Finances

### Account

> A named collection of one or more holdings; usually 1:1 with an actual account held at a financial institution.

- Name
- Notes (markdown)
- Account group
- Features:
  - ISA
  - Pension

### Account Group

> A named grouping of accounts, only used for front-end display.

- Name
- Sort order

### Holding

> A balance of cash in a single currency or assets of a single type held within an account.

- Account ID
- Type: cash or investment
- For cash:
  - Currency
- For assets:
  - Asset ID

### Transaction

- Date
- Budget date (optional)
- Holding ID
- Payee
- Amount
- Category
- Notes
- For assets:
  - Unit acquisition/disposal cost (depending on whether amount is +ve or -ve)

## Budgeting

### Budget

- Name
- Amount
- Categories
- Date range

### Envelope

- Name
- Categories

### Envelope Allocation

- Category
- Envelope
- Start date
- End date

### Envelope Transfer

- From envelope
- To envelope
- Date
- Amount

# Reporting / Visualisations

- Total/per-account value over time, accounting for historic currency/asset values
  - Profit/loss, based on price of assets when purchased
- Envelope balance over time
- Tax-year summaries
  - ISA contributions
  - Pension contributions
  - Interest income
  - Dividend income
  - Capital gains disposals

# Implementation Thoughts

- Don't implement currency updates in here, expose an endpoint for a separate service to push in new values - avoids a tight dependency between this and whatever API the data comes from.
