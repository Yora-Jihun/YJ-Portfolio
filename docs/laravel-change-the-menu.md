---
title: Change the menu
path: laravel
order: 7
summary: Finish your menu app. Edit a dish, remove one, and tidy the code so the add and edit forms share the same fields.
serves: Anyone who finished the previous lesson
time: 40 minutes
level: Beginner
ingredients:
  - Your adobo-app project from the previous lesson, where you can add a dish
  - Herd running, so `http://adobo-app.test` opens
  - Your text editor and web browser
searchHint: Finish a Laravel CRUD app with edit, update and delete routes and a shared form component
keywords: laravel crud edit update delete destroy put method spoofing component refactor route list beginner
---

:::analogy
Menus change. Prices go up, a dish gets a new name, and sometimes a dish sells out for good. A restaurant that can only add dishes, and never fix or remove them, would soon have a very confusing menu.

Creating, reading, updating and deleting are the four things almost every app does with its data. You can already **create** and **read**. Today you add **update** and **delete**, and that makes a complete little app.
:::

## Let’s cook

### 1. Share the order slip

The add form and the edit form need the same fields. Instead of writing them twice, put them in one component. Create `resources/views/components/dish-form.blade.php`:

```blade resources/views/components/dish-form.blade.php
@props(['action', 'method' => 'POST', 'dish' => null])

<form method="POST" action="{{ $action }}">
    @csrf
    @if ($method !== 'POST')
        @method($method)
    @endif

    <p>
        <label>Name<br>
            <input type="text" name="name" value="{{ old('name', $dish?->name) }}">
        </label>
        @error('name')
            <span class="error">{{ $message }}</span>
        @enderror
    </p>

    <p>
        <label>Price (₱)<br>
            <input type="number" name="price" value="{{ old('price', $dish?->price) }}">
        </label>
        @error('price')
            <span class="error">{{ $message }}</span>
        @enderror
    </p>

    <p>
        <label><input type="checkbox" name="spicy" value="1" @checked($dish?->spicy)> Spicy</label>
    </p>

    <button type="submit">Save</button>
</form>
```

Two ideas are new. The `@props` line gives some values a default: if no `dish` is passed in, it’s empty, which is what the add form needs. And `$dish?->name` means “the dish’s name, or nothing if there’s no dish”. That way the same fields work for both a new dish and an existing one.

HTML forms can only send `GET` or `POST`. To send an update, Laravel uses a trick called method spoofing: the form still sends `POST`, but `@method('PUT')` adds a hidden note saying “treat this as a PUT”.

Now the add page becomes very short. Replace `resources/views/create.blade.php`:

```blade resources/views/create.blade.php
<x-layout title="Add a dish">
    <h1>Add a dish</h1>

    <x-dish-form :action="route('dishes.store')" />
</x-layout>
```

### 2. Add the edit page

Create `resources/views/edit.blade.php`:

```blade resources/views/edit.blade.php
<x-layout title="Edit dish">
    <h1>Edit {{ $dish->name }}</h1>

    <x-dish-form :action="route('dishes.update', $dish)" method="PUT" :dish="$dish" />
</x-layout>
```

### 3. Add a way to edit and remove

Update the dish page, `resources/views/dish.blade.php`, with an Edit link and a Remove button:

```blade resources/views/dish.blade.php
<x-layout :title="$dish->name">
    <h1>{{ $dish->name }}</h1>

    <p>Price: ₱{{ $dish->price }}</p>

    @if ($dish->spicy)
        <p>This one is spicy.</p>
    @endif

    <p>
        <a href="{{ route('dishes.edit', $dish) }}">Edit</a>
        &middot;
        <a href="{{ route('menu') }}">Back to the menu</a>
    </p>

    <form method="POST" action="{{ route('dishes.destroy', $dish) }}"
          onsubmit="return confirm('Remove this dish from the menu?')">
        @csrf
        @method('DELETE')
        <button type="submit">Remove from the menu</button>
    </form>
</x-layout>
```

