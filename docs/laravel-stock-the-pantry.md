---
title: Stock the pantry
path: laravel
order: 5
summary: Move your dishes out of the code and into a real database, using a migration, a model and a seeder.
serves: Anyone who finished the previous lesson
time: 35 minutes
level: Beginner
ingredients:
  - Your adobo-app project from the previous lesson
  - Herd running, and a terminal open inside the adobo-app folder
  - The plain install from the first lesson, which already uses a simple SQLite database
searchHint: Create a database table with a Laravel migration, model, seeder and Eloquent
keywords: laravel database sqlite migration model eloquent seeder tinker artisan migrate beginner
---

:::analogy
So far your dishes have been written on a sticky note inside the controller. Change a price, and you have to open the code. Add a dish, and you have to edit the file again.

A **database** is the pantry: shelves with labels, where things are stored properly and can be found again. A **table** is one shelf, like “dishes”. A **migration** is the instruction for building that shelf, a **model** is how the cook reaches for things on it, and a **seeder** is the first delivery that fills it.
:::

## Let’s cook

### 1. Build a shelf

Laravel can make the model and its migration together. In your terminal, run:

```bash terminal
php artisan make:model Dish -m
```

The `-m` means “also make a migration”. Two new files appeared: `app/Models/Dish.php` and a file in `database/migrations` whose name ends in `_create_dishes_table.php`.

### 2. Label the shelf

Open the migration file. Find the `up` method, and replace it with this, so the shelf has columns for the name, price and spiciness:

```php database/migrations/…_create_dishes_table.php
public function up(): void
{
    Schema::create('dishes', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->unsignedInteger('price');
        $table->boolean('spicy')->default(false);
        $table->timestamps();
    });
}
```

:::map Line | What it makes
- `$table->id()` | A number that’s different for every dish, added for you
- `$table->string('name')` | A column for short text
- `$table->unsignedInteger('price')` | A whole number that can’t be negative
- `$table->boolean('spicy')->default(false)` | Yes or no, and “no” if we don’t say
- `$table->timestamps()` | When the dish was added and last changed, filled in automatically
:::

Now run the migration, which builds the shelf:

```bash terminal
php artisan migrate
```

You’ll see a line saying the dishes table was created. If Laravel ever asks whether to create the database file, say yes.

### 3. Tell the model what it may fill

Open `app/Models/Dish.php` and replace its contents:

```php app/Models/Dish.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dish extends Model
{
    protected $fillable = ['name', 'price', 'spicy'];

    protected function casts(): array
    {
        return ['spicy' => 'boolean'];
    }
}
```

`$fillable` lists the columns that are safe to fill in from outside. It’s a safety rule: nothing else can be written by accident. `casts` makes sure `spicy` always comes back as true or false, and not as 1 or 0.

The model is named `Dish`, and Laravel automatically looks for a table called `dishes`. This is called a convention: names line up, so there’s less to set up.

### 4. Make the first delivery

Create a seeder, which is a small file that fills the table:

```bash terminal
php artisan make:seeder DishSeeder
```

Open `database/seeders/DishSeeder.php` and replace its contents:

```php database/seeders/DishSeeder.php
<?php

namespace Database\Seeders;

use App\Models\Dish;
use Illuminate\Database\Seeder;

class DishSeeder extends Seeder
{
    public function run(): void
    {
        Dish::create(['name' => 'Adobo', 'price' => 120, 'spicy' => false]);
        Dish::create(['name' => 'Sinigang', 'price' => 110, 'spicy' => false]);
        Dish::create(['name' => 'Bicol Express', 'price' => 150, 'spicy' => true]);
    }
}
```

Now run it:

```bash terminal
php artisan db:seed --class=DishSeeder
```

### 5. Peek into the pantry

Tinker is a place where you can type PHP and see the answer straight away. Open it:

```bash terminal
php artisan tinker
```

Then try these one at a time. After each, press Enter:

```php tinker
App\Models\Dish::count()
App\Models\Dish::where('spicy', true)->get()
App\Models\Dish::find(2)->name
```

You should see 3, then the one spicy dish, then “Sinigang”. Type `exit` to leave Tinker.

:::note Filled it twice by mistake?
Running the seeder again adds the dishes again. To wipe the database and start clean, run `php artisan migrate:fresh` and then the seeder command from step 4. It’s safe here, since this is only your practice project.
:::

### 6. Cook from the pantry

Now the controller asks the database instead of a hard-coded list. Replace `app/Http/Controllers/DishController.php`:

```php app/Http/Controllers/DishController.php
<?php

namespace App\Http\Controllers;

use App\Models\Dish;

class DishController extends Controller
{
    public function index()
    {
        return view('menu', ['dishes' => Dish::all()]);
    }

    public function show(Dish $dish)
    {
        return view('dish', ['dish' => $dish]);
    }
}
```

Look at `show(Dish $dish)`. When the route has `{dish}` in it, Laravel sees the `Dish` type, takes the number from the address, finds that row and hands you the finished dish. If there’s no such row, it shows a 404 for you. This is called route model binding, and it replaces the search and `abort_if` we wrote by hand.

The route’s blank has to match the name, so update `routes/web.php`:

```php routes/web.php
<?php

use App\Http\Controllers\DishController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'home')->name('home');

Route::get('/menu', [DishController::class, 'index'])->name('menu');

Route::get('/menu/{dish}', [DishController::class, 'show'])->name('dishes.show');
```

### 7. Update the views

A row from the database is an object, so we write `$dish->name` instead of `$dish['name']`. Update the card, `resources/views/components/dish-card.blade.php`:

```blade resources/views/components/dish-card.blade.php
@props(['dish'])

<div class="dish">
    <a href="{{ route('dishes.show', $dish) }}">{{ $dish->name }}</a>: ₱{{ $dish->price }}
    @if ($dish->spicy)
        (spicy)
    @endif
</div>
```

And the one-dish page, `resources/views/dish.blade.php`:

```blade resources/views/dish.blade.php
<x-layout :title="$dish->name">
    <h1>{{ $dish->name }}</h1>

    <p>Price: ₱{{ $dish->price }}</p>

    @if ($dish->spicy)
        <p>This one is spicy.</p>
    @endif

    <p><a href="{{ route('menu') }}">Back to the menu</a></p>
</x-layout>
```

`route('dishes.show', $dish)` works with a whole dish. Laravel picks out its id for the address. The `menu.blade.php` file doesn’t need to change.

:::taste
Visit `http://adobo-app.test/menu`. It should look exactly the same as before, with three dishes. The difference is that the data now lives in the database.

To prove it, open Tinker and run `App\Models\Dish::find(1)->update(['price' => 130])`, then refresh the menu. Adobo should now cost ₱130, and you never touched the code.

If you see “no such table: dishes”, taste and adjust: run `php artisan migrate` again and check that it says the dishes table was created. If the menu is empty, run the seeder command from step 4.
:::

:::own
- Add a fourth dish with Tinker, like `App\Models\Dish::create(['name' => 'Kare-kare', 'price' => 150, 'spicy' => false])`, and refresh the menu.
- Add a `description` column by making a second migration with `php artisan make:migration add_description_to_dishes_table`, and show it on the dish page.
- Sort the menu by price, by using `Dish::orderBy('price')->get()` in `index`.
:::

## What you learned

- A migration builds a table, and `php artisan migrate` runs it.
- A model like `Dish` is how your code reads and writes one table, with methods like `all()`, `find()` and `create()`.
- A seeder fills a table with starting data, and route model binding turns an address into a ready-made dish.
