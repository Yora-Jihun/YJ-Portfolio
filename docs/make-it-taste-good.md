---
title: Make it taste good
path: web
order: 2
summary: Add colour, size and space with Tailwind CSS. Same ingredients, very different dish.
serves: Anyone who finished lesson 1
time: 20 minutes
level: Beginner
ingredients:
  - Your my-adobo-site folder from lesson 1
  - An internet connection (Tailwind loads from the web in this lesson)
  - Your text editor and web browser
searchHint: Style your page with Tailwind CSS classes
keywords: tailwind css style colors classes padding beginner design seasoning
---

:::analogy
Two cooks can start with the same chicken and end up with very different adobo. The difference is the seasoning: more vinegar, more garlic, a little sugar, a pinch of pepper.

CSS is the seasoning of a web page. Your HTML stays the same, and the styling changes how it looks. Tailwind gives you a spice jar for every small thing: one for colour, one for size, one for space. You sprinkle the ones you want.
:::

## Let’s cook

### 1. Bring in the spice rack

Open `index.html` and add this line just before `</head>`:

```html index.html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

This loads Tailwind straight from the internet, which is the quickest way to try it. (Real projects build their own CSS file, but this is perfect for learning.)

### 2. Season your heading

Find your `<h1>` and add a `class`, like this:

```html index.html
<h1 class="text-4xl font-bold text-orange-600">Hello, I made a website!</h1>
```

Save and refresh. The heading is now big, bold and orange. Each word inside `class` is one spice jar.

### 3. Season the whole page

Add classes to the `<body>`, the list and the link:

```html index.html
<body class="mx-auto max-w-xl p-8 text-gray-800">
  <h1 class="text-4xl font-bold text-orange-600">Hello, I made a website!</h1>
  <p class="mt-2 text-lg">This is my first web page.</p>

  <h2 class="mt-8 text-2xl font-semibold">My favourite dishes</h2>
  <ul class="mt-3 list-disc pl-6">
    <li>Adobo</li>
    <li>Sinigang</li>
    <li>Kare-kare</li>
  </ul>

  <p class="mt-6">Read the <a class="text-orange-600 underline" href="https://en.wikipedia.org/wiki/Adobo">story of adobo</a>.</p>
</body>
```

Save and refresh. The page is now centred, has breathing room, and looks much more finished.

### 4. What did those spices do?

:::map Class | What it does
- `text-4xl` | Makes the text big
- `font-bold` | Makes the text bold
- `text-orange-600` | Colours the text orange (a shade from light 100 to dark 900)
- `mt-8` | Adds space above (margin top)
- `p-8` | Adds space inside all four sides (padding)
- `max-w-xl` | Stops the page getting too wide
- `mx-auto` | Centres the page left to right
:::

:::taste
Refresh the page. You should see an orange, bold heading, a centred column of text, and spaced-out sections.

If nothing changed, check that the `<script>` line is inside `<head>`, and that you are online. If a colour looks off, taste and adjust: check for typos in the class name.
:::

:::own
- Change `orange` to `emerald`, `rose` or `sky` and see how the mood changes.
- Try `text-2xl` and `text-6xl` on the heading.
- Add a button: `<button class="mt-6 rounded-full bg-orange-600 px-5 py-2 text-white">Order now</button>`
:::

## What you learned

- CSS controls how a page looks, and it doesn’t change the content.
- Tailwind lets you style by adding small classes like `text-4xl` or `p-8`.
- You can experiment freely: change a class, refresh, and taste.
