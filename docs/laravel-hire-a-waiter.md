---
title: Hire a waiter
path: laravel
order: 3
summary: Move the cooking out of your routes and into a controller. The route takes the order, and the waiter carries it to the kitchen.
serves: Anyone who finished the previous lesson
time: 25 minutes
level: Beginner
ingredients:
  - Your adobo-app project, open in your editor
  - Herd running, so `http://adobo-app.test` opens
  - A terminal open inside the adobo-app folder
searchHint: Move route code into a Laravel controller, name your routes and add a page for one dish
keywords: laravel controller artisan make:controller named routes route parameter 404 beginner
---

:::analogy
In the last lesson, your route did everything. It took the order, went to the kitchen, cooked the dish and carried it out. That’s fine for a tiny café, but a busy restaurant has a host at the door, a waiter and a cook, each with one job.

A route is the host: it looks at the order slip (the address) and decides who handles it. A **controller** is the waiter: a small class that knows how to prepare each kind of order. Your routes stay short and readable, and the real work lives in one tidy place.
:::

## Let’s cook

### 1. Hire the waiter

Laravel can write the starting file for you. In your terminal, inside the `adobo-app` folder, run:

```bash terminal
php artisan make:controller DishController
```

`artisan` is Laravel’s helper for tasks like this one. It created a new file at `app/Http/Controllers/DishController.php`. Open it. It’s an empty class waiting for work.

### 2. Give the waiter two jobs

Replace the file’s contents with this. The dishes move here from the route, and the waiter gets two jobs: show the whole menu, and show one dish:

```php app/Http/Controllers/DishController.php
<?php

namespace App\Http\Controllers;

class DishController extends Controller
{
    private function dishes(): array
    {
        return [
            ['id' => 1, 'name' => 'Adobo', 'price' => 120, 'spicy' => false],
            ['id' => 2, 'name' => 'Sinigang', 'price' => 110, 'spicy' => false],
            ['id' => 3, 'name' => 'Bicol Express', 'price' => 150, 'spicy' => true],
        ];
    }

    public function index()
    {
        return view('menu', ['dishes' => $this->dishes()]);
    }

    public function show(int $id)
    {
        $dish = collect($this->dishes())->firstWhere('id', $id);

        abort_if($dish === null, 404);

        return view('dish', ['dish' => $dish]);
    }
}
```

Each function that answers an order is called a method. `index` shows the whole menu, and `show` shows one dish. `abort_if($dish === null, 404)` says: if there’s no such dish, send back Laravel’s “not found” page instead of an error.

### 3. Point the routes at the waiter

Now `routes/web.php` gets much shorter. Replace its contents:

```php routes/web.php
<?php

use App\Http\Controllers\DishController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return '<a href="/menu">See the menu</a>';
})->name('home');

Route::get('/menu', [DishController::class, 'index'])->name('menu');

Route::get('/menu/{id}', [DishController::class, 'show'])
    ->whereNumber('id')
    ->name('dishes.show');
```

:::map Piece | What it does
- `[DishController::class, 'index']` | “When this address is asked for, send it to the index method of DishController”
- `{id}` | A blank in the address. `/menu/2` fills it with 2 and passes it to the method
- `->whereNumber('id')` | Only accept numbers here, so `/menu/soup` is a “not found”
- `->name('dishes.show')` | Gives the route a name, so other pages can point to it without typing the address
:::

### 4. Update the menu board

Names are useful because addresses change over time, but names rarely do. Open `resources/views/menu.blade.php` and make each dish a link, using `route()`:

```blade resources/views/menu.blade.php
<h1>Today's menu</h1>

<ul>
    @foreach ($dishes as $dish)
        <li>
            <a href="{{ route('dishes.show', $dish['id']) }}">{{ $dish['name'] }}</a>: ₱{{ $dish['price'] }}
            @if ($dish['spicy'])
                (spicy)
            @endif
        </li>
    @endforeach
</ul>
```

### 5. Add a page for one dish

Create a new file, `resources/views/dish.blade.php`:

```blade resources/views/dish.blade.php
<h1>{{ $dish['name'] }}</h1>

<p>Price: ₱{{ $dish['price'] }}</p>

@if ($dish['spicy'])
    <p>This one is spicy.</p>
@endif

<p><a href="{{ route('menu') }}">Back to the menu</a></p>
```

### 6. See your whole menu of routes

Laravel can list every address your site answers to. Try this in the terminal:

```bash terminal
php artisan route:list
```

You’ll see `/`, `/menu` and `/menu/{id}`, plus a few of Laravel’s own routes. It’s a handy way to check that nothing is missing.

:::taste
Visit `http://adobo-app.test/menu`. You should see the same three dishes as before, but each name is now a link. Click Sinigang, and you should land on `/menu/2` with its price and a “Back to the menu” link.

Try `http://adobo-app.test/menu/99`, which doesn’t exist. You should see a 404 “Not found” page. That’s the waiter politely saying there’s no such dish.

If you see “Class DishController not found”, taste and adjust: check the `use App\Http\Controllers\DishController;` line at the top of `routes/web.php`.
:::

:::own
- Add a fourth dish to the `dishes()` method and see it appear on the menu and get its own page.
- Add a method called `about` to the controller, and a route that points to it.
- Change the text “See the menu” on the home page, and notice that no other page needs to change.
:::

## What you learned

- A controller is a class that answers orders, so routes can stay short.
- Named routes with `route('name')` mean you never repeat an address by hand.
- A route can have blanks like `{id}`, and Laravel passes what fills the blank to your method.
