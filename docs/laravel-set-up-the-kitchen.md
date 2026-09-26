---
title: Set up the kitchen
path: laravel
order: 1
summary: Set up Laravel with Herd and serve your first pages. This is the kitchen that cooks each order when it arrives.
serves: Anyone who has seen a web page built in the first path
time: 25 minutes
level: Beginner
ingredients:
  - Laravel Herd, free for Windows and Mac (herd.laravel.com). It installs PHP, Composer, the Laravel installer and Node for you
  - A terminal: PowerShell on Windows, or Terminal on Mac
  - A text editor like VS Code, and a web browser
  - An internet connection, since Laravel downloads a lot the first time
searchHint: Set up Laravel with Herd and make your first routes
keywords: laravel herd php install route backend beginner setup composer laravel new test domain
---

:::analogy
The pages you made in the first path are like dishes cooked in advance and left on the counter. Everyone who visits gets the same plate.

A backend is a kitchen that cooks each order when it arrives. The visitor’s browser sends an order slip (the address it asked for), the kitchen decides what to make, and the finished page goes out. Laravel is a fully equipped kitchen: stove, fridge, knives and a recipe book already set up, so you can start cooking on day one.

Herd is like moving into that kitchen already set up. The stove is lit and the tools are in the drawers, so you skip the plumbing.
:::

## Let’s cook

### 1. Move into the kitchen

Download Herd from herd.laravel.com, run the installer, then open Herd once so it can finish setting up. It downloads a recent version of PHP and keeps a small server running quietly in the background. You’ll see its icon in the system tray on Windows, or the menu bar on Mac.

:::note Using Linux?
Herd is only for Windows and Mac. On Linux, install PHP, Composer and the Laravel installer with the install command on the Laravel website (search for “Laravel installation”), then follow the same steps. The only difference is how you open the site: run `php artisan serve` inside your project, and use `http://127.0.0.1:8000` wherever this lesson says `http://adobo-app.test`.
:::

### 2. Check your tools

Open a **new** terminal window and run these two commands:

```bash terminal
php -v
laravel --version
```

`php -v` should say 8.3 or higher, and `laravel --version` should print a version number. Both come with Herd. If a command isn’t found, close the terminal, open a new one, and make sure Herd finished its setup.

### 3. Build the kitchen

Herd keeps a special folder called `Herd` in your home folder. Anything inside it gets served automatically. Go there and create your project:

```bash Windows PowerShell
cd ~\Herd
laravel new adobo-app
```

```bash Mac Terminal
cd ~/Herd
laravel new adobo-app
```

The installer asks a few questions. Answer them like this, so you get plain Laravel and nothing extra:

:::map Question | Your answer
- Do you want to use a starter kit? | **No**
- Which testing framework do you prefer? | **PHPUnit**
- Do you want to install Laravel Boost? | **No**
- Which database will your application use? | **SQLite** (press Enter)
- Would you like to run npm install and npm run build? | **No**
:::

The questions can change a little between versions. The rule is simple: answer **No** to anything extra, like starter kits, login pages or AI tools, and press Enter for the rest. Each extra adds more packages and more code, and this lesson is about seeing how Laravel itself works. Starter kits are something for later.

### 4. Check that nothing extra came along

Open the new `adobo-app` folder in your editor, then open the file `composer.json`. Under `"require"` you should see only these three lines. The version numbers may be newer than these:

```text composer.json
"php": "^8.3",
"laravel/framework": "^13.17",
"laravel/tinker": "^3.0"
```

That’s plain Laravel: the framework, a tool for trying out code, and nothing else.

### 5. Open the doors

```bash terminal
cd adobo-app
herd open
```

Your browser opens `http://adobo-app.test` and shows Laravel’s welcome page. Your kitchen is open.

Why does that address work? Every project inside the `Herd` folder is served at `http://` plus the folder’s name plus `.test`. There’s no server to start and nothing to stop. Herd keeps the kitchen open in the background.

### 6. Look around the kitchen

You don’t need to understand everything yet. Just know where the main things live:

:::map Folder or file | What it is
- `routes/web.php` | The menu of addresses your site answers to
- `resources/views` | The plates: the pages people see
- `app` | The recipes: the code that decides what to do
- `.env` | Private settings, like the key to the pantry. Never share it
- `vendor` | Ready-made tools Laravel installed for you. Leave it alone
:::

### 7. Cook your first order

Open `routes/web.php`. A route connects an address to what the kitchen should serve. Replace the file’s contents with this:

```php routes/web.php
<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'Welcome to my adobo kitchen!';
});
```

Save it and refresh `http://adobo-app.test` in your browser. The welcome page is replaced by your sentence.

### 8. Add a second address

Add another route below the first one:

```php routes/web.php
Route::get('/about', function () {
    return 'This kitchen is run by me.';
});
```

Now visit `http://adobo-app.test/about`. Each `Route::get('/address', ...)` is one more item on your kitchen’s menu.

:::taste
Visit `http://adobo-app.test` and you should see “Welcome to my adobo kitchen!”. Visit `/about` and you should see your second sentence.

If the address doesn’t open, taste and adjust: check that Herd is running (look for its icon), and that your `adobo-app` folder is inside the `Herd` folder. If you see an error page instead, the message at the top says which line has the problem. Check that every line ends with a semicolon, and that your brackets and quotes match.
:::

:::own
- Add a `/hours` route that returns the times your kitchen is open.
- Return some HTML instead of plain text: `return '<h1>Welcome!</h1>';`
- Change the welcome sentence to something that sounds like you.
:::

## What you learned

- A backend cooks a response for each request, instead of serving the same file to everyone.
- Herd sets up PHP for you, and serves every project in its `Herd` folder at a `.test` address.
- `laravel new` builds a new project, and a route in `routes/web.php` connects an address to the code that answers it.
