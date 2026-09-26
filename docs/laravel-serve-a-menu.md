---
title: Serve a menu
path: laravel
order: 2
summary: Send data to a page and show it with Blade. The kitchen fills in a menu board from a list of dishes.
serves: Anyone who finished the previous lesson
time: 25 minutes
level: Beginner
ingredients:
  - Your adobo-app project from the previous lesson
  - Herd running, so `http://adobo-app.test` opens
  - Your text editor and web browser
searchHint: Show a list of data with Blade views, loops and conditions
keywords: laravel blade view foreach if data template route beginner menu
---

:::analogy
A restaurant’s menu board has empty spaces: the dish, the price, a little flame for spicy ones. The staff don’t redraw the board for every dish. They keep one board and fill in the spaces from the list.

A Blade view is that board. It’s an HTML page with marked spaces. The route is the cook who hands over the list of dishes, and Blade fills the spaces in.
:::

## Let’s cook

### 1. Write the list of dishes

Open `routes/web.php` and replace its contents with this:

```php routes/web.php
<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return '<a href="/menu">See the menu</a>';
});

Route::get('/menu', function () {
    $dishes = [
        ['name' => 'Adobo', 'price' => 120, 'spicy' => false],
        ['name' => 'Sinigang', 'price' => 110, 'spicy' => false],
        ['name' => 'Bicol Express', 'price' => 150, 'spicy' => true],
    ];

    return view('menu', ['dishes' => $dishes]);
});
```

`$dishes` is a list of three dishes, and each dish has a name, a price and whether it’s spicy. `view('menu', ...)` hands the list to a view called `menu`.

### 2. Draw the menu board

Create a new file at `resources/views/menu.blade.php` with this inside:

```blade resources/views/menu.blade.php
<h1>Today's menu</h1>

<ul>
    @foreach ($dishes as $dish)
        <li>
            {{ $dish['name'] }}: ₱{{ $dish['price'] }}
            @if ($dish['spicy'])
                (spicy)
            @endif
        </li>
    @endforeach
</ul>
```

The `.blade.php` ending tells Laravel this is a Blade view.

### 3. Read the board

:::map Blade | What it does
- `{{ $dish['name'] }}` | Prints a value, and does it safely
- `@foreach ... @endforeach` | Repeats a piece of HTML once for each dish
- `@if ... @endif` | Shows something only when a condition is true
:::

“Safely” matters. If a dish name ever contained HTML, `{{ }}` would show it as plain text instead of running it, which protects your page from being tampered with.

### 4. Open the menu

Visit `http://adobo-app.test` and click the link, or go straight to `http://adobo-app.test/menu`. On Linux, use `http://127.0.0.1:8000` instead, with `php artisan serve` running.

:::taste
You should see the heading “Today’s menu” and three lines: Adobo: ₱120, Sinigang: ₱110, and Bicol Express: ₱150 with “(spicy)” after it.

If you see an error like “View [menu] not found”, taste and adjust: check the file is named exactly `menu.blade.php` and sits inside `resources/views`.
:::

:::own
- Add a fourth dish to the list, and watch it appear without touching the view.
- Change a price, then refresh.
- Add a `'vegetarian' => true` field, and show “(vegetarian)” with another `@if`.
:::

## What you learned

- A route can send data to a view with `view('name', [...])`.
- Blade turns one template into many lines, using `{{ }}`, `@foreach` and `@if`.
- Keeping the data in the route and the layout in the view keeps each part easy to change.
