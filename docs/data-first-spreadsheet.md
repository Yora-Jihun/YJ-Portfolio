---
title: Your first spreadsheet
path: data
order: 1
summary: Turn a grocery list into a spreadsheet that does the counting for you, using Google Sheets.
serves: Anyone
time: 20 minutes
level: Beginner
ingredients:
  - A free Google account
  - A web browser
  - About 20 minutes
searchHint: Make your first Google Sheets spreadsheet with SUM, AVERAGE and MAX
keywords: google sheets spreadsheet formula sum average max beginner data grocery budget
---

:::analogy
Before you go to the market for adobo, you write down what you need and roughly what it will cost. Then you add it all up, to know how much money to bring.

A spreadsheet is that same list, but it does the adding for you and never makes a mistake. Change one number, and every total updates by itself.
:::

## Let’s cook

### 1. Open a blank sheet

Go to sheets.google.com and start a **Blank spreadsheet**. Click the title at the top left and rename it **Adobo grocery list**.

### 2. Type in your list

Here is everything a simple adobo needs. The prices are examples, rounded from typical retail prices in the Philippines in 2026. Real prices change by place and by week, so feel free to swap in the ones you see. Type these into the cells, starting in cell A1. Each line is one row, and each word or number goes in the next column across:

```text type these in
Item                 Quantity    Price each
Chicken (per kg)     1           180
Soy sauce (350 mL)   1           22
Vinegar (350 mL)     1           19
Black pepper (pack)  1           10
Sugar (per kg)       0.25        88
Bay leaf (pack)      1           10
Garlic (per kg)      0.1         160
Onion (per kg)       0.2         140
Water                1           0
Oil (per liter)      0.2         90
```

Quantity means how many of the unit in brackets you buy. So `0.1` garlic is a tenth of a kilo, about two bulbs, and `0.25` sugar is a quarter of a kilo. Numbers with decimals are fine in a spreadsheet.

Water comes from the tap, so its price is 0. A zero is a perfectly good number too.

Then add a new heading, **Total**, in cell D1.

### 3. Let the sheet do the maths

Click cell **D2** and type this formula. A formula always starts with an equals sign:

```sheet formula
=B2*C2
```

Press Enter. D2 now shows 180, which is 1 kilo of chicken times 180. Click D2 again, and drag the small blue square in its bottom right corner down to D11. The formula copies itself to every row, and each row uses its own numbers.

### 4. Add up the whole shop

Below your list, type these labels in column A, and these formulas in column D:

```text type these in
A12: Grand total          D12: =SUM(D2:D11)
A13: Most expensive item  D13: =MAX(D2:D11)
A14: Average per item     D14: =AVERAGE(D2:D11)
```

:::map Formula | What it does
- `=SUM(D2:D11)` | Adds up every number from D2 down to D11
- `=MAX(D2:D11)` | Finds the biggest number in that range
- `=AVERAGE(D2:D11)` | Works out the average of those numbers
:::

`D2:D11` is called a range, and it means “from D2 to D11”.

### 5. Make it look like money

Select the Price each and Total columns, then choose **Format > Number > Currency**. Sheets adds a currency symbol, and you can change how many decimals show from the same menu.

:::taste
Check your answers. The grand total should be **325**, the most expensive item **180**, and the average per item **32.5**. The sugar row should show 22, because a quarter kilo at 88 is 22.

Now change the quantity of chicken from 1 to 2. The totals should update by themselves, and the grand total should become 505. If a number is wrong, taste and adjust: click the cell and check the formula for a typo.
:::

:::own
- Add a row for a side dish like rice, and extend the ranges so the totals include it.
- Add a Category column, like meat, sauce, spice and vegetable.
- Type a budget in a cell, and add a formula that shows how much money is left after the grand total.
:::

## What you learned

- A spreadsheet is a grid of cells, and a formula starts with `=`.
- `SUM`, `MAX` and `AVERAGE` work on a range like `D2:D7`.
- When you change an input, every formula that depends on it updates automatically.
