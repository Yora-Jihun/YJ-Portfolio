---
title: Give it a memory
path: chatbot
order: 2
summary: Teach your bot to remember your name, keep its answers in a tidy list, and save the conversation to a file.
serves: Anyone who finished the previous lesson
time: 25 minutes
level: Beginner
ingredients:
  - Your adobo-bot folder from the previous lesson
  - Python 3, a text editor and a terminal
searchHint: Add memory, a dictionary of answers and a chat log to your Python chatbot
keywords: chatbot python dictionary function variable f-string file log memory beginner
---

:::analogy
A great server remembers your name, and keeps a tidy recipe notebook instead of trying to remember every answer in their head. When a guest asks about garlic, they look up “garlic” in the notebook.

We’ll give the bot the same three things: a notebook of answers (a dictionary), a habit it can repeat (a function), and a memory of who it’s talking to (a variable).
:::

## Let’s cook

### 1. Keep the answers in a notebook

In Python, a dictionary pairs a keyword with an answer. Create a new file called `chatbot2.py` and start with this:

```python chatbot2.py
answers = {
    "vinegar": "Vinegar gives adobo its tangy taste.",
    "garlic": "Lots of garlic. Never skip the garlic!",
    "soy sauce": "Soy sauce adds the salty, savoury flavour.",
    "ingredient": "Chicken, soy sauce, vinegar, black pepper, sugar, bay leaf, garlic, onion, water and oil.",
}
```

Each line is `"keyword": "answer",`. Adding a new answer later means adding one new line here.

### 2. Write a recipe you can reuse

A function is a named recipe. Add this below the dictionary:

```python chatbot2.py
def find_answer(message):
    for keyword, answer in answers.items():
        if keyword in message:
            return answer
    return None
```

It looks through the notebook, one keyword at a time. If the message contains a keyword, it hands back that answer. If nothing matches, it returns `None`, which means “nothing found”.

### 3. Remember the guest’s name

Add the greeting and the conversation loop, so the finished file looks like this:

```python chatbot2.py
answers = {
    "vinegar": "Vinegar gives adobo its tangy taste.",
    "garlic": "Lots of garlic. Never skip the garlic!",
    "soy sauce": "Soy sauce adds the salty, savoury flavour.",
    "ingredient": "Chicken, soy sauce, vinegar, black pepper, sugar, bay leaf, garlic, onion, water and oil.",
}


def find_answer(message):
    for keyword, answer in answers.items():
        if keyword in message:
            return answer
    return None


print("AdoboBot: Hi! What's your name?")
name = input("You: ").strip().title()
print(f"AdoboBot: Nice to meet you, {name}! Ask me about adobo. Type 'bye' to leave.")

while True:
    message = input(f"{name}: ").lower()

    if message == "bye":
        print(f"AdoboBot: Bye, {name}! Kain na!")
        break

    answer = find_answer(message)
    if answer:
        print("AdoboBot:", answer)
    else:
        print("AdoboBot: I don't know that yet. Try asking about vinegar, garlic, soy sauce or the ingredients.")
```

The variable `name` holds what the guest typed, and the `f"...{name}..."` strings drop it into each reply. Run it with `python chatbot2.py`.

### 4. Keep a chat log

Add these three lines inside the loop, right after the `message = input(...)` line and before the `if message == "bye":` line:

```python chatbot2.py
    with open("chat-log.txt", "a", encoding="utf-8") as log:
        log.write(f"{name}: {message}\n")
```

`open(..., "a")` opens the file `chat-log.txt` and adds to the end of it, like writing in a guest book. Each message is saved as its own line.

:::taste
Run the bot and chat for a bit:

```text
AdoboBot: Hi! What's your name?
You: maria
AdoboBot: Nice to meet you, Maria! Ask me about adobo. Type 'bye' to leave.
Maria: why soy sauce?
AdoboBot: Soy sauce adds the salty, savoury flavour.
Maria: bye
AdoboBot: Bye, Maria! Kain na!
```

Then open the new `chat-log.txt` file in your folder. You should see every message you typed, one per line.

If Python says a name isn’t defined, taste and adjust: check that the function and dictionary are above the loop, and that you spelled `find_answer` the same way everywhere.
:::

:::own
- Add three more keywords to the `answers` notebook, like `chicken`, `bay leaf` or `onion`.
- Make the bot count how many questions it has answered, and say the number when someone types `bye`.
- Write the time of each message into the log. Search “python datetime now” to learn how.
:::

## Where AI comes in

Real AI chatbots, like Google’s Gemini, don’t use a list of keywords. They’re trained on huge amounts of text and write a fresh reply to whatever you ask. You send them the user’s message through the service’s API, and print what comes back. That would sit exactly where `find_answer` sits in your loop. In the next lesson, you’ll do exactly that.

## What you learned

- A dictionary pairs keywords with answers, and a function packages a step you can reuse.
- A variable like `name` gives your program a memory.
- Writing to a file with `open(..., "a")` keeps a record of the conversation.
