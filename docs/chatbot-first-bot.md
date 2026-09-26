---
title: Your first chatbot
path: chatbot
order: 1
summary: Write a small chatbot in Python that answers questions about adobo. No AI needed yet, only rules.
serves: Anyone
time: 20 minutes
level: Beginner
ingredients:
  - Python 3 installed (free, from python.org)
  - A text editor like VS Code
  - A terminal: Terminal on Mac, or PowerShell or Command Prompt on Windows
searchHint: Build a simple chatbot in Python with if and else rules
keywords: chatbot python bot input while loop if elif else keywords beginner rules
---

:::analogy
A good waiter listens to what you say, notices a keyword like “vinegar” or “garlic”, and answers with something they already know. They aren’t making up new dishes. They’re following what they were taught.

Your first chatbot is that waiter. It listens, looks for keywords, and picks a prepared answer. It isn’t AI. It’s the foundation that even bigger chatbots are built on: take in a message, decide, reply.
:::

## Let’s cook

### 1. Check Python

```bash terminal
python --version
```

You should see something like `Python 3.12`. On Mac and Linux the command may be `python3` instead, so use that wherever this lesson says `python`.

### 2. Set up the kitchen

Create a folder called `adobo-bot`, and inside it a new file called `chatbot.py`.

### 3. Write the bot

Copy this into `chatbot.py` and save it:

```python chatbot.py
print("AdoboBot: Hi! Ask me about adobo. Type 'bye' to leave.")

while True:
    message = input("You: ").lower()
    words = message.split()

    if message == "bye":
        print("AdoboBot: Kain na! Bye!")
        break
    elif "hello" in words or "hi" in words:
        print("AdoboBot: Hello! Are you hungry?")
    elif "vinegar" in message:
        print("AdoboBot: Vinegar gives adobo its tangy taste.")
    elif "garlic" in message:
        print("AdoboBot: Lots of garlic. Never skip the garlic!")
    elif "ingredient" in message:
        print("AdoboBot: Chicken, soy sauce, vinegar, black pepper, sugar, bay leaf, garlic, onion, water and oil.")
    else:
        print("AdoboBot: Sorry, I only know a little about adobo so far.")
```

### 4. Start the conversation

In your terminal, go into the folder and run the file:

```bash terminal
cd adobo-bot
python chatbot.py
```

Type a message and press Enter. Type `bye` to stop.

### 5. What is each part doing?

:::map Code | In the kitchen
- `input("You: ")` | The waiter asks for your order and waits
- `.lower()` | Treats “Vinegar” and “vinegar” as the same word
- `while True:` | Keep serving until someone closes the kitchen
- `if / elif / else` | Choose the right prepared answer
- `break` | Close the kitchen and stop
:::

:::taste
Try a short conversation:

```text
You: hello
AdoboBot: Hello! Are you hungry?
You: what does vinegar do?
AdoboBot: Vinegar gives adobo its tangy taste.
You: what are the ingredients?
AdoboBot: Chicken, soy sauce, vinegar, black pepper, sugar, bay leaf, garlic, onion, water and oil.
You: bye
AdoboBot: Kain na! Bye!
```

If you see a red error instead, taste and adjust: check that every `if`, `elif` and `else` line ends with a colon, and that the lines under them are indented the same amount.
:::

:::own
- Type `hello!` with the exclamation mark. The bot doesn’t greet you back. Can you work out why, and fix it?
- Add another keyword, like `chicken`, `sugar` or `soy sauce`, with its own answer.
- Give the bot a joke to tell when someone types `joke`.
:::

## What you learned

- A chatbot is a loop: read a message, decide, reply.
- `input()` reads what the user types, and `print()` shows the answer.
- `if`, `elif` and `else` let the program choose between answers.
