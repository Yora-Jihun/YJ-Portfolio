# YJ Portfolio

A static portfolio site: plain HTML, Tailwind CSS v4 and Alpine.js. No backend.

## Structure

```
index.html  docs.html  skills.html  experience.html  blog.html  services.html
<post>.html        one page per blog post (generated from posts/*.md)
posts/             blog posts, one markdown file each (see posts/README.md)
scripts/
  build-blog.mjs   turns posts/*.md into pages, the blog list, home Guides and search
assets/
  css/app.css      compiled Tailwind (generated)
  css/fonts.css    Instrument Sans, embedded
  js/app.js        compiled Alpine + components (generated)
  images/
src/
  main.css         Tailwind entry + theme tokens
  main.js          Alpine components
  generated/       search entries for the posts (generated)
```

## Running

```sh
npm install     # first time only
npm run dev     # or: npm start
```

This rebuilds the posts, CSS and JS whenever you save and serves the site at http://localhost:5173, reloading the browser as you edit.

You can also open `index.html` directly, or serve the folder with any static server
(XAMPP, Nginx, GitHub Pages, Netlify, ...).

## Writing a blog post

Add a markdown file to `posts/`, then run `npm run build` (or keep `npm run dev` running):

```sh
posts/my-new-post.md   ->   my-new-post.html, plus its blog card, home entry and search entry
```

The fields, markdown features and special boxes are explained in [posts/README.md](posts/README.md).
Don't edit the generated `<post>.html` files or `blog.html`: the next build rewrites them.

## Editing the rest of the site

Edit the other `.html` files directly. If you add or change Tailwind classes, or edit anything in `src/`, the assets need rebuilding. `npm run dev` does this automatically; otherwise run:

```sh
npm run build        # blog + CSS + JS, one-off
npm run build:blog   # just the blog
npm run watch        # CSS + JS only, on every save
```

`assets/css/app.css`, `assets/js/app.js` and `src/generated/` are build output; don't edit them by hand.
