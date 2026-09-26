---
title: Keep your recipe notebook
path: web
order: 4
summary: Save every version of your work with Git, and share it on GitHub, like a notebook of recipes you never lose.
serves: Anyone who finished lesson 3
time: 25 minutes
level: Beginner
ingredients:
  - Your my-adobo-site folder from lesson 3
  - Git installed (free, from git-scm.com)
  - A free GitHub account (github.com)
  - A terminal: Terminal on Mac, or PowerShell or Command Prompt on Windows
searchHint: Save and share your work with Git and GitHub
keywords: git github version control commit push repository terminal beginner notebook
---

:::analogy
Every family has a recipe notebook. When you change the adobo, you don’t erase the old version. You write “v2, less vinegar” and keep both, so you can always go back.

Git is that notebook for your work. It remembers every version, with a short note about what changed. GitHub is the shared cookbook online, where you keep a copy safe and can show it to the world.
:::

## Let’s cook

Type these commands in your terminal, one line at a time, pressing Enter after each.

### 1. Check that Git is ready

```bash terminal
git --version
```

You should see a version number, like `git version 2.x`. If you see an error, install Git from git-scm.com and open a new terminal.

### 2. Tell Git who you are

Do this once. Use your own name and email:

```bash terminal
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

### 3. Start the notebook

Go into your website folder, then start a new notebook there:

```bash terminal
cd Desktop/my-adobo-site
git init
```

`git init` creates a hidden notebook inside the folder. Nothing changes on your website.

### 4. Save your first version

```bash terminal
git add .
git commit -m "My first adobo site"
```

Think of `git add .` as putting your finished dish on the counter to choose what goes in the notebook. `git commit` is writing the entry, and `-m` is your short note about it.

### 5. Change something and save again

Edit your page, for example change the heading, and save the file. Then:

```bash terminal
git add .
git commit -m "Change the heading"
git log --oneline
```

`git log --oneline` shows your notebook: one line for every version you saved, newest first.

### 6. Put it on GitHub

On github.com, choose New repository, name it `my-adobo-site`, and create it without adding any files. GitHub then shows you a web address. Use it here, with your own username:

```bash terminal
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/my-adobo-site.git
git push -u origin main
```

Git may ask you to sign in to GitHub the first time.

:::taste
Refresh your repository page on GitHub. You should see `index.html` there, along with your commit notes.

If something failed, taste and adjust: read the error message, since Git usually says what is missing, and check that the web address has your real username.
:::

:::own
- Change your page again, then save it with `git add .`, `git commit -m "..."` and `git push`.
- Write clear notes, like “Add garlic counter”, so future you understands each version.
- Ask a friend to look at your repository page.
:::

## What you learned

- Git saves every version of your work, so you can always go back.
- `git add` and `git commit` record a version, and `git push` copies it to GitHub.
- A short, clear note with each commit makes your notebook easy to read.
