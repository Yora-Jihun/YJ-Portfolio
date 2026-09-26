---
title: Look things up
path: data
order: 5
summary: Keep your prices in one place, and let orders find them with XLOOKUP. Change a price once, and everything updates.
serves: Anyone who finished the previous lessons
time: 30 minutes
level: Beginner
ingredients:
  - A free Google account and a web browser
  - About 30 minutes
searchHint: Use XLOOKUP and a dropdown list in Google Sheets to look up prices from another sheet
keywords: google sheets xlookup vlookup lookup price list dropdown data validation tabs beginner
---

:::analogy
A busy restaurant doesn’t write the price of every dish on every order slip. There’s one menu with the prices on it, and the slip only names the dish. When it’s time to add up the bill, someone looks the dish up in the menu.

That way, if the price of adobo changes, you fix it in one place, the menu, and every bill afterwards is right. A lookup is that: find a name in one list, and bring back a value from the same row.
:::

## Let’s cook

### 1. Make the menu

Create a new sheet and name the file **Adobo orders**. At the bottom, rename the first tab **Menu** (right-click the tab and choose **Rename**). Type these in from cell A1:

```text type these in
Dish             Price
Adobo            120
Sinigang         110
Kare-kare        150
Bicol Express    150
```

### 2. Add a tab for orders

Click the **+** at the bottom left to add a new tab, and name it **Orders**. Type these in from cell A1. Leave the Price and Total columns empty for now:

```text type these in
Dish             Qty    Price    Total
Sinigang         2
Adobo            1
Kare-kare        3
Adobo            4
Bicol Express    2
```

### 3. Look up the price

Click cell **C2** on the Orders tab and type this formula:

```sheet formula
=XLOOKUP(A2, Menu!A2:A5, Menu!B2:B5)
```

Press Enter. It should show 110, the price of Sinigang. Drag the formula down to C6.

Read it as a sentence: “Look for the dish in A2, inside the Dish column of the Menu tab, and bring back the matching value from the Price column.” The `Menu!` part means “on the Menu tab”.

:::map Part | What it means
- `A2` | What you’re looking for, the dish on this order
- `Menu!A2:A5` | Where to look for it, the Dish column on the Menu tab
- `Menu!B2:B5` | What to bring back from the same row, the price
:::

### 4. Add up each line

In D2 type this, and drag it down to D6:

```sheet formula
=B2*C2
```

Then in A8 type `Grand total`, and in D8 type `=SUM(D2:D6)`.

### 5. Stop typing mistakes with a dropdown

A lookup only works if the dish is spelled exactly like it is on the menu. Let’s make typing mistakes impossible. Select cells A2 to A6 on the Orders tab, then choose **Data > Data validation**. Click **Add rule**, set the criteria to **Dropdown (from a range)**, and type `Menu!A2:A5` as the range. Save it.

Each dish cell now shows a small arrow. Click it, and you can only choose a dish from the menu.

### 6. Change a price in one place

Go to the Menu tab, and change Adobo from 120 to 130. Go back to Orders. Both Adobo lines should have updated on their own.

:::taste
Check your answers. The prices in column C should read 110, 120, 150, 120 and 150. The totals in column D should read 220, 120, 450, 480 and 300, and the grand total should be **1570**.

After you change Adobo to 130, the two Adobo lines should show totals of 130 and 520, and the grand total should become 1620.

If a lookup shows `#N/A`, taste and adjust: that means the dish wasn’t found. Check the spelling, and look for a stray space at the end. If `XLOOKUP` isn’t recognised for you, `=VLOOKUP(A2, Menu!A2:B5, 2, FALSE)` does the same job. It’s the older way, and it means “find A2 in the first column of Menu!A2:B5, and bring back the value from column 2”.
:::

:::own
- Type a dish that isn’t on the menu, like `Halo-halo`, in a cell where the dropdown is off. Add a fourth part to your formula, like `XLOOKUP(A2, Menu!A2:A5, Menu!B2:B5, "Not on menu")`, to see the message.
- Add a Category column to the menu (main dish or soup), and bring it into the Orders tab with a second lookup.
- Add a discount, like 10%, in one cell, and use it in the Total formula.
:::

## What you learned

- A lookup finds a value in one list, and brings back the matching value from the same row.
- Keeping prices in one place means you only ever change them once.
- A dropdown list stops typing mistakes before they happen.
