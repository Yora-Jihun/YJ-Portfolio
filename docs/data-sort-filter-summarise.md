---
title: Sort, filter and summarise
path: data
order: 2
summary: Find answers in a table of sales. Sort it, filter it, and build a summary in a few clicks.
serves: Anyone who finished the previous lesson
time: 25 minutes
level: Beginner
ingredients:
  - A free Google account and a web browser
  - Google Sheets (you’ll make a new sheet)
  - About 25 minutes
searchHint: Sort, filter, SUMIF, COUNTIF and pivot tables in Google Sheets
keywords: google sheets sort filter sumif countif pivot table summary data analysis beginner sales
---

:::analogy
After a busy day, a cook wants answers. Which dish sold the most? How many plates of adobo went out? What did we earn in total?

The answers are already hiding in the day’s order slips. Sorting puts the slips in order, filtering pulls out just the ones you care about, and a summary adds them up by dish, like sorting the receipts into piles.
:::

## Let’s cook

### 1. Enter the day’s orders

Create a new sheet and name it **Adobo sales**. Type these in, starting in cell A1. The last column is a formula, so type `=B2*C2` in D2 and drag it down to D9, as in the last lesson:

```text type these in
Dish        Quantity    Price each    Total
Adobo       3           120           =B2*C2
Sinigang    2           110           =B3*C3
Adobo       5           120           =B4*C4
Kare-kare   1           150           =B5*C5
Sinigang    4           110           =B6*C6
Adobo       2           120           =B7*C7
Kare-kare   3           150           =B8*C8
Sinigang    1           110           =B9*C9
```

The Total column should show 360, 220, 600, 150, 440, 240, 450 and 110.

### 2. Sort the table

Select the whole table, from A1 to D9. Choose **Data > Sort range > Advanced range sorting options**, tick **Data has header row**, sort by **Total**, and choose **Z to A**. The biggest sale is now at the top.

### 3. Filter the table

Click any cell in the table and choose **Data > Create a filter**. A small funnel appears in each heading. Click the funnel in the **Dish** column, untick everything except **Adobo**, and press OK. Only the adobo rows remain. To bring everything back, click the funnel again, choose **Select all**, and press OK.

### 4. Ask a question with a formula

In cell F1, type this to add up the money made from adobo:

```sheet formula
=SUMIF(A2:A9, "Adobo", D2:D9)
```

And in F2, this to count how many adobo orders there were:

```sheet formula
=COUNTIF(A2:A9, "Adobo")
```

:::map Formula | What it does
- `=SUMIF(A2:A9, "Adobo", D2:D9)` | Looks in A2 to A9 for “Adobo”, and adds up the matching Totals
- `=COUNTIF(A2:A9, "Adobo")` | Counts how many cells in A2 to A9 say “Adobo”
:::

If Sheets shows an error, your region may want a semicolon instead of a comma between the parts, for example `=COUNTIF(A2:A9; "Adobo")`.

### 5. Build a summary

Select the whole table again. Choose **Insert > Pivot table**, and put it on a new sheet. In the panel on the right, next to **Rows** click **Add** and pick **Dish**. Next to **Values** click **Add**, pick **Total**, and make sure it says **SUM**.

:::taste
Check your answers. The formula in F1 should show **1200**, and F2 should show **3**.

The pivot table should list Adobo 1200, Kare-kare 600 and Sinigang 770, with a grand total of **2570**. If your numbers differ, taste and adjust: check that the Total column formulas reach all the way down to row 9.
:::

:::own
- Add a few more orders, and watch the pivot table update after you refresh it.
- Change the SUMIF to look for “Sinigang”, and check it against the pivot table.
- Select the pivot table and choose **Insert > Chart** to turn the numbers into a picture.
:::

## What you learned

- Sorting and filtering change how you look at the same data, without changing the data.
- `SUMIF` and `COUNTIF` answer a question about one group.
- A pivot table summarises every group at once.
