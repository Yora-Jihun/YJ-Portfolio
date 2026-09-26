---
title: Bring it to life
path: web
order: 3
summary: Make your page react to clicks with Alpine.js. This is the heat that makes the pot start to simmer.
serves: Anyone who finished lesson 2
time: 20 minutes
level: Beginner
ingredients:
  - Your my-adobo-site folder from lesson 2
  - An internet connection (Alpine loads from the web in this lesson)
  - Your text editor and web browser
searchHint: Add clicks and toggles to a page with Alpine.js
keywords: alpine javascript interaction click button counter toggle x-data beginner
---

:::analogy
A pot of adobo sitting on the counter doesn’t change. Put it on the fire and it starts to bubble, the smell changes, and the sauce thickens.

JavaScript is the heat of a web page. Without it, a page just sits there. With it, the page can react when someone clicks, types or scrolls. Alpine.js is a small, friendly way to add that heat, and you write it right inside your HTML.
:::

## Let’s cook

### 1. Light the stove

Add this line inside `<head>`, next to the Tailwind line:

```html index.html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

That’s all it takes to switch Alpine on for your page.

### 2. Add a garlic counter

Put this inside your `<body>`, below the last paragraph:

```html index.html
<div x-data="{ garlic: 1 }" class="mt-8 rounded-2xl bg-orange-50 p-6">
  <p class="text-lg">Cloves of garlic: <strong x-text="garlic"></strong></p>
  <button @click="garlic++" class="mt-3 rounded-full bg-orange-600 px-5 py-2 text-white">
    Add garlic
  </button>
</div>
```

Save and refresh, then click the button. The number goes up each time. That’s your page reacting.

### 3. How does it work?

:::map Alpine says | In the kitchen
- `x-data="{ garlic: 1 }"` | The pot’s memory: it remembers there is 1 clove of garlic
- `x-text="garlic"` | Show what’s in the pot right now
- `@click="garlic++"` | When someone clicks, add one more clove
:::

### 4. Show and hide the recipe

Add a second block below the counter:

```html index.html
<div x-data="{ open: false }" class="mt-6">
  <button @click="open = !open" class="rounded-full border border-orange-600 px-5 py-2 text-orange-600">
    Show the ingredients
  </button>

  <ul x-show="open" class="mt-3 list-disc pl-6">
    <li>Chicken</li>
    <li>Soy sauce</li>
    <li>Vinegar</li>
    <li>Black pepper</li>
    <li>Sugar</li>
    <li>Bay leaf</li>
    <li>Garlic</li>
    <li>Onion</li>
    <li>Water</li>
    <li>Oil</li>
  </ul>
</div>
```

Here `open = !open` flips between true and false each click, and `x-show="open"` shows the list only when it’s true.

:::taste
Refresh and click both buttons. “Add garlic” should raise the number every time, and “Show the ingredients” should open and close the list.

If nothing happens, check the Alpine `<script>` line is inside `<head>`, and look for a missing quote or bracket, like a missing lid on the pot.
:::

:::own
- Add a second button that removes garlic: `@click="if (garlic > 0) garlic--"`
- Change the counter to count spoons of sugar instead.
- Make a “Show more” button for a longer paragraph.
:::

## What you learned

- JavaScript makes a page react, and Alpine lets you write it right in your HTML.
- `x-data` holds the values, `x-text` shows them, and `@click` runs something when clicked.
- `x-show` shows or hides part of the page.
