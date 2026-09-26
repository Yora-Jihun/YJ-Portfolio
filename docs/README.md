# Writing a lesson

Each lesson is one markdown file in this folder. Save it, then run `npm run build`
(or leave `npm run dev` running, which rebuilds on every save). The build creates the lesson page
(`first-website.md` becomes `lesson-first-website.html`), adds it to the sidebar, the previous/next links,
the Docs home, the home page and search.

`index.md` is the Docs home page (title, intro and the "kitchen map"). It also lists the **paths**: groups of lessons,
like "Start cooking" or "Cook with electricity". Each path is one line in its front matter:

```
paths:
  - web: Start cooking | Build your first web page, step by step.
  - laravel: The kitchen behind the scenes | Meet Laravel and serve your first pages.
```

The word before the colon (`web`, `laravel`) is the path's id, and the order of the lines is the order on the site.
A path with no lessons yet stays hidden until you add one.

## The top of the file (front matter)

```
---
title: Your first website
path: web
order: 1
summary: One sentence that says what the learner will make.
serves: Anyone
time: 15 minutes
level: Beginner
ingredients:
  - A computer
  - A text editor
searchHint: Short line shown in search results
keywords: html web page beginner
---
```

| Field | Needed | What it does |
|---|---|---|
| `title` | yes | Lesson title |
| `path` | yes | The path this lesson belongs to: an id from the `paths:` list in `index.md` |
| `order` | yes | Whole number. Lessons show in this order inside their path (1, 2, 3...) |
| `summary` | yes | Sentence under the title and on the cards |
| `serves`, `time`, `level` | yes | The three facts on the recipe card |
| `ingredients` | no | What the learner needs first, shown as a checklist on the recipe card |
| `searchHint`, `keywords` | no | Text shown in search, and extra words that should find the lesson |

## The writing: a recipe

A lesson works well in this shape:

1. **In the kitchen**: a cooking comparison for the big idea (`:::analogy`).
2. **Let's cook**: numbered steps as `###` headings, each with a short explanation and, when needed, a code block.
3. **Taste test**: how to check it worked (`:::taste`).
4. **Make it your own**: small changes to try (`:::own`).
5. **What you learned**: a short bullet list.

```
:::analogy
Before you cook adobo, you lay out the ingredients...
:::

## Let's cook

### 1. Set up your kitchen

Create a folder called `my-adobo-site`.

```html index.html
<h1>Hello</h1>
```

:::taste
Refresh the page. You should see...
:::

:::own
- Change the heading to your name.
- Add another paragraph.
:::

## What you learned

- One short point per bullet.
```

- A code block starts with three backticks and a language, and can have a file name after it
  (` ```html index.html `). It gets a dark box with a **Copy** button.
- `` `inline code` `` in backticks looks like code inside a sentence.
- `:::map Left heading | Right heading` followed by lines like `- left | right` makes a two-column table
  (used for the kitchen map, and for "class | what it does" lists).
- A title after the box name changes its label: `:::analogy A pinch of salt`.
- Boxes can hold paragraphs, bullet lists and code blocks. A code block marked `text` is shown as plain output, without a Copy button.
- The last lesson of a path links on to the first lesson of the next path.

## Tips for beginner-friendly writing

- Explain every new word the first time it appears.
- One idea per step. If a step needs two actions, make it two steps.
- Keep the cooking comparison light, so it helps and never gets in the way of the steps.
- Test every step yourself on a clean folder before publishing.

## Good to know

- Don't edit the generated `docs.html` or `lesson-*.html` files: the next build overwrites them. Edit the `.md` file.
- Delete a `.md` file and the next build removes its page, sidebar entry, card and search entry.
- If something is wrong (for example a missing `summary`), the build stops and says which file and what to fix.
- Look at `first-website.md` for an example that uses every feature.
