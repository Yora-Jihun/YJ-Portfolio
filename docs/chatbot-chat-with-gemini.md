---
title: Chat with Gemini
path: chatbot
order: 5
summary: Turn AdoboBot into a real conversation that remembers what you said earlier, and greets each guest by name.
serves: Anyone who finished the previous lesson
time: 30 minutes
level: Beginner
ingredients:
  - Your adobo-bot folder, with `adobo_bot.py` working
  - Your `.env` file with the Gemini key
searchHint: Build a multi-turn Gemini chatbot in Python that remembers the conversation
keywords: gemini chat conversation memory multi-turn previous_interaction_id loop input python chatbot beginner
---

:::analogy
Ask a waiter “what’s good today?” and then “and how spicy is that one?”. A good waiter knows what “that one” means, because they remember the last thing you talked about.

Right now, AdoboBot is like a waiter with no short-term memory. Every question starts from zero. Today you give it a memory, by telling Gemini which earlier conversation a new message continues.
:::

## Let’s cook

### 1. See the problem first

Run `adobo_bot.py` twice. First ask “Which is better for adobo, chicken or pork?”, then in a fresh run ask “And how long should I cook it?”. The second time, the bot has no idea what “it” is. Each run is a brand-new conversation.

### 2. Write the chat loop

Create `adobo_chat.py`. It combines what you built in the earlier lessons: the name, the loop and “bye”, plus Gemini for the answers:

```python adobo_chat.py
from dotenv import load_dotenv
from google import genai

load_dotenv()

MODEL = "gemini-3.8-flash"

client = genai.Client()

print("AdoboBot: Hi! What's your name?")
name = input("You: ").strip().title() or "friend"

briefing = f"""You are AdoboBot, a friendly Filipino home cook who loves adobo.
The guest's name is {name}. Use their name now and then, but not in every reply.
Answer in two or three short sentences, in plain words a beginner understands.
If a question is not about cooking, politely steer the conversation back to food."""

print(f"AdoboBot: Nice to meet you, {name}! Ask me anything about cooking. Type 'bye' to leave.")

previous_id = None

while True:
    message = input(f"{name}: ").strip()

    if not message:
        continue

    if message.lower() == "bye":
        print(f"AdoboBot: Bye, {name}! Kain na!")
        break

    request = {
        "model": MODEL,
        "input": message,
        "system_instruction": briefing,
    }
    if previous_id:
        request["previous_interaction_id"] = previous_id

    interaction = client.interactions.create(**request)
    previous_id = interaction.id

    print("AdoboBot:", interaction.output_text)
```

Run it with `python adobo_chat.py`.

### 3. How the memory works

Every answer from Gemini comes with an `id`, like a receipt number. The line `previous_id = interaction.id` keeps the latest receipt. On the next message, we hand it back with `previous_interaction_id`, which tells Gemini “this continues that conversation”.

The `if previous_id:` check is there because the very first message has no earlier conversation to point to.

:::map Piece | What it does
- `name` and `briefing` | Put the guest’s name into the instructions, like the variable you used in the memory lesson
- `previous_id` | Holds the receipt number of the latest answer
- `request = {...}` | Collects everything we’re sending, so we can add the receipt only when we have one
- `client.interactions.create(**request)` | Sends the whole request. The `**` unpacks the collection into separate settings
- `if not message: continue` | Ignores empty lines, so pressing Enter by accident doesn’t waste a request
:::

The system instruction is sent again with every message. That’s on purpose, since the briefing applies to each turn, so don’t remove it from the loop.

:::note Where does the memory live?
By default, Google keeps your conversation on its servers for a while, which is what lets the receipt number work. That means you shouldn’t type anything private into your bot, like passwords or personal details. The settings and how long conversations are kept are in Google’s Gemini API documentation.
:::

:::taste
Try this conversation:

```text
AdoboBot: Hi! What's your name?
You: maria
AdoboBot: Nice to meet you, Maria! Ask me anything about cooking. Type 'bye' to leave.
Maria: Which is better for adobo, chicken or pork?
AdoboBot: (a short, friendly answer about both)
Maria: And how long should I cook it?
AdoboBot: (an answer about cooking time that clearly refers to your last question)
Maria: bye
AdoboBot: Bye, Maria! Kain na!
```

The exact words from AdoboBot will differ, but the second answer should make sense without you repeating what “it” is. That’s the memory working.

If the bot forgets what you said, taste and adjust: check that `previous_id = interaction.id` is inside the loop, and that you pass `previous_interaction_id` in the request.
:::

:::own
- Ask a follow-up that only makes sense with memory, like “what about with less salt?”, and check the answer.
- Add `bye` handling for capital letters, like “Bye” or “BYE”. Can you tell why it already works?
- Save the chat to a text file with `open(..., "a")`, like you did in the memory lesson.
:::

## What you learned

- Each request to Gemini is separate, unless you link it to an earlier one with `previous_interaction_id`.
- The system instruction is sent with every turn, and it can include details like the guest’s name.
- Building a request step by step lets you add a piece only when you have it.