Removing is a form, and not a plain link, on purpose. A link can be opened by anything that follows links, like a browser preloading pages. A form button only runs when a person presses it. The `confirm(...)` line asks “are you sure?” first.

### 4. Add the routes

Open `routes/web.php` and replace its contents. There are three new routes at the end:

```php routes/web.php
<?php

use App\Http\Controllers\DishController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'home')->name('home');

Route::get('/menu', [DishController::class, 'index'])->name('menu');
Route::get('/menu/create', [DishController::class, 'create'])->name('dishes.create');
Route::post('/menu', [DishController::class, 'store'])->name('dishes.store');
Route::get('/menu/{dish}', [DishController::class, 'show'])->name('dishes.show');
Route::get('/menu/{dish}/edit', [DishController::class, 'edit'])->name('dishes.edit');
Route::put('/menu/{dish}', [DishController::class, 'update'])->name('dishes.update');
Route::delete('/menu/{dish}', [DishController::class, 'destroy'])->name('dishes.destroy');
```

Notice that `/menu/{dish}` appears three times, and only the method (`get`, `put`, `delete`) tells them apart. The same address can mean different things depending on what the guest is doing with it.

### 5. Finish the waiter’s jobs

Replace `app/Http/Controllers/DishController.php` with the final version. Adding and editing need the same checks, so they now live in one small method that both use:

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
        $dish = Dish::create($this->validated($request));

        return redirect()
            ->route('dishes.show', $dish)
            ->with('status', 'Dish added to the menu!');
    }

    public function edit(Dish $dish)
    {
        return view('edit', ['dish' => $dish]);
    }

    public function update(Request $request, Dish $dish)
    {
        $dish->update($this->validated($request));

        return redirect()
            ->route('dishes.show', $dish)
            ->with('status', 'Dish updated.');
    }

    public function destroy(Dish $dish)
    {
        $dish->delete();

        return redirect()
            ->route('menu')
            ->with('status', 'Dish removed from the menu.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:60'],
            'price' => ['required', 'integer', 'min:1', 'max:9999'],
        ]);

        $data['spicy'] = $request->boolean('spicy');

        return $data;
    }
}
```

Moving repeated code into one place like this is called refactoring, and it’s something developers do all the time. The app behaves the same, but there’s now only one place to change a rule.

### 6. Look at the whole menu of routes

Run this in the terminal to see everything your app now answers to:

```bash terminal
php artisan route:list
```

You should see all seven of your routes, from `/` to the delete route. Laravel also has a shortcut, `Route::resource`, that creates this same set of routes with one line. Now you know what it’s doing for you.

:::taste
Open the menu and click a dish, like Adobo. Click **Edit**. The form should be filled in with the dish’s name, price and spicy box. Change the price to 125 and press Save. You should land on the dish page with a green “Dish updated.” note, showing ₱125.

Now empty the name and press Save. You should see the error, and nothing should change in the database.

Add a test dish from the menu page, then open it and press **Remove from the menu**. A box should ask if you’re sure. Say yes, and you should be back on the menu with “Dish removed from the menu.” and the dish gone.

If you see “The GET method is not supported for route…”, taste and adjust: the form is missing its `@method('PUT')` or `@method('DELETE')`, or you visited the update address by typing it in the browser.
:::

:::own
- Change the Remove button’s question in the `confirm(...)` line to something with more personality.
- Add a `description` column with a new migration, and let the forms and the dish page use it.
- Show the number of dishes on the menu page, using `$dishes->count()`.
:::

## What you learned

- Almost every app creates, reads, updates and deletes data, and you’ve now built all four.
- A form can send `PUT` and `DELETE` with `@method(...)`, and a destructive action belongs in a form, not a link.
- Sharing a component and one validation method means each change happens in only one place.

## Where to go next

You now have a small, complete Laravel app: routes, controllers, views, a database and forms. From here, good next topics are user login, relationships between tables (like dishes and categories), and putting an app on the internet. Each one builds on what you just made.
