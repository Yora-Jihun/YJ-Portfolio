---
title: Meet Gemini
path: chatbot
order: 3
summary: Get a free Gemini API key, keep it safe, and ask Google’s AI your first question from Python.
serves: Anyone who finished the previous lesson
time: 25 minutes
level: Beginner
ingredients:
  - Python 3.10 or newer, a text editor and a terminal
  - A Google account, to get a free API key
  - Your adobo-bot folder from the earlier lessons
  - An internet connection
searchHint: Get a Gemini API key and make your first Gemini API call in Python
keywords: gemini api key google ai studio python genai dotenv env secret first call ai chatbot beginner
---

:::analogy
So far your bot only knows the answers you wrote down, like a waiter who memorised a small menu card. Ask anything else, and they shrug.

Gemini is like calling a very well-read chef on the phone. You describe your question, the chef thinks about it, and answers in fresh words. To make the call you need a phone number, and that’s what an **API key** is: a secret code that says “this call is from me”. You keep it private, the same way you’d keep the key to your restaurant.
:::

## Let’s cook

### 1. Get your API key

Go to aistudio.google.com/apikey and sign in with your Google account. Choose **Create API key**, and copy the key it shows. Google offers a free tier, which is plenty for learning. Limits and details can change, so read the page you see when you sign up.

Treat the key like a password. Anyone who has it can use your quota, so never post it in a chat, a screenshot or a public GitHub project.

### 2. Install the two tools

In your terminal, run this once:

```bash terminal
python -m pip install -U google-genai python-dotenv
```

`google-genai` is Google’s official Python package for talking to Gemini. `python-dotenv` reads secrets from a file, which we’ll use in the next step. On Mac and Linux, you may need `python3` instead of `python`.

### 3. Keep the key in a secret file

Never paste a key straight into your code. Instead, in your `adobo-bot` folder, create a file named exactly `.env`, with a dot at the start and nothing before it. Put this inside, using your own key:

```text .env
GEMINI_API_KEY=paste-your-key-here
```

Now tell Git to ignore that file. If your folder doesn’t have a `.gitignore` file yet, create one, and add this line:

```text .gitignore
.env
```

That way, even if you save your project to GitHub someday, the secret stays on your computer.

### 4. Make your first call

Create a file called `hello_gemini.py`:

```python hello_gemini.py
import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

if not os.getenv("GEMINI_API_KEY"):
    raise SystemExit("No API key found. Check that your .env file is in this folder.")

client = genai.Client()

interaction = client.interactions.create(
    model="gemini-3.8-flash",
    input="In one sentence, why does vinegar make adobo taste tangy?",
)

print(interaction.output_text)
```

Run it:

```bash terminal
python hello_gemini.py
```

After a second or two, you should see a sentence written by Gemini.

:::map Code | In the kitchen
- `load_dotenv()` | Opens the secret drawer and reads your key from `.env`
- `genai.Client()` | Picks up the phone. It finds `GEMINI_API_KEY` by itself
- `model="gemini-3.8-flash"` | Which chef you’re calling. “Flash” models are quick and light
- `input="..."` | Your question
- `interaction.output_text` | The chef’s answer, as plain text
:::

Model names change as Google releases new ones. If Python says your model isn’t found, look at the current list at ai.google.dev/gemini-api/docs/models, and swap the name in that one line.

:::taste
You should see one clear sentence about acid, like vinegar’s sourness, balancing the salty soy sauce and rich chicken. Run it again and the wording will be a little different. That’s normal: Gemini writes each answer fresh, so it won’t match word for word.

If something goes wrong, taste and adjust:

- “No API key found”: the `.env` file is in the wrong folder, or it’s named `.env.txt`. In Windows, turn on “File name extensions” in File Explorer to check.
- An error about an invalid or missing key: recopy the key from AI Studio, with no spaces or quotes around it.
- “No module named google”: the install in step 2 didn’t finish. Run it again, and make sure you use the same `python` for both.
- An error about too many requests or quota: you’re calling too fast for the free tier. Wait a minute and try again.
:::

:::own
- Change the question in `input`. Ask for a joke, or how to make garlic rice.
- Ask it to answer in a different style, like “as a pirate”, then run it again.
- Print the whole `interaction` and look at what else comes back with the answer. Search “Gemini API interactions” to learn what the parts mean.
:::

## What you learned

- An API lets your program ask another service for something, and an API key proves the request is yours.
- Secrets belong in a `.env` file that Git ignores, never inside your code.
- `client.interactions.create(...)` sends a question to Gemini, and `output_text` is the answer.
