# Writing a blog post

Each post is one markdown file in this folder. The file name becomes the page address:
`posts/my-first-robot.md` becomes `my-first-robot.html`.

After saving, run `npm run build` (or leave `npm run dev` running, which rebuilds on every save).
That creates the article page, adds it to the blog list, to the home page (five newest) and to search.

## The top of the file (front matter)

```
---
title: My First Robot
date: 2025-03-14
category: Robotics
tags: [Robotics, AI, Hardware]
lead: One sentence shown under the title and in previews.
gradient: from-sky-500 via-blue-600 to-indigo-700
icon: cube
searchHint: Short line shown in search results
keywords: robot arduino esp32 voice recognition
---
```

| Field | Needed | What it does |
|---|---|---|
| `title` | yes | Page title |
| `date` | yes | `2025-03-14`, or just `2025-03` when you don't want a day. Newest posts show first |
| `category` | yes | Small label above the title |
| `lead` | yes | Intro sentence under the title |
| `gradient` | yes | Cover colours, three Tailwind colour classes (`from-... via-... to-...`) |
| `icon` | yes | One of: `bolt` `users` `cube` `heart` `bulb` `flask` `clock` `trophy` |
| `tags` | no | Chips shown on the page, like `[Robotics, AI]` |
| `excerpt` | no | Shorter text for cards and the page description (defaults to `lead`) |
| `searchHint`, `keywords` | no | Text shown in search and extra words that should find the post |
| `order` | no | Breaks ties when two posts share a date (higher shows first) |
| `toc` | no | `true` adds a sticky "In this article" list that follows the reader |
| `numbered` | no | `true` numbers the `##` sections (01, 02...) when `toc` is on |
| `facts` | no | The "At a glance" card, see below |
| `page: false` | no | A card on the blog list only, with no article yet. Add `image: file.jpg` (from `assets/images/blog/`) for a photo cover |

A quick facts card goes in the front matter as a list:

```
facts:
  - Model: EPD Penta Copter
  - Rotors: Five
```

## The writing

Plain markdown. Don't add a `#` title, since it comes from `title`.

```
Normal paragraphs are the body text.

## A section heading

- A bullet list becomes a check-mark box
- **Bold** and *italic* and [links](docs.html) work

> A quote on its own becomes the highlighted closing quote.

![Alt text](assets/images/blog/photo.jpg "Caption under the photo")
```

If an image file doesn't exist yet, the build skips it and tells you, so nothing breaks.
Add `{-}` at the end of a heading to leave it unnumbered in a numbered post: `## The big idea {-}`.

### Special boxes

```
:::note Box title
Text inside a highlighted box.

[A link at the end](docs.html)
:::

:::tip
Becomes a "Try this." callout.
:::

:::steps
1. **Plan**: Text for card one.
2. **Build**: Text for card two.
3. **Review**: Text for card three.
:::
```

## Good to know

- Don't edit the generated `.html` files: the next build overwrites them. Edit the `.md` file.
- Delete a `.md` file and the next build removes its page, its card and its search entry.
- If something is wrong (for example an unknown icon), the build stops and says which file and what to fix.
- Look at `how-to-learn-fast.md` for an example that uses every feature.
