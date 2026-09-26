---
title: Your first website
path: web
order: 1
summary: Make a real web page from nothing. HTML is where every website starts, like laying out your ingredients before you cook.
serves: Anyone
time: 15 minutes
level: Beginner
ingredients:
  - A computer (Windows, Mac or Linux)
  - A text editor. Notepad works, and VS Code is nicer (it’s free)
  - A web browser like Chrome, Edge, Firefox or Safari
  - About 15 minutes
searchHint: Make a web page with HTML, no experience needed
keywords: html first website web page beginner tags heading paragraph list link index.html
---

:::analogy
Before you cook adobo, you lay out everything on the counter: the chicken, soy sauce, vinegar, black pepper, sugar, bay leaf, garlic, onion, water and oil. You’re not cooking yet. You’re only deciding what goes in the pot.

HTML works the same way. It’s the list of what is on your page: a heading, some text, a list, a link. There are no colours or movement yet, just the ingredients.
:::

## Let’s cook

### 1. Set up your kitchen

Create a new folder on your Desktop called `my-adobo-site`. Everything for your website will live in this folder, like keeping all your ingredients on one counter.

### 2. Create your first file

Open your text editor, create a new file, and save it inside the folder with the name `index.html`.

The name matters. `index.html` is the front door of a website, the file a browser looks for first. Check that it didn’t become `index.html.txt`. On Windows, open File Explorer, choose View, and turn on “File name extensions” to see the full name.

### 3. Add the base recipe

Copy this into the file and save it:

```html index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My Adobo Site</title>
  </head>
  <body>
    <h1>Hello, I made a website!</h1>
    <p>This is my first web page.</p>
  </body>
</html>
```

Here is what each part does:

- `<head>` is the recipe card. It holds information about the page that visitors don’t see on the page itself, like its title on the browser tab.
- `<body>` is the plate. Everything inside it is what people see.
- `<h1>` is a big heading, and `<p>` is a paragraph.
- Most tags come in pairs. `<p>` opens a paragraph, and `</p>` (with the slash) closes it.

### 4. Open it in your browser

Find `index.html` in your folder and double-click it. It opens in your browser, and you’ll see your heading and paragraph. That’s a website, and you made it.

### 5. Add more ingredients

Replace the inside of `<body>` with this, save, and refresh the browser (press F5):

```html index.html
<body>
  <h1>Hello, I made a website!</h1>
  <p>This is my first web page.</p>

  <h2>My favourite dishes</h2>
  <ul>
    <li>Adobo</li>
    <li>Sinigang</li>
    <li>Kare-kare</li>
  </ul>

  <p>Read the <a href="https://en.wikipedia.org/wiki/Adobo">story of adobo</a>.</p>
</body>
```

`<h2>` is a smaller heading. `<ul>` is a bulleted list, and each `<li>` is one item in it. `<a href="...">` makes a link.

:::taste
Save the file and refresh your browser. You should see your heading, the paragraph, a bulleted list of three dishes, and a link you can click.

If something looks wrong, taste and adjust: check that every opening tag has a closing tag, and that you saved the file before refreshing.
:::

:::own
- Change the heading to your own name.
- Swap the three dishes for your own favourites.
- Add another `<h2>` and a paragraph about a hobby you love.
:::

## What you learned

- A website starts as a plain file called `index.html`.
- HTML describes what is on the page, using tags like `<h1>`, `<p>`, `<ul>` and `<a>`.
- You can change the file, save it, and refresh the browser to see the result.
