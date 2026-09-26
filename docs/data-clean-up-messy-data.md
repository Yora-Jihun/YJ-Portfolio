---
title: Clean up messy data
path: data
order: 6
summary: Real data is messy. Fix spaces and capital letters, remove duplicates, and split one column into two.
serves: Anyone who finished the previous lessons
time: 30 minutes
level: Beginner
ingredients:
  - A free Google account and a web browser
  - About 30 minutes
searchHint: Clean messy data in Google Sheets with TRIM, PROPER, remove duplicates and SPLIT
keywords: google sheets clean data trim proper split remove duplicates len messy spaces beginner
---

:::analogy
Before cooking, you wash the vegetables and pick out the bad ones. Nobody wants to skip that step, but everyone who has skipped it has regretted it.

Data needs the same washing. When several people type in a list, the same thing comes out written a dozen ways: extra spaces, ALL CAPS, the same guest twice. Clean it first, and every count and chart afterwards is right.
:::

## Let’s cook

### 1. Enter a messy guest list

Create a new sheet named **Guests**. Type these in, starting in cell A1. Type the spaces exactly as shown: there are two spaces before `maria santos`, and one after the second `Maria Santos`:

```text type these in
Name
  maria santos
JOSE REYES
Maria Santos 
ana cruz
jose reyes
```

To a person, that’s clearly three guests. To a sheet, it’s five different pieces of text.

### 2. Find the hidden spaces

Spaces are invisible, so let’s measure them. In B1 type `Length`, and in B2 type this, then drag it down to B6:

```sheet formula
=LEN(A2)
```

`LEN` counts the characters in a cell. `maria santos` has 12 letters, so you’d expect 12. But the first row should show **14**, because of the two extra spaces at the front.

### 3. Wash the names

In C1 type `Clean name`, and in C2 type this formula, then drag it down to C6:

```sheet formula
=PROPER(TRIM(A2))
```

:::map Function | What it does
- `TRIM(A2)` | Removes spaces at the start and end, and squeezes any doubled spaces in the middle into one
- `PROPER(...)` | Gives every word a capital letter at the start, and makes the rest lowercase
- `PROPER(TRIM(A2))` | Does both, working from the inside out: trim first, then tidy the capitals
:::

Column C should now read: Maria Santos, Jose Reyes, Maria Santos, Ana Cruz, Jose Reyes.

### 4. Remove the duplicates

Remove duplicates works best on plain text, not formulas, so first turn the clean names into plain text. Select C2 to C6, choose **Edit > Copy**, then click cell D2 and choose **Edit > Paste special > Values only**. Type `Unique guest` in D1.

Now select D1 to D6 and choose **Data > Data cleanup > Remove duplicates**. Tick **Data has header row**, and press **Remove duplicates**. Sheets tells you how many rows it removed.

Sheets also has **Data > Data cleanup > Trim whitespace**, which does the trimming part in one click without a formula. Use whichever you find easier.

### 5. Split one column into two

Sometimes two facts are stuck together in one cell. In cell F1, type `Name and city`, and enter these below it:

```text type these in
Maria Santos, Cebu
Jose Reyes, Davao
Ana Cruz, Manila
```

Click cell G2 and type this:

```sheet formula
=SPLIT(F2, ", ", FALSE)
```

The name lands in G2 and the city in H2, spilling into the cell next to it. Drag the formula down for the other rows. The `FALSE` is important. Without it, Sheets would cut the text at every comma and at every space, and would break “Maria Santos” in two.

:::taste
Check your answers. The Length column should show 14, 10, 13, 8 and 10. The Clean name column should show three different names, with Maria Santos and Jose Reyes each appearing twice. After removing duplicates, the Unique guest column should have **3** names left.

The split should give you Maria Santos and Cebu, Jose Reyes and Davao, and Ana Cruz and Manila, in two neat columns.

If the Length numbers are smaller than these, taste and adjust: Sheets may have removed the spaces as you typed. That’s fine. Carry on with the rest, since the capital letters still need fixing.
:::

:::own
- Add a phone number column with numbers written in different styles, like `0917 123 4567` and `09171234567`, and try to make them all look the same. Search “Google Sheets SUBSTITUTE” for a helpful tool.
- Use `=COUNTA(UNIQUE(C2:C6))` to count unique guests with a formula instead of the menu.
- Copy the names into a new tab, and use `=SORT(...)` to put them in alphabetical order.
:::

## What you learned

- Messy data hides in invisible spaces and mixed capital letters, and `LEN` helps you find them.
- `TRIM` and `PROPER` clean up text, and Remove duplicates keeps one of each.
- `SPLIT` turns one column into two, and needs `FALSE` when the separator is more than one character.
- Cleaning first means every count, chart and lookup afterwards can be trusted.
