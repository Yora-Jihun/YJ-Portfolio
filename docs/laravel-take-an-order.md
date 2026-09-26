---
title: Take an order
path: laravel
order: 6
summary: Let a visitor add a dish with a form. Check what they send, show friendly errors, and save it to the database.
serves: Anyone who finished the previous lesson
time: 35 minutes
level: Beginner
ingredients:
  - Your adobo-app project from the previous lesson, with dishes in the database
  - Herd running, so `http://adobo-app.test` opens
  - Your text editor and web browser
searchHint: Build a Laravel form with POST, CSRF, validation, old input and flash messages
keywords: laravel form post csrf validation validate request old error flash message redirect beginner
---

:::analogy
A guest hands the waiter an order slip. A careful waiter reads it before it goes to the kitchen. Is the dish name filled in? Is the price a real number? If something is wrong, the waiter hands the slip back with a friendly note, and keeps what the guest already wrote so they don’t start over.

A form is that order slip. **Validation** is the careful reading. And a **flash message** is the little “Thank you, your order is in!” after it’s saved.
:::

## Let’s cook

### 1. Add two new routes

One address shows the empty form, and another receives it when it’s sent. Open `routes/web.php` and replace its contents:

```php routes/web.php
<?php

use App\Http\Controllers\DishController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'home')->name('home');

Route::get('/menu', [DishController::class, 'index'])->name('menu');
Route::get('/menu/create', [DishController::class, 'create'])->name('dishes.create');
Route::post('/menu', [DishController::class, 'store'])->name('dishes.store');
Route::get('/menu/{dish}', [DishController::class, 'show'])->name('dishes.show');
```

`Route::post` answers when a form is **sent**, while `Route::get` answers when a page is **opened**. Look at the order, too. `/menu/create` has to come before `/menu/{dish}`. Otherwise Laravel would think “create” is the id of a dish, and try to find it.

### 2. Teach the waiter to take orders

Replace `app/Http/Controllers/DishController.php`. It has two new methods, `create` and `store`:

```php app/Http/Controllers/DishController.php
<?php

namespace App\Http\Controllers;

use App\Models\Dish;
use Illuminate\Http\Request;

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

    public function create()
    {
        return view('create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:60'],
            'price' => ['required', 'integer', 'min:1', 'max:9999'],
        ]);

        $data['spicy'] = $request->boolean('spicy');

        $dish = Dish::create($data);

        return redirect()
            ->route('dishes.show', $dish)
            ->with('status', 'Dish added to the menu!');
    }
}
```

`store` does the careful reading. `$request->validate([...])` checks each field against its rules, so the name must be present, be text and be at most 60 characters, and the price must be a whole number from 1 to 9999. If anything fails, Laravel sends the guest straight back to the form with the errors, and the rest of the method never runs.

If everything passes, `$data` holds only the checked values. A checkbox is only sent when it’s ticked, so `$request->boolean('spicy')` turns “ticked or not” into true or false. Then the dish is saved, and the guest is sent to its page with a message.

### 3. Draw the order slip

Create `resources/views/create.blade.php`:

```blade resources/views/create.blade.php
<x-layout title="Add a dish">
    <h1>Add a dish</h1>

    <form method="POST" action="{{ route('dishes.store') }}">
        @csrf

        <p>
            <label>Name<br>
                <input type="text" name="name" value="{{ old('name') }}">
            </label>
            @error('name')
                <span class="error">{{ $message }}</span>
            @enderror
        </p>

        <p>
            <label>Price (₱)<br>
                <input type="number" name="price" value="{{ old('price') }}">
            </label>
            @error('price')
                <span class="error">{{ $message }}</span>
            @enderror
        </p>

        <p>
            <label><input type="checkbox" name="spicy" value="1"> Spicy</label>
        </p>

        <button type="submit">Add to the menu</button>
    </form>
</x-layout>
```

:::map Piece | What it does
- `method="POST"` | Sends the form’s values in the background, rather than in the address
- `@csrf` | Adds a hidden secret code that proves the form came from your own site. Without it, Laravel refuses the form with a “419 Page Expired” page
- `old('name')` | Puts back what the guest typed, if the form comes back with errors
- `@error('name') ... @enderror` | Shows the problem with that field, only when there is one
:::

We left out the browser’s own `required` checks on purpose, so you can see Laravel’s checks working. Browser checks are a nice extra, but the server’s check is the one that really counts, since anyone can skip the browser’s.

### 4. Show the message and errors nicely

Two small updates to the layout. Open `resources/views/components/layout.blade.php`. First, add these two lines inside the `<style>` block:

```css resources/views/components/layout.blade.php
.error { color: #b42318; display: block; font-size: 0.9rem; }
.notice { background: #ecfdf3; border: 1px solid #a6f4c5; border-radius: 8px; padding: 0.75rem 1rem; }
```

Then, inside `<main>`, add the flash message just above `{{ $slot }}`:

```blade resources/views/components/layout.blade.php
<main>
    @if (session('status'))
        <p class="notice">{{ session('status') }}</p>
    @endif

    {{ $slot }}
</main>
```

A “flash” message lasts for one page only. `->with('status', ...)` in the controller stored it, and `session('status')` reads it once. After that, it’s gone.

### 5. Add a way in

On the menu page, add a link to the form. Update `resources/views/menu.blade.php`:

```blade resources/views/menu.blade.php
<x-layout title="Today's menu">
    <h1>Today's menu</h1>

    @foreach ($dishes as $dish)
        <x-dish-card :dish="$dish" />
    @endforeach

    <p><a href="{{ route('dishes.create') }}">Add a dish</a></p>
</x-layout>
```

:::taste
Open `http://adobo-app.test/menu` and click “Add a dish”. First, press the button with everything empty. You should see the form again with “The name field is required.” and “The price field is required.” in red.

Now type “Kare-kare” and price 150, leave Spicy unticked, and press the button. You should land on the Kare-kare page with a green “Dish added to the menu!” note. Go back to the menu and it’s in the list. Refresh the dish page, and the note is gone.

Try a price like `abc` or `-5`. You should get a friendly error and your name should still be filled in.

If you see “419 Page Expired”, taste and adjust: the form is missing `@csrf`. If you see “Add [name] to fillable property to allow mass assignment”, check that `$fillable` in `app/Models/Dish.php` lists `name`, `price` and `spicy`.
:::

:::note Anyone can add dishes right now
There’s no login yet, so anyone who can open your site can add a dish. That’s fine while you practise on your own computer. Before putting something like this on the internet, you’d add a login. Laravel has ready-made options for that, and it’s a topic for another day.
:::

:::own
- Add a rule that the name must be at least 3 characters: `'min:3'` goes in the same list as `'max:60'`.
- Change the error message for one field. Search “Laravel custom validation messages”.
- Add a `description` column (as suggested in the last lesson) and let the form fill it in.
:::

## What you learned

- A form sends its values with `POST`, and it needs `@csrf` to prove it came from your own site.
- `$request->validate([...])` checks the input, and sends the guest back with errors when something is wrong.
- `old()`, `@error` and `->with('status', ...)` make a form feel friendly.
