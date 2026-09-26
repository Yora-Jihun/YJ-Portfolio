---
title: Let the sheet decide
path: data
order: 4
summary: Use IF to make a sheet tell you what to do, and colour the cells that need attention.
serves: Anyone who finished the previous lessons
time: 30 minutes
level: Beginner
ingredients:
  - A free Google account and a web browser
  - About 30 minutes
searchHint: Use the IF function, nested IF and conditional formatting in Google Sheets
keywords: google sheets if function nested if conditional formatting countif inventory stock beginner decisions
---

:::analogy
Before opening, the cook checks the pantry: “Do we have enough chicken for today? If not, buy more.” It’s a small decision, made over and over for each ingredient.

An `IF` formula is that decision. You describe the question, and what to say for a “yes” and a “no”. The sheet then answers for every row, in an instant, and never forgets to check.
:::

## Let’s cook

### 1. Enter the pantry list

Create a new sheet and name it **Pantry check**. Type these in from cell A1. In stock is what you have, and Needed is what today’s cooking requires:

```text type these in
Item                   In stock    Needed
Chicken (kg)           1           2
Soy sauce (bottles)    2           1
Vinegar (bottles)      0           1
Black pepper (packs)   1           1
Sugar (kg)             1           0.5
Bay leaf (packs)       0           1
Garlic (heads)         3           2
Onion (pieces)         4           3
Oil (bottles)          1           1
```

### 2. Your first IF

In cell D1 type the heading `Status`. Then in D2 type this formula and drag it down to D10:

```sheet formula
=IF(B2<C2, "Buy more", "OK")
```

Read it like a sentence: “If the stock is less than what’s needed, say Buy more, otherwise say OK.” An `IF` always has three parts, separated by commas: the question, the answer for yes, and the answer for no.

### 3. Add a third answer

Two answers aren’t always enough. Having exactly the amount you need is worth a warning, since it’s the last one. Replace the formula in D2 with this, and drag it down again:

```sheet formula
=IF(B2<C2, "Buy more", IF(B2=C2, "Last one", "OK"))
```

This puts one `IF` inside another. If the first question is “no”, the sheet asks the second question, before giving up and saying OK.

### 4. Work out how much to buy

In E1 type `To buy`. In E2 type this and drag it down to E10:

```sheet formula
=MAX(C2-B2, 0)
```

`C2-B2` is how many you’re short. `MAX(..., 0)` stops it from ever going below zero, so a pantry with plenty of something says 0, not a negative number.

### 5. Count the problems

Below the table, type these in, in cells A12 and B12, and A13 and B13:

```text type these in
A12: Items to buy       B12: =COUNTIF(D2:D10, "Buy more")
A13: Units to buy       B13: =SUM(E2:E10)
```

### 6. Colour the ones that need attention

Select the cells D2 to D10. Choose **Format > Conditional formatting**. Under **Format rules**, set the condition to **Text is exactly**, type `Buy more`, and choose a red fill under **Formatting style**. Click **Done**.

To add a second rule, click **Add another rule**. Use **Text is exactly** `Last one` with a yellow fill.

The colours now follow the words. If the data changes, the colours update too.

:::map Idea | What it does
- `=IF(test, yes, no)` | Chooses between two answers, depending on a question
- A nested `IF` | Asks a second question when the first one is a “no”
- `=COUNTIF(range, "text")` | Counts how many cells match
- Conditional formatting | Colours cells automatically when they match a rule
:::

:::taste
Check your answers. The Status column should read: Buy more, OK, Buy more, Last one, OK, Buy more, OK, OK, Last one. The **Items to buy** cell should show **3**, and **Units to buy** should show **3**.

Now change the chicken’s In stock from 1 to 3. The status should switch to OK, the colour should disappear, and the counts should drop to 2 and 2.

If a formula shows an error, taste and adjust: check that the quotation marks are straight, every opening bracket has a closing one, and the commas are in the right places. Some regions need semicolons instead of commas between the parts.
:::

:::own
- Add a new item, like rice, and extend the ranges so it’s counted.
- Change the second answer to say “Low” when the stock is at most one more than needed. Hint: use `B2<=C2+1`.
- Add a Price column, and a formula that says how much money the shopping will cost.
:::

## What you learned

- `IF` lets a sheet make a decision for every row, and nesting adds more choices.
- `COUNTIF` and `SUM` turn the results into a summary.
- Conditional formatting makes the important cells stand out without you looking for them.
