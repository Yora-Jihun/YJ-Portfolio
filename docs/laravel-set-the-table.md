---
title: Set the table
path: laravel
order: 4
summary: Give every page the same look with a layout, and reuse small pieces with Blade components.
serves: Anyone who finished the previous lesson
time: 30 minutes
level: Beginner
ingredients:
  - Your adobo-app project from the previous lesson
  - Herd running, so `http://adobo-app.test` opens
  - Your text editor and web browser
searchHint: Make a shared Blade layout and reusable components in Laravel
keywords: laravel blade layout component slot props x-layout reuse template beginner css
---

:::analogy
A good restaurant sets every table the same way: the same cloth, the same cutlery, the same little menu stand. The only thing that changes is the dish that arrives.

Right now each of your pages is a bare plate, with no cloth and no cutlery. A Blade **layout** is the table setting. You write it once, and every page is served on it. A Blade **component** is one reusable piece on the table, like a menu card, that you can place wherever you need it.
:::

## Let’s cook

### 1. Make the table setting

Blade components live in a folder called `resources/views/components`. Create it, then create a new file inside it named `layout.blade.php`:

```blade resources/views/components/layout.blade.php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'Adobo Kitchen' }}</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; color: #222; }
        nav a { margin-right: 1rem; }
        .dish { border: 1px solid #ddd; border-radius: 12px; padding: 1rem; margin: 0.75rem 0; }
    </style>
</head>
<body>
    <nav>
        <a href="{{ route('home') }}">Home</a>
        <a href="{{ route('menu') }}">Menu</a>
    </nav>

    <main>
        {{ $slot }}
    </main>
</body>
</html>
```

Two things are new here. `{{ $slot }}` is the empty space where each page’s own content is placed. `{{ $title ?? 'Adobo Kitchen' }}` shows the page’s title, or “Adobo Kitchen” if the page didn’t give one.

The file name matters. `layout.blade.php` inside `components` becomes a tag you can use anywhere: `<x-layout>`.

### 2. Serve a page on the table

Rewrite the menu view so that it sits inside the layout. Replace `resources/views/menu.blade.php`:

```blade resources/views/menu.blade.php
<x-layout title="Today's menu">
    <h1>Today's menu</h1>

    @foreach ($dishes as $dish)
        <x-dish-card :dish="$dish" />
    @endforeach
</x-layout>
```

`title="Today's menu"` is passed in as `$title`. Everything between `<x-layout>` and `</x-layout>` becomes `$slot`. And `<x-dish-card>` is a component we haven’t made yet, so let’s make it.

### 3. Make a reusable menu card

Create `resources/views/components/dish-card.blade.php`:

```blade resources/views/components/dish-card.blade.php
@props(['dish'])

<div class="dish">
    <a href="{{ route('dishes.show', $dish['id']) }}">{{ $dish['name'] }}</a>: ₱{{ $dish['price'] }}
    @if ($dish['spicy'])
        (spicy)
    @endif
</div>
```

`@props(['dish'])` lists what this component expects to be handed. The colon in `:dish="$dish"` means “pass in the PHP value”. Without the colon, Blade would pass the text `$dish` instead.

### 4. Update the other pages

Now the one-dish page. Replace `resources/views/dish.blade.php`:

```blade resources/views/dish.blade.php
<x-layout :title="$dish['name']">
    <h1>{{ $dish['name'] }}</h1>

    <p>Price: ₱{{ $dish['price'] }}</p>

    @if ($dish['spicy'])
        <p>This one is spicy.</p>
    @endif

    <p><a href="{{ route('menu') }}">Back to the menu</a></p>
</x-layout>
```

And give the home page a real view too. Create `resources/views/home.blade.php`:

```blade resources/views/home.blade.php
<x-layout title="Adobo Kitchen">
    <h1>Welcome to my adobo kitchen!</h1>
    <p>Fresh from the pot, every day. <a href="{{ route('menu') }}">See the menu</a>.</p>
</x-layout>
```

In `routes/web.php`, replace the home route with a shortcut. `Route::view` is for pages that only need to show a view:

```php routes/web.php
<?php

use App\Http\Controllers\DishController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'home')->name('home');

Route::get('/menu', [DishController::class, 'index'])->name('menu');

Route::get('/menu/{id}', [DishController::class, 'show'])
    ->whereNumber('id')
    ->name('dishes.show');
```

:::taste
Visit `http://adobo-app.test`. You should see the navigation bar at the top with Home and Menu, and the welcome message under it. Click Menu, and each dish should sit in its own rounded card. Click a dish, and the navigation bar should still be there.

The browser tab should now say the page’s title, like “Today’s menu”.

If you see “Unable to locate a class or view for component”, taste and adjust: the file must be inside `resources/views/components` and named exactly `layout.blade.php` or `dish-card.blade.php`.
:::

:::own
- Add a footer to `layout.blade.php`, and watch it appear on every page at once.
- Change the colours in the `<style>` block, like the card border or the text colour.
- Add a third link to the navigation bar, like an About page.
:::

## What you learned

- A layout component wraps every page, so the shared parts are written once.
- `{{ $slot }}` is where a page’s own content goes, and attributes like `title="..."` arrive as variables.
- Small components like `<x-dish-card>` keep repeated pieces in one place.
