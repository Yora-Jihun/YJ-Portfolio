# YJ Portfolio

A static portfolio site: plain HTML, Tailwind CSS v4 and Alpine.js. No backend.

## Structure

```
index.html  docs.html  skills.html  experience.html  blog.html  services.html
assets/
  css/app.css      compiled Tailwind (generated)
  css/fonts.css    Instrument Sans, embedded
  js/app.js        compiled Alpine + components (generated)
  images/
src/
  main.css         Tailwind entry + theme tokens
  main.js          Alpine components
```

## Running

```sh
npm install     # first time only
npm run dev     # or: npm start
```

This rebuilds the CSS/JS whenever you save and serves the site at http://localhost:5173, reloading the browser as you edit.

You can also open `index.html` directly, or serve the folder with any static server
(XAMPP, Nginx, GitHub Pages, Netlify, ...).

## Editing

Edit the `.html` files directly. If you add or change Tailwind classes, or edit anything in `src/`, the assets need rebuilding. `npm run dev` does this automatically; otherwise run:

```sh
npm run build   # one-off build, or: npm run watch
```

`assets/css/app.css` and `assets/js/app.js` are build output; don't edit them by hand.
