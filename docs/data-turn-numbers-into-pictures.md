---
title: Turn numbers into pictures
path: data
order: 3
summary: Make charts in Google Sheets, and learn which kind of chart answers which question.
serves: Anyone who finished the previous lessons
time: 25 minutes
level: Beginner
ingredients:
  - A free Google account and a web browser
  - About 25 minutes
searchHint: Make column, line and pie charts in Google Sheets and choose the right chart type
keywords: google sheets chart column line pie graph visualise data beginner sales week
---

:::analogy
A cook looks at the week’s numbers and sees a wall of digits. A picture is different: one look, and you know that Saturday was the busiest day.

A chart is a picture of your numbers. Choosing the right kind is like choosing the right pan. Each one is good at a different job.
:::

## Let’s cook

### 1. Enter a week of sales

Create a new sheet and call it **Weekly sales**. Type these in, starting in cell A1. They show how many plates of each dish sold each day:

```text type these in
Day    Adobo    Sinigang
Mon    12       8
Tue    10       9
Wed    14       7
Thu    11       10
Fri    20       15
Sat    28       22
Sun    25       18
```

Then in cell A9 type `Total`, and in B9 type this formula. Drag it across to C9:

```sheet formula
=SUM(B2:B8)
```

Check yourself: Adobo should total **120**, and Sinigang **89**.

### 2. Compare days with a column chart

Select cells A1 to C8 (the headings and the seven days, but not the Total row). Choose **Insert > Chart**. Sheets picks a chart for you, and opens the **Chart editor** on the right.

If it isn’t already a column chart, open the **Setup** tab and change **Chart type** to **Column chart**. You now see a pair of bars for each day, one for Adobo and one for Sinigang. Column charts are best for comparing separate things side by side.

### 3. Show a trend with a line chart

Insert another chart from the same data. This time, set the chart type to **Line chart**. A line joins the days together, so your eye follows the rise and fall through the week. Line charts are best for things that change over time.

### 4. Show shares with a pie chart

A pie chart works best from a small list with one name and one number on each line. Build one next to your table. In cell E1 type `Dish`, and in F1 type `Plates`. Then fill in the rest, using formulas to pick up your totals:

```text type these in
E2: Adobo       F2: =B9
E3: Sinigang    F3: =C9
```

Select cells E1 to F3, and choose **Insert > Chart**. Set the type to **Pie chart**. You now see how the week’s plates were shared between the two dishes.

:::map Chart type | Best for
- Column chart | Comparing separate things, like sales on each day
- Line chart | Showing how something changes over time, like sales through the week
- Pie chart | Showing how a total is shared, but only for a few slices
:::

### 5. Make it clear

Click a chart, then open the **Customize** tab in the chart editor. Give it a title, like “Plates sold each day”. Under **Chart & axis titles**, add titles for the axes. A chart that explains itself needs no one standing next to it to say what it means.

To move or resize a chart, click it and drag it, or drag its corners.

:::taste
Look at the column chart. The tallest Adobo bar should be **Saturday**, at 28, followed by Sunday at 25. Wednesday should be higher than Tuesday for Adobo.

In the line chart, both lines should rise sharply from Thursday to Saturday, showing the weekend rush. In the pie chart, Adobo should have the bigger slice, at about **57%** of the plates (120 out of 209).

If a chart looks wrong, taste and adjust: click it, open the **Setup** tab, and check the data range covers the cells you meant. If the days are counted as data instead of labels, turn on **Use column A as labels**.
:::

:::own
- Change Friday’s Adobo to 40, and watch every chart update by itself.
- Try the **Stacked column chart** type, and notice what it shows that the side-by-side version doesn’t.
- Change the colours of the bars in the **Customize** tab, under **Series**.
:::

## What you learned

- A chart turns a table into a picture that can be read at a glance.
- Column charts compare, line charts show change over time, and pie charts show shares of a whole.
- Titles and labels make a chart understandable on its own.
